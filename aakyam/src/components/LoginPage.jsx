import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FaUser, FaIdBadge } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usnRegex = /^NNM23CS\d{3}$/;
    if (!usnRegex.test(usn)) {
      setError("USN must start with 'NNM23CS' followed by three digits.");
      return;
    }

    try {
      // Send data to Formspree
      await axios.post('https://usebasin.com/f/f830d525824e', { name, usn });
      setError('');

      // Call onLogin to update the state in App.js
      onLogin({ name, usn });

      // Show welcome message
      setShowWelcome(true);

      // Navigate to the Quiz page after 3 seconds
      setTimeout(() => {
        setShowWelcome(false);
        navigate('/quiz'); // Navigate to the quiz route
      }, 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="login-container">
      {showWelcome && (
        <div className="welcome-popup">
          <h3>Welcome to Aakyam, {name}!</h3>
          <p>Your USN: {usn}</p>
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login to Aakyam</h2>

        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="login-input"
          />
        </div>

        <div className="input-group">
          <FaIdBadge className="icon" />
          <input
            type="text"
            placeholder="USN"
            value={usn}
            onChange={(e) => setUsn(e.target.value)}
            required
            className="login-input"
          />
        </div>

        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;
