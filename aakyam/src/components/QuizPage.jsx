import { useState, useEffect } from 'react'; 
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './QuizPage.css';
import PropTypes from 'prop-types';

const QuizPage = ({ userData }) => {
  const [answers, setAnswers] = useState(Array(10).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    // Request full-screen mode when the component mounts
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  }, []);

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Lisbon"],
      correct: "Paris",
      icon: "🌍"
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: "4",
      icon: "➕"
    },
    {
      question: "What is the largest planet in our Solar System?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correct: "Jupiter",
      icon: "🪐"
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Mark Twain", "Charles Dickens", "William Shakespeare", "J.K. Rowling"],
      correct: "William Shakespeare",
      icon: "📖"
    },
    {
      question: "What is the chemical symbol for water?",
      options: ["O2", "H2O", "CO2", "NaCl"],
      correct: "H2O",
      icon: "💧"
    },
    {
      question: "What is the main language spoken in Brazil?",
      options: ["Spanish", "Portuguese", "English", "French"],
      correct: "Portuguese",
      icon: "🇧🇷"
    },
    {
      question: "What is the tallest mountain in the world?",
      options: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"],
      correct: "Mount Everest",
      icon: "⛰️"
    },
    {
      question: "What is the currency of Japan?",
      options: ["Yen", "Dollar", "Euro", "Won"],
      correct: "Yen",
      icon: "💴"
    },
    {
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Iron", "Diamond", "Ruby"],
      correct: "Diamond",
      icon: "💎"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Mars", "Earth", "Venus", "Saturn"],
      correct: "Mars",
      icon: "🔴"
    }
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

    // Send score and user data to Formspree
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

    // Exit full-screen after quiz submission
    exitFullScreen();
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Quiz Page</h2>
      <form className="quiz-form" onSubmit={handleSubmit}>
        {questions.map((q, index) => (
          <div key={index} className="quiz-question">
            <span className="quiz-icon">{q.icon}</span>
            <p>{q.question}</p>
            {q.options.map((option) => (
              <div key={option} className="form-check">
                <input
                  type="radio"
                  id={`question-${index}-option-${option}`}
                  name={`question-${index}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={() => handleAnswerChange(index, option)}
                  className="form-check-input"
                />
                <label htmlFor={`question-${index}-option-${option}`} className="form-check-label">
                  {option}
                </label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="btn btn-primary submit-button">Submit</button>
      </form>

      {submitted && showScore && (
        <div className="score-display">
          <h3>Thank You, {userData.name}!</h3>
          <p>Your USN: {userData.usn}</p>
          <p>Your score: {score} out of {questions.length}</p>
          <div className="answers">
            <h4>Your Answers:</h4>
            {questions.map((q, index) => (
              <div key={index} className="answer-item">
                <p>{q.question}</p>
                <p className={answers[index] === q.correct ? "correct-answer" : "incorrect-answer"}>
                  {answers[index]} {answers[index] === q.correct ? <FaCheckCircle /> : <FaTimesCircle />}
                  <br />
                  Correct Answer: {q.correct}
                </p>
              </div>
            ))}
          </div>
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
