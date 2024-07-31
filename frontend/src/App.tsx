import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Login from "./components/login/Login";

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </Router>
  )
}

export default App
