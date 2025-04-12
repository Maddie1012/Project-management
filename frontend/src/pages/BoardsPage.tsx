import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Grid,
  Box,
} from '@mui/material';

function BoardsPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/v1/tasks', {
        headers: {
          Accept: 'application/json',
        },
      })
      .then(response => {
        setTasks(response.data.data);
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

  const handleCardClick = (task) => {
    setSelectedTask(task);
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
      {tasks.length > 0 ? (
        <Grid container spacing={2} flexDirection={'column'}>
          {tasks.map(task => (
            <Grid item xs={12} key={task.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'row',
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
                    {task.boardName}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Box component={Link} to={'boards/:id'}>
                    Перейти к доске
                  </Box>
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
    </Container>
  );
}

export default BoardsPage;
