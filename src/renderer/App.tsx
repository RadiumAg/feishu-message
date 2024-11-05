import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import FSMessage from './pages/fs-message';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FSMessage />} />
      </Routes>
    </Router>
  );
}
