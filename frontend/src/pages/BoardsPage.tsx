import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import TaskModal from '../components/TaskModal';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Grid,
  Box,
  Button,
} from '@mui/material';

function BoardsPage({ modalOpen = false, onModalClose }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const location = useLocation();
  const isIssuesPage = location.pathname === '/issues';
  const [uniqueBoards, setUniqueBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalMode, setModalMode] = useState('edit');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    assigneeId: '',
    boardName: '',
  });

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/v1/tasks', {
        headers: {
          Accept: 'application/json',
        },
      })
      .then(response => {
        setTasks(response.data.data);

        // получение уникальных досок
        const boardsMap = new Map();
        response.data.data.forEach(task => {
          if (task.boardName && task.boardId) {
            boardsMap.set(task.boardId, {
              boardName: task.boardName,
              boardId: task.boardId,
            });
          }
        });

        setUniqueBoards(Array.from(boardsMap.values()));
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка при запросе:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (modalOpen) {
      handleCreateClick();
    }
  }, [modalOpen]);

  const handleCreateClick = () => {
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      priority: '',
      status: 'Backlog',
      assigneeId: '',
      boardName: '',
    });
    setModalMode('create');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    onModalClose?.();
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
        prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
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
      const referenceTask = tasks.find(
        task => task.boardName === formData.boardName
      );

      if (!referenceTask) {
        throw new Error('Не удалось найти boardId для выбранного проекта');
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        assigneeId: formData.assigneeId,
        boardId: referenceTask.boardId,
        status: formData.status || 'Backlog',
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

      const newTask = {
        ...response.data,
        id: response.data.id || Date.now(),
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status || 'Backlog',
        assignee: users.find(user => user.id === formData.assigneeId) || null,
        boardName: formData.boardName,
        boardId: referenceTask.boardId,
        createdAt: new Date().toISOString(),
      };

      setTasks(prevTasks => [...prevTasks, newTask]);
      setOpenModal(false);
      onModalClose?.();
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      setError(error.message);
      alert(`Произошла ошибка при создании задачи: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
      >
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
      {uniqueBoards.length > 0 ? (
        <Grid container spacing={2} flexDirection={'column'}>
          {uniqueBoards.map(board => (
            <Grid item xs={12} key={board.boardId}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {board.boardName}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Button
                    component={Link}
                    to={`/boards/${board.boardId}?boardName=${encodeURIComponent(board.boardName)}`}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      textTransform: 'none',
                      '&:hover': {
                        textDecoration: 'none',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    Перейти к доске
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Нет досок для отображения
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
        onCreateTask={handleCreateTask}
        isIssuesPage={isIssuesPage}
        mode={modalMode}
      />
    </Container>
  );
}

export default BoardsPage;
