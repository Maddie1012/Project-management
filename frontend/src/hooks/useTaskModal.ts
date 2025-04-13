// hooks/useTaskModal.js
import { useState } from 'react';

export const useTaskModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTask, setSelectedTask] = useState(null);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setModalMode('edit');
    setSelectedTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return {
    modalOpen,
    modalMode,
    selectedTask,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};