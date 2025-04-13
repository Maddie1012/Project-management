import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import IssuesPage from './pages/IssuesPage';
import BoardsPage from './pages/BoardsPage';
import BoardPage from './pages/BoardPage';
import TaskModal from './components/TaskModal';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    status: 'Backlog',
    assigneeId: '',
    boardName: '',
  });

  // Загрузка пользователей при монтировании
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

  const handleCreateClick = () => {
    setFormData({
      title: '',
      description: '',
      priority: '',
      status: 'Backlog',
      assigneeId: '',
      boardName: '',
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTask = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/tasks/create',
        {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: formData.status,
          assigneeId: formData.assigneeId,
          boardName: formData.boardName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Закрываем модальное окно после успешного создания
      setModalOpen(false);
      // Можно добавить обновление списка задач или редирект
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      alert('Не удалось создать задачу');
    }
  };

  return (
    <BrowserRouter>
      <Header onCreateClick={handleCreateClick} />
      <Routes>
        <Route path="/" element={<Navigate to="/issues" replace />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:id" element={<BoardPage />} />
      </Routes>

      <TaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        formData={formData}
        users={users}
        onInputChange={handleInputChange}
        onCreateTask={handleCreateTask}
        mode="create"
      />
    </BrowserRouter>
  );
}

export default App;