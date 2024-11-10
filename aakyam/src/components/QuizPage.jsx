import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './QuizPage.css';

const QuizPage = ({ userData }) => {
  const [answers, setAnswers] = useState(Array(15).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [startTime, setStartTime] = useState(Date.now()); // Record start time
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const questions = [
    { question: "Which festival celebrated in Andhra Pradesh and Telangana marks the Telugu New Year?", options: ["Ugadi", "Diwali", "Sankranti", "Dussehra"], correct: "Ugadi", critical: true },
    { question: "What is the name of the harvest festival celebrated with special significance in Telangana, including the decoration of cows and bulls?", options: ["Bathukamma", "Bonalu", "Sankranti", "Diwali"], correct: "Sankranti", critical: false },
    { question: "Which unique floral festival celebrated in Telangana is dedicated to Goddess Gauri, where women arrange flowers in a pot?", options: ["Bathukamma", "Ugadi", "Holi", "Ganesh Chaturthi"], correct: "Bathukamma", critical: true },
    { question: "In Andhra Pradesh, which festival is celebrated with Bonam offerings to Mother Goddess Mahakali, especially in Hyderabad?", options: ["Bonalu", "Bathukamma", "Diwali", "Ugadi"], correct: "Bonalu", critical: false },
    { question: "Which festival celebrated in Andhra Pradesh involves decorating homes with rangoli and lighting lamps to ward off evil spirits?", options: ["Karthika Masam", "Diwali", "Sankranti", "Dussehra"], correct: "Karthika Masam", critical: true },
    { question: "Which festival celebrates the birth of Lord Krishna and is marked by fasting and midnight celebrations?", options: ["Janmashtami", "Ram Navami", "Holi", "Diwali"], correct: "Janmashtami", critical: false },
    { question: "Which festival marks the victory of good over evil, with the burning of Ravana’s effigy in northern India?", options: ["Dussehra", "Holi", "Diwali", "Raksha Bandhan"], correct: "Dussehra", critical: true },
    { question: "Which festival is known as the festival of lights and celebrates the return of Lord Rama to Ayodhya?", options: ["Diwali", "Holi", "Pongal", "Onam"], correct: "Diwali", critical: true },
    { question: "What festival in Kerala is celebrated with the creation of intricate flower designs called Pookalam?", options: ["Onam", "Pongal", "Diwali", "Vishu"], correct: "Onam", critical: false },
    { question: "In which festival do people in Punjab celebrate the harvest season with bhangra and gidda dances?", options: ["Baisakhi", "Lohri", "Holi", "Dussehra"], correct: "Baisakhi", critical: false },
    { question: "Which festival in Andhra Pradesh is celebrated to honor ancestors with offerings and prayers?", options: ["Pitru Paksha", "Diwali", "Ganesh Chaturthi", "Makar Sankranti"], correct: "Pitru Paksha", critical: true },
    { question: "Which festival is celebrated with kites flying and special sweets made of sesame and jaggery in Telangana?", options: ["Sankranti", "Diwali", "Ugadi", "Navratri"], correct: "Sankranti", critical: false },
    { question: "Which festival signifies the arrival of spring and involves playing with colors?", options: ["Holi", "Diwali", "Eid", "Navratri"], correct: "Holi", critical: true },
    { question: "Which festival in Telangana includes the traditional Marigold flower arrangements and community gatherings?", options: ["Bathukamma", "Onam", "Raksha Bandhan", "Christmas"], correct: "Bathukamma", critical: false },
    { question: "Which festival marks the harvest season in Tamil Nadu and is celebrated with traditional food and cultural events?", options: ["Pongal", "Ugadi", "Onam", "Diwali"], correct: "Pongal", critical: true }
  ];

  const shuffleQuestions = () => {
    setShuffledQuestions(questions.sort(() => 0.5 - Math.random()).slice(0, 15));
  };

  useEffect(() => {
    shuffleQuestions();
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (['t', 'n', 'w'].includes(e.key)) {
          e.preventDefault();
        }
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        console.log('User navigated away');
      } else if (document.visibilityState === 'visible') {
        setLocked(true);
      }
    });
    return () => {
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
      document.removeEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
          if (['t', 'n', 'w'].includes(e.key)) {
            e.preventDefault();
          }
        }
      });
      document.removeEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          console.log('User navigated away');
        } else if (document.visibilityState === 'visible') {
          setLocked(true);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    let tempScore = 0;

    shuffledQuestions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        tempScore++;
      }
    });

    setScore(tempScore);
    setSubmitted(true);
    setShowScore(true);
    setShowEmojis(true);

    const timeTaken = 300 - timeLeft; // Calculate time taken in seconds

    try {
      await axios.post('https://usebasin.com/f/119065782b5f', {
        name: userData.name,
        usn: userData.usn,
        score: tempScore,
        totalQuestions: shuffledQuestions.length,
        timeTaken, // Send time taken to API
      });
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="container quiz-container bg-dark text-light py-4 mt-4 shadow rounded">
      <h2 className="text-center mb-4">🎉 Welcome to the AIKYAM Quiz! 🎉</h2>
      <div className="timer text-center mb-3">
        <h5>Time Left: {formatTime(timeLeft)}</h5>
      </div>
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
                {shuffledQuestions.map((q, index) => (
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
              {!submitted && (
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Submit
                </button>
              )}
            </form>
            {showScore && (
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
                <span role="img" aria-label="trophy">🎊</span>
                <span role="img" aria-label="smile">🎉</span>
              </div>
            )}
          </div>
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
