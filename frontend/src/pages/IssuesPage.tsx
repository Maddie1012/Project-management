import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { getTasks, getUsers } from '../api/metods';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Grid,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  InputAdornment,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskModal from '../components/TaskModal';

function IssuesPage({ modalOpen = false, onModalClose }) {
  const location = useLocation();
  const isIssuesPage = location.pathname === '/issues';
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    assigneeId: '',
    boardName: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    board: '',
  });
  const [modalMode, setModalMode] = useState('edit');


  useEffect(() => {
    if (modalOpen) {
      handleCreateClick();
    }
  }, [modalOpen]);

  const handleCloseModal = () => {
    setOpenModal(false);
    onModalClose?.();
  };

  // Загрузка задач
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Загрузка пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Ошибка загрузки пользователей:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority || '',
      status: task.status || '',
      assigneeId: task.assignee?.id || '',
      boardName: task.boardName || '',
    });
    setModalMode('edit');
    setOpenModal(true);
  };

  const handleCreateClick = () => {
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      priority: '',
      status: '',
      assigneeId: '',
      boardName: '',
    });
    setModalMode('create');
    setOpenModal(true);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Фильтрация задач
  const filteredTasks = tasks.filter(task => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      searchTerm === '' ||
      task.title.toLowerCase().includes(searchLower) ||
      (task.assignee &&
        task.assignee.fullName.toLowerCase().includes(searchLower));

    const matchesStatus =
      filters.status === '' || task.status === filters.status;
    const matchesBoard =
      filters.board === '' || task.boardName === filters.board;
    
    return matchesSearch && matchesStatus && matchesBoard;
  });

  // Обновление задачи
  const handleUpdateTask = async () => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assigneeId: formData.assigneeId,
      };

      await axios.put(
        `http://localhost:8080/api/v1/tasks/update/${selectedTask.id}`,
        payload,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const updatedTask = {
        ...selectedTask,
        ...payload,
        boardName: formData.boardName,
        assignee: users.find(user => user.id === formData.assigneeId) || null,
      };

      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );

      setOpenModal(false);
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
      setError(error.message);
      alert('Произошла ошибка при обновлении задачи');
    }
  };


  const handleCreateTask = async () => {
    try {
      const referenceTask = tasks.find(task => task.boardName === formData.boardName);
      
      if (!referenceTask) {
        throw new Error('Не удалось найти boardId для выбранного проекта');
      }
  
      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        assigneeId: formData.assigneeId,
        boardId: referenceTask.boardId,
        status: formData.status || 'Backlog', // Добавляем статус из формы или по умолчанию
      };
  
      const response = await axios.post(
        'http://localhost:8080/api/v1/tasks/create',
        payload,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Создаем полный объект задачи со всеми необходимыми данными
      const newTask = {
        ...response.data,
        id: response.data.id || Date.now(), // Используем ID из ответа или временный
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status || 'Backlog',
        assignee: users.find(user => user.id === formData.assigneeId) || null,
        boardName: formData.boardName,
        boardId: referenceTask.boardId,
        createdAt: new Date().toISOString(), // Добавляем дату создания
      };
  
      setTasks(prevTasks => [...prevTasks, newTask]);
      setOpenModal(false);
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      setError(error.message);
      alert(`Произошла ошибка при создании задачи: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">Ошибка: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, maxWidth: 'md', position: 'relative' }}>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Поиск по задачам и исполнителям"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">🔍</InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Статус</InputLabel>
          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            label="Статус"
          >
            <MenuItem value="">Все статусы</MenuItem>
            <MenuItem value="Backlog">Сделать</MenuItem>
            <MenuItem value="InProgress">В процессе</MenuItem>
            <MenuItem value="Done">Сделано</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Проект</InputLabel>
          <Select
            name="board"
            value={filters.board}
            onChange={handleFilterChange}
            label="Проект"
          >
            <MenuItem value="">Все проекты</MenuItem>
            <MenuItem value="Редизайн карточки товара">
              Редизайн карточки товара
            </MenuItem>
            <MenuItem value="Оптимизация производительности">
              Оптимизация производительности
            </MenuItem>
            <MenuItem value="Рефакторинг API">Рефакторинг API</MenuItem>
            <MenuItem value="Миграция на новую БД">
              Миграция на новую БД
            </MenuItem>
            <MenuItem value="Автоматизация тестирования">
              Автоматизация тестирования
            </MenuItem>
            <MenuItem value="Переход на Kubernetes">
              Переход на Kubernetes
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredTasks.length > 0 ? (
        <Grid container spacing={2} flexDirection={'column'}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} key={task.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease',
                  },
                }}
                onClick={() => handleCardClick(task)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {task.title}
                  </Typography>
                  {task.status && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Статус: {
                        {
                          'Backlog': 'Сделать',
                          'InProgress': 'В процессе',
                          'Done': 'Выполнено'
                        }[task.status] || task.status
                      }
                    </Typography>
                  )}
                  {task.assignee && (
                    <Typography variant="body2" color="text.secondary">
                      Исполнитель: {task.assignee.fullName}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Нет задач для отображения
        </Typography>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
        }}
        onClick={handleCreateClick}
      >
        <AddIcon />
      </Fab>

      <TaskModal
        open={openModal}
        onClose={handleCloseModal}
        task={selectedTask}
        formData={formData}
        users={users}
        onInputChange={handleInputChange}
        onUpdateTask={handleUpdateTask}
        onCreateTask={handleCreateTask}
        isIssuesPage={isIssuesPage}
        mode={modalMode}
      />
    </Container>
  );
}

export default IssuesPage;