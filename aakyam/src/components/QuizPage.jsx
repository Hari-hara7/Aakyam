import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './QuizPage.css';

const QuizPage = ({ userData }) => {
  const [answers, setAnswers] = useState(Array(10).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  
  // Store the original title to reset later
  const originalTitle = document.title;

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

    try {
      await axios.post('https://usebasin.com/f/f830d525824e', {
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
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  };

  useEffect(() => {
    enterFullScreen(); // Enter full-screen when component mounts

    document.addEventListener('contextmenu', preventRightClick);
    document.addEventListener('keydown', preventKeyboardShortcuts);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        alert('You have navigated away from the quiz. Please stay on this page to continue.');
        document.title = 'Quiz Alert!';
        setTimeout(() => {
          document.title = originalTitle;
        }, 2000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [originalTitle]);

  return (
    <div className="container quiz-container bg-dark text-light py-4 mt-4 shadow rounded">
      <h2 className="text-center mb-4">Aikyam Quiz</h2>
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
            <button type="submit" className="btn btn-primary btn-block mt-4">Submit Quiz</button>
          </form>
        </div>
      </div>
      
      {submitted && showScore && (
      <div className="score-section mt-4 text-center">
      <h4>Well done, {userData.name}!</h4>
      <p>Your USN: <strong>{userData.usn}</strong></p>
      <p>Your Score: <strong>{score} / {questions.length}</strong></p>
      <p>Thanks for taking the AIKYAM Quiz! Great effort!</p>
    </div>
      )}
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
