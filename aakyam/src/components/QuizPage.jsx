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
    { question: "Which festival marks the victory of good over evil and is celebrated by burning effigies of Ravana?", options: ["Holi", "Diwali", "Dussehra", "Eid"], correct: "Dussehra", critical: true },
    { question: "Which Indian festival is known as the Festival of Lights?", options: ["Christmas", "Eid", "Dussehra", "Diwali"], correct: "Diwali", critical: true },
    { question: "Which Indian festival involves distributing sweets to friends and family as a symbol of goodwill?", options: ["Eid", "Diwali", "Christmas", "Raksha Bandhan"], correct: "Diwali", critical: false },
    { question: "Which Islamic festival marks the end of Ramadan, the holy month of fasting?", options: ["Diwali", "Eid-ul-Adha", "Eid-ul-Fitr", "Ram Navami"], correct: "Eid-ul-Fitr", critical: true },
    { question: "During which festival do Muslims worldwide observe fasting from dawn until sunset?", options: ["Eid", "Diwali", "Ramadan", "Holi"], correct: "Ramadan", critical: true },
    { question: "What activity is commonly done during Holi, the festival of colors?", options: ["Lighting lamps", "Fasting", "Playing with colors", "Distributing sweets"], correct: "Playing with colors", critical: false },
    { question: "Which Christian festival celebrates the resurrection of Jesus Christ?", options: ["Good Friday", "Christmas", "Diwali", "Easter"], correct: "Easter", critical: true },
    { question: "Which festival celebrates the birth of Jesus Christ and is marked by the exchange of gifts?", options: ["Diwali", "Easter", "Christmas", "Ram Navami"], correct: "Christmas", critical: true },
    { question: "Which major Hindu festival is celebrated in Maharashtra with dandiya and Garba dances?", options: ["Holi", "Diwali", "Eid", "Navratri"], correct: "Navratri", critical: false },
    { question: "Which festival celebrated in Tamil Nadu marks the end of the harvest season?", options: ["Onam", "Diwali", "Pongal", "Holi"], correct: "Pongal", critical: true },
    { question: "Which festival, also known as the Festival of Sacrifice, is observed by Muslims?", options: ["Eid-ul-Fitr", "Diwali", "Holi", "Eid-ul-Adha"], correct: "Eid-ul-Adha", critical: false },
    { question: "Which festival in Maharashtra is celebrated by creating elaborate rangolis and lighting diyas?", options: ["Ganesh Chaturthi", "Diwali", "Onam", "Holi"], correct: "Diwali", critical: false },
    { question: "What is the main activity during the harvest festival of Lohri celebrated in Punjab?", options: ["Dancing around the Maypole", "Flying kites", "Distributing sweets", "Lighting bonfires"], correct: "Lighting bonfires", critical: false },
    { question: "Which festival marks the harvest season and is celebrated with traditional dances and bonfires in North India?", options: ["Eid", "Lohri", "Baisakhi", "Dussehra"], correct: "Baisakhi", critical: true },
    { question: "Which Hindu festival is celebrated for 9 nights in honor of Goddess Durga?", options: ["Navratri", "Diwali", "Holi", "Eid"], correct: "Navratri", critical: true },
   
  
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
