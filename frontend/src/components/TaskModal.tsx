import {
  Box,
  Modal,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Typography
} from '@mui/material';

const TaskModal = ({
  open,
  onClose,
  task,
  formData,
  users,
  onInputChange,
  onUpdateTask,
  onCreateTask,
  isIssuesPage = false,
  mode = 'edit', // 'edit' или 'create'
}) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="task-modal-title">
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
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          {mode === 'edit' ? 'Редактирование задачи' : 'Создание новой задачи'}
        </Typography>
        
        <Box display={'flex'} flexDirection={'column'} gap={'20px'}>
          <TextField
            name="title"
            label="Название"
            value={formData.title}
            onChange={onInputChange}
            fullWidth
            required
          />

          <TextField
            name="description"
            label="Описание"
            value={formData.description}
            onChange={onInputChange}
            multiline
            rows={4}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Проект</InputLabel>
            <Select
              name="boardName"
              value={formData.boardName}
              label="Проект"
              onChange={onInputChange}
              required
            >
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

          <FormControl fullWidth>
            <InputLabel>Приоритет</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              label="Приоритет"
              onChange={onInputChange}
              required
            >
              <MenuItem value="Low">Низкий</MenuItem>
              <MenuItem value="Medium">Средний</MenuItem>
              <MenuItem value="High">Высокий</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Статус"
              onChange={onInputChange}
              required
            >
              <MenuItem value="Backlog">Сделать</MenuItem>
              <MenuItem value="InProgress">В процессе</MenuItem>
              <MenuItem value="Done">Выполнено</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Исполнитель</InputLabel>
            <Select
              name="assigneeId"
              value={formData.assigneeId}
              label="Исполнитель"
              onChange={onInputChange}
            >
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}
          >
            {mode === 'edit' ? (
              <Button
                variant="contained"
                color="primary"
                onClick={onUpdateTask}
              >
                Обновить
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={onCreateTask}
              >
                Создать
              </Button>
            )}
            
            {isIssuesPage && mode === 'edit' && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  window.location.href = `/boards/${task.boardId}`;
                }}
                sx={{ ml: 2 }}
              >
                Перейти на доску
              </Button>
            )}
            <Button variant="outlined" color="error" onClick={onClose}>
              Закрыть
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TaskModal;