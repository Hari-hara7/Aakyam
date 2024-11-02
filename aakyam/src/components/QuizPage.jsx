import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './QuizPage.css';

const QuizPage = ({ userData }) => {
  const [answers, setAnswers] = useState(Array(10).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [locked, setLocked] = useState(false); // Lock the quiz on return

  const questions = [
    { question: "In which festival do people play with colors?", options: ["Holi", "Diwali", "Eid", "Christmas"], correct: "Holi" },
    { question: "Which festival is known as the festival of lights?", options: ["Holi", "Diwali", "Eid", "Christmas"], correct: "Diwali" },
    { question: "Which festival celebrates the birth of Jesus Christ?", options: ["Easter", "Christmas", "Diwali", "Thanksgiving"], correct: "Christmas" },
    { question: "What festival involves fasting during daylight hours for a month?", options: ["Holi", "Diwali", "Eid", "Christmas"], correct: "Eid" },
    { question: "Which festival is known as the harvest festival of Kerala?", options: ["Onam", "Diwali", "Holi", "Pongal"], correct: "Onam" },
    { question: "Which festival marks the start of the new year in the Punjabi calendar?", options: ["Lohri", "Diwali", "Eid", "Christmas"], correct: "Lohri" },
    { question: "Which festival is celebrated with flying kites?", options: ["Holi", "Diwali", "Eid", "Makar Sankranti"], correct: "Makar Sankranti" },
    { question: "Which festival is known for exchanging gifts and sweets?", options: ["Holi", "Diwali", "Raksha Bandhan", "Christmas"], correct: "Raksha Bandhan" },
    { question: "Which Hindu festival marks the victory of Rama over Ravana?", options: ["Dussehra", "Diwali", "Holi", "Eid"], correct: "Dussehra" },
    { question: "Which festival is dedicated to Lord Ganesha?", options: ["Holi", "Ganesh Chaturthi", "Eid", "Diwali"], correct: "Ganesh Chaturthi" }
  ];

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempScore = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        tempScore++;
      }
    });

    setScore(tempScore);
    setSubmitted(true);
    setShowScore(true);
    setShowEmojis(true);

    try {
      await axios.post('https://usebasin.com/f/119065782b5f', {
        name: userData.name,
        usn: userData.usn,
        score: tempScore,
        totalQuestions: questions.length
      });
    } catch (error) {
      console.error("Error sending data to Formspree:", error);
    }
  };

  const preventRightClick = (e) => {
    e.preventDefault();
  };

  const preventKeyboardShortcuts = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 't' || e.key === 'n' || e.key === 'w') {
        e.preventDefault();
      }
    }
  };

  const enterFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  useEffect(() => {
    enterFullScreen();

    document.addEventListener('contextmenu', preventRightClick);
    document.addEventListener('keydown', preventKeyboardShortcuts);

    // Set up focus and visibility change handling
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log('User navigated away');
      } else if (document.visibilityState === 'visible') {
        setLocked(true); // Lock the quiz when user returns
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="container quiz-container bg-dark text-light py-4 mt-4 shadow rounded">
      <h2 className="text-center mb-4">🎉 Welcome to the AIKYAM Quiz! 🎉</h2>
      {locked ? (
        <div className="locked-message text-center">
          <h3>Quiz Locked</h3>
          <p>You navigated away and returned. The quiz is now locked.</p>
        </div>
      ) : (
        <div className="card border-light mb-3">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="questions-section">
                {questions.map((q, index) => (
                  <div key={index} className="question-section mb-4">
                    <h5 className="question-title">{index + 1}. {q.question}</h5>
                    <div className="options-group">
                      {q.options.map((option) => (
                        <div key={option} className="form-check form-check-inline">
                          <input
                            type="radio"
                            className="form-check-input"
                            id={`question-${index}-option-${option}`}
                            name={`question-${index}`}
                            value={option}
                            checked={answers[index] === option}
                            onChange={() => handleAnswerChange(index, option)}
                          />
                          <label className="form-check-label" htmlFor={`question-${index}-option-${option}`}>
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button type="submit" className="btn btn-primary btn-block mt-4" disabled={locked}>
                Submit Quiz
              </button>
            </form>
          </div>
        </div>
      )}

      {submitted && showScore && (
        <div className="score-section mt-4 text-center">
          <h4>Well done, {userData.name}!</h4>
          <p>Your USN: <strong>{userData.usn}</strong></p>
          <p>Your Score: <strong>{score} / {questions.length}</strong></p>
          <p>Thanks for taking the AIKYAM Quiz! Great effort!</p>
        </div>
      )}

      {showEmojis && (
        <div className="emoji-fall">
          <span role="img" aria-label="celebration">🎉</span>
          <span role="img" aria-label="party">🎊</span>
          <span role="img" aria-label="trophy">🏆</span>
          <span role="img" aria-label="smile">😊</span>
        </div>
      )}

      <footer className="footer mt-4 text-center">
        <p>Designed and developed with 💛 by Aikyam Group</p>
      </footer>
    </div>
  );
};

QuizPage.propTypes = {
  userData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    usn: PropTypes.string.isRequired,
  }).isRequired,
};

export default QuizPage;
