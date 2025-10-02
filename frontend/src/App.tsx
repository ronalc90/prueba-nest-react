import { Routes, Route } from 'react-router-dom';
import { CoursePage } from './pages/CoursePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CoursePage />} />
      <Route path="/course" element={<CoursePage />} />
    </Routes>
  );
}

export default App;
