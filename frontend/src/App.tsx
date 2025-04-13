import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import IssuesPage from './pages/IssuesPage';
import BoardsPage from './pages/BoardsPage';
import BoardPage from './pages/BoardPage';

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateClick = () => {
    setModalOpen(true);
  };

  return (
    <BrowserRouter>
      <Header onCreateClick={handleCreateClick} />
      <Routes>
        <Route path="/" element={<Navigate to="/issues" replace />} />
        <Route
          path="/issues"
          element={
            <IssuesPage
              modalOpen={modalOpen}
              onModalClose={() => setModalOpen(false)}
            />
          }
        />
        <Route path="/boards" element={<BoardsPage />}></Route>
        <Route path="/boards/:id" element={<BoardPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
