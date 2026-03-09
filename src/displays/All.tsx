import { useState } from "react";
import type { Question } from "../types";

interface AllQuestionsProps {
    questions: Question[];
}

function QuestionCard({ q }: { q: Question }) {
    const [shareTooltip, setShareTooltip] = useState(false);

    const handleShare = async () => {
        const url = `${window.location.origin}${window.location.pathname}?q=${q.id}`;
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

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-start justify-between mb-2">
                <h2 className="text-lg font-bold flex-1">{q.question}</h2>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                    <div className="relative">
                        <button
                            onClick={handleShare}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors duration-300"
                            title="Share this question"
                        >
                            🔗 Share
                        </button>
                        {shareTooltip && (
                            <span className="absolute right-0 top-6 text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap z-10">
                                Link copied!
                            </span>
                        )}
                    </div>
                    <span className="px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded">{q.category}</span>
                </div>
            </div>
            <p className="text-gray-700 mt-2"><strong>Answer:</strong> {q.answer}</p>
        </div>
    );
}

export default function AllQuestions({ questions }: AllQuestionsProps) {
    if (!questions || questions.length === 0) {
        return <p>No questions available.</p>
    }

    return <>
        <h1 className="text-2xl font-bold mb-4">
            All Questions Available ({questions.length} total)
        </h1>

        <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[calc(100vh-200px)] rounded-lg">
            {
                questions.map((q) => (
                    <QuestionCard key={q.id} q={q} />
                ))
            }
        </div>
    </>
}
