import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import QuizPage from './components/QuizPage';
import './App.css';

const App = () => {
  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: '', usn: '' });

  // Function to handle login, receives data from LoginPage
  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setUserData(data);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Route for Login Page */}
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

          {/* Route for Quiz Page, accessible only if logged in */}
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

          {/* Redirect any other route to Login Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
