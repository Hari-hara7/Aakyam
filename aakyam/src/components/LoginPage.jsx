import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FaUser, FaIdBadge } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import backgroundImage from '../assets/81804.jpg';

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
      
      await axios.post('https://usebasin.com/f/119065782b5f', { name, usn });
      setError('');

      
      onLogin({ name, usn });

      
      setShowWelcome(true);

      
      setTimeout(() => {
        setShowWelcome(false);
        navigate('/quiz'); 
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
          <h3>Welcome to Aikyam, {name}!</h3>
          <p>Your USN: {usn}</p>
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login to Aikyam</h2>

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
