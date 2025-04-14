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
import { useState } from 'react';

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
  mode = 'edit',
  disableProjectField = false,
}) => {
  const [touchedFields, setTouchedFields] = useState({
    title: false,
    description: false,
    boardName: false,
    priority: false,
    status: false,
    assigneeId: false
  });

  const handleInputChange = e => {
    const { name } = e.target;
    if (!touchedFields[name]) {
      setTouchedFields(prev => ({
        ...prev,
        [name]: true
      }));
    }
    onInputChange(e);
  };

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.boardName &&
    formData.priority &&
    formData.status &&
    formData.assigneeId;

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
            onChange={handleInputChange}
            onBlur={() => setTouchedFields(prev => ({ ...prev, title: true }))}
            fullWidth
            required
            error={!formData.title && touchedFields.title}
            helperText={
              !formData.title && touchedFields.title
                ? 'Это поле обязательно для заполнения'
                : ''
            }
          />

          <TextField
            name="description"
            label="Описание"
            value={formData.description}
            onChange={handleInputChange}
            onBlur={() =>
              setTouchedFields(prev => ({ ...prev, description: true }))
            }
            multiline
            rows={4}
            fullWidth
            required
            error={!formData.description && touchedFields.description}
            helperText={
              !formData.description && touchedFields.description
                ? 'Это поле обязательно для заполнения'
                : ''
            }
          />

          <FormControl
            fullWidth
            required
            error={!formData.boardName && touchedFields.boardName}
            disabled={disableProjectField}
          >
            <InputLabel>Проект</InputLabel>
            <Select
              name="boardName"
              value={formData.boardName}
              label="Проект"
              onChange={handleInputChange}
              onBlur={() =>
                setTouchedFields(prev => ({ ...prev, boardName: true }))
              }
              required
              error={!formData.boardName && touchedFields.boardName}
              disabled={disableProjectField}
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
            {!formData.boardName && touchedFields.boardName && (
              <Typography variant="caption" color="error">
                Это поле обязательно для заполнения
              </Typography>
            )}
          </FormControl>

          <FormControl
            fullWidth
            required
            error={!formData.priority && touchedFields.priority}
          >
            <InputLabel>Приоритет</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              label="Приоритет"
              onChange={handleInputChange}
              onBlur={() =>
                setTouchedFields(prev => ({ ...prev, priority: true }))
              }
              required
              error={!formData.priority && touchedFields.priority}
            >
              <MenuItem value="Low">Низкий</MenuItem>
              <MenuItem value="Medium">Средний</MenuItem>
              <MenuItem value="High">Высокий</MenuItem>
            </Select>
            {!formData.priority && touchedFields.priority && (
              <Typography variant="caption" color="error">
                Это поле обязательно для заполнения
              </Typography>
            )}
          </FormControl>

          <FormControl
            fullWidth
            required
            error={!formData.status && touchedFields.status}
          >
            <InputLabel>Статус</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Статус"
              onChange={handleInputChange}
              onBlur={() =>
                setTouchedFields(prev => ({ ...prev, status: true }))
              }
              required
              error={!formData.status && touchedFields.status}
            >
              <MenuItem value="Backlog">Сделать</MenuItem>
              <MenuItem value="InProgress">В процессе</MenuItem>
              <MenuItem value="Done">Выполнено</MenuItem>
            </Select>
            {!formData.status && touchedFields.status && (
              <Typography variant="caption" color="error">
                Это поле обязательно для заполнения
              </Typography>
            )}
          </FormControl>

          <FormControl
            fullWidth
            required
            error={!formData.assigneeId && touchedFields.assigneeId}
          >
            <InputLabel>Исполнитель</InputLabel>
            <Select
              name="assigneeId"
              value={formData.assigneeId}
              label="Исполнитель"
              onChange={handleInputChange}
              onBlur={() =>
                setTouchedFields(prev => ({ ...prev, assigneeId: true }))
              }
              required
              error={!formData.assigneeId && touchedFields.assigneeId}
            >
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.fullName}
                </MenuItem>
              ))}
            </Select>
            {!formData.assigneeId && touchedFields.assigneeId && (
              <Typography variant="caption" color="error">
                Это поле обязательно для заполнения
              </Typography>
            )}
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            {mode === 'edit' ? (
              <Button
                variant="contained"
                color="primary"
                onClick={onUpdateTask}
                disabled={!isFormValid}
              >
                Обновить
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={onCreateTask}
                disabled={!isFormValid}
              >
                Создать
              </Button>
            )}

            {isIssuesPage && mode === 'edit' && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  window.location.href = `/boards/${task.boardId}?boardName=${encodeURIComponent(task.boardName)}&taskId=${task.id}`;
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
