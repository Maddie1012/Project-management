import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import IssuesPage from './pages/IssuesPage';
import BoardsPage from './pages/BoardsPage';
import BoardPage from './pages/BoardPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/issues" replace />} />

        <Route path="/issues" element={<IssuesPage />}></Route>
        <Route path="/boards" element={<BoardsPage />}></Route>
        <Route path="/board/:id" element={<BoardPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
