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
  Button,
} from '@mui/material';

function BoardsPage() {
  const [tasks, setTasks] = useState([]);
  const [uniqueBoards, setUniqueBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/v1/tasks', {
        headers: {
          Accept: 'application/json',
        },
      })
      .then(response => {
        setTasks(response.data.data);
        
        // Получаем уникальные доски
        const boardsMap = new Map();
        response.data.data.forEach(task => {
          if (task.boardName && task.boardId) {
            boardsMap.set(task.boardId, {
              boardName: task.boardName,
              boardId: task.boardId
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
                      textDecoration: 'none', // Убираем подчеркивание
                      color: 'inherit', // Наследуем цвет текста
                      textTransform: 'none', // Убираем автоматическое преобразование в верхний регистр
                      '&:hover': {
                        textDecoration: 'none', // Убираем подчеркивание при наведении
                        backgroundColor: 'rgba(0, 0, 0, 0.04)', // Легкий эффект при наведении
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
    </Container>
  );
}

export default BoardsPage;