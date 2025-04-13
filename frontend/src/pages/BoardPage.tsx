import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            Название проекта
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
                      onClick={() => console.log('Edit task', task.id)}
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
                      onClick={() => console.log("Edit task", task.id)}
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
                      onClick={() => console.log("Edit task", task.id)}
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
    </Container>
  );
}

export default BoardPage;