import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import QuizPage from './components/QuizPage';
import './App.css';

const App = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: '', usn: '' });

 
  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setUserData(data);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/quiz" replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />

          
          <Route
            path="/quiz"
            element={
              isLoggedIn ? (
                <QuizPage userData={userData} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

         
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
