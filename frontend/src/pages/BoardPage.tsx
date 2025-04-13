import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import TaskModal from "../components/TaskModal";
import {
  Container,
  CircularProgress,
  Alert,
  Typography,
  Paper,
  Card,
  CardContent,
  Box,
} from "@mui/material";

function BoardPage() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const boardNameFromUrl = queryParams.get('boardName');
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    assigneeId: '',
    boardName: '',
  });
  const [users, setUsers] = useState([]); // Состояние для пользователей

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/users', {
          headers: { Accept: "application/json" }
        });
        setUsers(response.data.data);
      } catch (err) {
        console.error("Ошибка при загрузке пользователей:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/boards/${id}`, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        setBoard(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при запросе:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

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

      // Обновляем локальное состояние
      setBoard(prev => prev.map(task => 
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

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        sx={{ display: "flex", justifyContent: "center", mt: 4 }}
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
    <Container maxWidth={false} sx={{ py: 4, px: 3 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Заголовки */}
        <Box sx={{ px: 3 }}>
          <Typography variant="h4" gutterBottom>
            {boardNameFromUrl || (board.length > 0 ? board[0].boardName : "Название проекта")}
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
            Все задачи
          </Typography>
        </Box>

        {/* Колонки */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            pb: 2,
            px: 3,
            width: "100%",
          }}
        >
          {/* To Do Column */}
          <Paper elevation={2} sx={{ width: 350, flexShrink: 0 }}>
            <Box p={2} bgcolor="#f5f5f5" borderRadius="4px 4px 0 0">
              <Typography variant="h6" fontWeight="bold">
                To Do
              </Typography>
            </Box>
            <Box p={2} sx={{ minHeight: 200 }}>
              {board?.map(
                (task) =>
                  task.status === "Backlog" && (
                    <Card
                      key={task.id}
                      sx={{ 
                        mb: 2, 
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 2 },
                      }}
                      onClick={() => handleCardClick(task)}
                    >
                      <CardContent>
                        <Typography>{task.title}</Typography>
                      </CardContent>
                    </Card>
                  )
              )}
            </Box>
          </Paper>

          {/* In Progress Column */}
          <Paper elevation={2} sx={{ width: 350, flexShrink: 0 }}>
            <Box p={2} bgcolor="#fff8e1" borderRadius="4px 4px 0 0">
              <Typography variant="h6" fontWeight="bold">
                In Progress
              </Typography>
            </Box>
            <Box p={2} sx={{ minHeight: 200 }}>
              {board?.map(
                (task) =>
                  task.status === 'InProgress' && (
                    <Card
                      key={task.id}
                      sx={{ 
                        mb: 2, 
                        cursor: 'pointer',
                        "&:hover": { boxShadow: 2 }
                      }}
                      onClick={() => handleCardClick(task)}
                    >
                      <CardContent>
                        <Typography>{task.title}</Typography>
                      </CardContent>
                    </Card>
                  )
              )}
            </Box>
          </Paper>

          {/* Done Column */}
          <Paper elevation={2} sx={{ width: 350, flexShrink: 0 }}>
            <Box p={2} bgcolor="#e8f5e9" borderRadius="4px 4px 0 0">
              <Typography variant="h6" fontWeight="bold">
                Done
              </Typography>
            </Box>
            <Box p={2} sx={{ minHeight: 200 }}>
              {board?.map(
                (task) =>
                  task.status === "Done" && (
                    <Card
                      key={task.id}
                      sx={{ 
                        mb: 2, 
                        cursor: "pointer",
                        "&:hover": { boxShadow: 2 }
                      }}
                      onClick={() => handleCardClick(task)}
                    >
                      <CardContent>
                        <Typography>{task.title}</Typography>
                      </CardContent>
                    </Card>
                  )
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
      <TaskModal
        open={openModal}
        onClose={handleCloseModal}
        task={selectedTask}
        formData={formData}
        users={users}
        onInputChange={handleInputChange}
        onUpdateTask={handleUpdateTask}
        mode="edit"
      />
    </Container>
  );
}

export default BoardPage;