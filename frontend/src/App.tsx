import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/login/Login";
import MainPage from './components/mainPage/mainPage';
import Navbar from './components/shared/navbar';
import Register from './components/register/register';
import MyTransactions from './components/myTransactions/mytransactions';

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-transactions" element={<MyTransactions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/store" element={<MainPage />} />
      </Routes>
    </Router>
  )
}

export default App
