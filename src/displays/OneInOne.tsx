import { useState, useEffect } from 'react';
import type { Question } from '../types';

interface OneInOneProps {
    questions: Question[];
}

// Helper function to load scores from localStorage
const loadScores = (): Record<number, number> => {
    try {
        const savedScores = localStorage.getItem('atpl-question-scores');
        if (savedScores) {
            return JSON.parse(savedScores);
        }
    } catch (error) {
        console.error('Error loading scores:', error);
    }
    return {};
};

export default function OneInOne({ questions }: OneInOneProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [scores, setScores] = useState<Record<number, number>>(loadScores);

    // Save scores to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('atpl-question-scores', JSON.stringify(scores));
    }, [scores]);

    if (!questions || questions.length === 0) {
        return <p>No questions available.</p>;
    }

    const currentQuestion = questions[currentIndex];

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setShowAnswer(false);
        }
    };

    const handleToggleAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    const handleAddScore = () => {
        const questionId = currentQuestion.id;
        setScores(prev => ({
            ...prev,
            [questionId]: (prev[questionId] || 0) + 1
        }));
    };

    const currentScore = scores[currentQuestion.id] || 0;
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    Question {currentIndex + 1} of {questions.length}
                </h1>
                <div className="text-right">
                    <p className="text-sm text-gray-600">Total Score: {totalScore}</p>
                    <p className="text-xs text-gray-500">This question: {currentScore} point{currentScore !== 1 ? 's' : ''}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-4 flex-1">
                <div className="mb-4">
                    <span className="px-3 py-1 text-sm bg-blue-200 text-blue-800 rounded">
                        {currentQuestion.category}
                    </span>
                </div>

                <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>

                {showAnswer && (
                    <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <h3 className="font-bold text-green-800 mb-2">Answer:</h3>
                        <p className="text-gray-700">{currentQuestion.answer}</p>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300"
                >
                    ← Previous
                </button>

                <button
                    onClick={handleToggleAnswer}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
                >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>

                {showAnswer && (
                    <button
                        onClick={handleAddScore}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-300"
                    >
                        + Add Score
                    </button>
                )}

                <button
                    onClick={handleNext}
                    disabled={currentIndex === questions.length - 1}
                    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
