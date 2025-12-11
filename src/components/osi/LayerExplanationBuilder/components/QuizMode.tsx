import React from 'react';
import { QUIZ_QUESTIONS } from '../constants';

interface QuizModeProps {
  quizAnswers: Record<string, string>;
  setQuizAnswers: (answers: Record<string, string>) => void;
  onSubmitQuiz: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({ quizAnswers, setQuizAnswers, onSubmitQuiz }) => {
  return (
    <div>
      <h3 className="text-gray-900 dark:text-gray-100" style={{ marginBottom: '20px' }}>Test Your Layer Knowledge</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {QUIZ_QUESTIONS.map((question) => (
          <div
            key={question.id}
            className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            style={{
              border: '2px solid',
              borderRadius: '8px',
              padding: '15px',
            }}
          >
            <p
              className="text-gray-800 dark:text-gray-200"
              style={{ fontWeight: 'bold', marginBottom: '12px' }}
            >
              {question.question}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '10px',
              }}
            >
              {question.options.map((option) => (
                <button
                  key={option}
                  onClick={() => setQuizAnswers({ ...quizAnswers, [question.id]: option })}
                  className={quizAnswers[question.id] !== option ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}
                  style={{
                    padding: '10px',
                    backgroundColor: quizAnswers[question.id] === option ? '#4CAF50' : undefined,
                    color: quizAnswers[question.id] === option ? 'white' : undefined,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: quizAnswers[question.id] === option ? 'bold' : 'normal',
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={onSubmitQuiz}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            marginTop: '20px',
          }}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};
