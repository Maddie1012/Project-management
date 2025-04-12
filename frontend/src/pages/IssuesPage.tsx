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
  Modal,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  InputAdornment,
} from '@mui/material';

function IssuesPage() {
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
    project: '',
    priority: '',
    status: '',
    assigneeId: '',
    boardName: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBoard, setFilterBoard] = useState('');

  // загрузка задач
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
        setLoading(false);
        // console.log(data);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // загрузка пользователей
  useEffect(() => {
    const fetchTaskss = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTaskss();
  }, []);

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      project: task.id || '',
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleFilterBoardChange = (e) => {
    setFilterBoard(e.target.value);
  };

  // фильтрация задач
  const filteredTasks = tasks.filter(task => {
    return (
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus ? task.status === filterStatus : true) &&
      (filterBoard ? task.boardName === filterBoard : true)
    );
  });

  // обновление задачи
  const handleUpdateTask = async () => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assigneeId: formData.assigneeId,
      };
  
      // Отправляем только нужные поля на сервер
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
  
      // Создаем полностью обновленный объект задачи для локального состояния
      const updatedTask = {
        ...selectedTask,
        ...payload,
        boardName: formData.boardName, // Сохраняем локальное значение boardName
        assignee: users.find(user => user.id === formData.assigneeId) || null,
      };
  
      // Обновляем локальное состояние
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
          label="Поиск по задачам"
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
          <InputLabel id="status-label">Статус</InputLabel>
          <Select
            labelId="status-label"
            value={filterStatus}
            onChange={handleFilterStatusChange}
            label="Статус"
          >
            <MenuItem value="">Все</MenuItem>
            <MenuItem value="Backlog">Backlog</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="board-label">Проект</InputLabel>
          <Select
            labelId="board-label"
            value={filterBoard}
            onChange={handleFilterBoardChange}
            label="Проект"
          >
            <MenuItem value="">Все</MenuItem>
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
                      Статус: {task.status}
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

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="task-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '80%', md: '60%' },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {selectedTask && (
            <Box display={'flex'} flexDirection={'column'} gap={'20px'}>
              <TextField
                name="title"
                label="Название"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
              />

              <TextField
                name="description"
                label="Описание"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel id="project-label">Проект</InputLabel>
                <Select
                  labelId="project-label"
                  name="boardName"
                  value={formData.boardName}
                  label="Проект"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Редизайн карточки товара">
                    Редизайн карточки товара
                  </MenuItem>
                  <MenuItem value="Оптимизация производительности">
                    Оптимизация производительности
                  </MenuItem>
                  <MenuItem value="Рефакторинг API">Рефакторинг API</MenuItem>
                  <MenuItem value={'Миграция на новую БД'}>
                    Миграция на новую БД
                  </MenuItem>
                  <MenuItem value={'Автоматизация тестирования'}>
                    Автоматизация тестирования
                  </MenuItem>
                  <MenuItem value={'Переход на Kubernetes'}>
                    Переход на Kubernetes
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="priority-label">Приоритет</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={formData.priority}
                  label="Приоритет"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Low">Низкий</MenuItem>
                  <MenuItem value="Medium">Средний</MenuItem>
                  <MenuItem value="High">Высокий</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="status-label">Статус</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  label="Статус"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Backlog">Backlog</MenuItem>
                  <MenuItem value="InProgress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="assignee-label">Исполнитель</InputLabel>
                <Select
                  labelId="assignee-label"
                  name="assigneeId"
                  value={formData.assigneeId}
                  label="Исполнитель"
                  onChange={handleInputChange}
                >
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateTask}
                >
                  Обновить
                </Button>
                {isIssuesPage && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      window.location.href = '/boards';
                    }}
                    sx={{ ml: 2 }}
                  >
                    Перейти на доску
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

export default IssuesPage;
