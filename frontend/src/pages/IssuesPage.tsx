import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
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
} from '@mui/material';
import TaskModal from '../components/TaskModal';

function IssuesPage() {
  const location = useLocation();
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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/tasks', {
          headers: { Accept: 'application/json' }
        });
        setTasks(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/users', {
          headers: { Accept: 'application/json' }
        });
        setUsers(response.data.data);
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
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateTask = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/tasks/update/${selectedTask.id}`,
        {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: formData.status,
          assigneeId: formData.assigneeId,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setTasks(prevTasks => prevTasks.map(task => 
        task.id === selectedTask.id ? { 
          ...task, 
          ...formData,
          assignee: users.find(u => u.id === formData.assigneeId) 
        } : task
      ));

      handleCloseModal();
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      alert("Не удалось обновить задачу");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

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
    <Container sx={{ py: 4, maxWidth: 'md' }}>
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

      <TaskModal
        open={openModal}
        onClose={handleCloseModal}
        task={selectedTask}
        formData={formData}
        users={users}
        onInputChange={handleInputChange}
        onUpdateTask={handleUpdateTask}
        isIssuesPage={true}
        mode="edit"
      />
    </Container>
  );
}

export default IssuesPage;