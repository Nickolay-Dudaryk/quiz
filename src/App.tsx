import React, { useState } from 'react';
import { fetchQuestions } from './API';
// Components
import QuestionCard from './components/QuestionCard';
// Types
import { QuestionState, Difficulty } from './API';
// Styles
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html {
    height: 80vh;
  }
  body {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  button {
    border: none;
    padding: 8px 15px;
    cursor: pointer;
  }
  button:focus {
    outline: none;
  }
`

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS: number = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(true);

  const startQuiz = async () => {
    setLoading(true);
    setIsGameOver(false);

    const newQuestions = await fetchQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isGameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;

      if (correct) {
        setScore(prev => prev + 1);
      };

      const AnswerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      
      setUserAnswers(prev => [...prev, AnswerObject]);
    }
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if(nextQuestion === TOTAL_QUESTIONS) {
      setIsGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  }

  return (
    <>
    <GlobalStyle />
    <div className="App">
      <div className="quiz">
        {isGameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <div className="start-game">
            <button className="start animated-button" onClick={startQuiz}>Start</button>
          </div>
        ) : null}
        
        {!isGameOver && <div className="quiz-score"><span className="score-text">Score</span> <span className="score-number">{score}</span></div>}
        {loading && <p>Loading...</p>}

        {!loading && !isGameOver && (
          <QuestionCard
            questionNumber={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}

        {!isGameOver &&
        !loading &&
        userAnswers.length === number + 1 &&
        number !== TOTAL_QUESTIONS - 1 ? (
          <div className="quiz-controls">
            <button className="next animated-button" onClick={nextQuestion}>Next Question</button>
          </div>
        ) : null}
      </div>
    </div>
    </>
  );
}

export default App;
