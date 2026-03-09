import { useState, useEffect } from 'react';
import type { Question } from '../types';

interface OneInOneProps {
    questions: Question[];
    initialQuestionId?: number;
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

export default function OneInOne({ questions, initialQuestionId }: OneInOneProps) {
    // Track current question by ID so the index stays correct when the list changes
    const [currentQuestionId, setCurrentQuestionId] = useState<number | undefined>(initialQuestionId);
    // Track which question's answer is visible by ID so it auto-hides on navigation
    const [showAnswerFor, setShowAnswerFor] = useState<number | undefined>(undefined);
    const [scores, setScores] = useState<Record<number, number>>(loadScores);
    const [scoredInSession, setScoredInSession] = useState<Set<number>>(() => new Set());
    const [shareTooltip, setShareTooltip] = useState(false);

    // Save scores to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('atpl-question-scores', JSON.stringify(scores));
    }, [scores]);

    if (!questions || questions.length === 0) {
        return <p>No questions available.</p>;
    }

    // Derive the index from the stored question ID; fall back to 0 if not found
    const currentIndex = currentQuestionId !== undefined
        ? Math.max(0, questions.findIndex(q => q.id === currentQuestionId))
        : 0;
    const currentQuestion = questions[currentIndex];
    const showAnswer = showAnswerFor === currentQuestion.id;

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentQuestionId(questions[currentIndex + 1].id);
            setShowAnswerFor(undefined);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentQuestionId(questions[currentIndex - 1].id);
            setShowAnswerFor(undefined);
        }
    };

    const handleToggleAnswer = () => {
        setShowAnswerFor(showAnswer ? undefined : currentQuestion.id);
    };

    const handleAddScore = () => {
        const questionId = currentQuestion.id;
        if (scoredInSession.has(questionId)) return;
        setScores(prev => ({
            ...prev,
            [questionId]: (prev[questionId] || 0) + 1
        }));
        setScoredInSession(prev => { const next = new Set(prev); next.add(questionId); return next; });
    };

    const handleShare = async () => {
        const url = `${window.location.origin}${window.location.pathname}?q=${currentQuestion.id}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: 'ATPL Question', url });
            } else {
                await navigator.clipboard.writeText(url);
                setShareTooltip(true);
                setTimeout(() => setShareTooltip(false), 2000);
            }
        } catch {
            // ignore share/clipboard errors
        }
    };

    const currentScore = scores[currentQuestion.id] || 0;
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const alreadyScoredInSession = scoredInSession.has(currentQuestion.id);

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
                <div className="mb-4 flex justify-between items-center">
                    <span className="px-3 py-1 text-sm bg-blue-200 text-blue-800 rounded">
                        {currentQuestion.category}
                    </span>
                    <div className="relative">
                        <button
                            onClick={handleShare}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors duration-300 cursor-pointer"
                            title="Share this question"
                        >
                            🔗 Share
                        </button>
                        {shareTooltip && (
                            <span className="absolute right-0 top-8 text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                                Link copied!
                            </span>
                        )}
                    </div>
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
                    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300 cursor-pointer"
                >
                    ← Previous
                </button>

                <button
                    onClick={handleToggleAnswer}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300 cursor-pointer"
                >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>

                {showAnswer && (
                    <button
                        onClick={handleAddScore}
                        disabled={alreadyScoredInSession}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300 cursor-pointer"
                        title={alreadyScoredInSession ? 'Already scored in this session' : 'Add score'}
                    >
                        {alreadyScoredInSession ? '✓ Scored' : '+ Add Score'}
                    </button>
                )}

                <button
                    onClick={handleNext}
                    disabled={currentIndex === questions.length - 1}
                    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300 cursor-pointer"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
