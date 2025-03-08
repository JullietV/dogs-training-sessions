import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Session } from './pages/Session';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/session/:dayId" element={<Session />} />
      </Routes>
    </Router>
  );
}

export default App; 