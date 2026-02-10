import type { Question } from "../types";

interface AllQuestionsProps {
    questions: Question[];
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
                    <div key={q.id} className="p-4 bg-white rounded-lg shadow">
                        <div className="flex items-start justify-between mb-2">
                            <h2 className="text-lg font-bold flex-1">{q.question}</h2>
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded">{q.category}</span>
                        </div>
                        <p className="text-gray-700 mt-2"><strong>Answer:</strong> {q.answer}</p>
                    </div>
                ))
            }
        </div>
    </>
}
