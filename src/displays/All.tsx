import type { Question } from "../types";

export default function AllQuestions(questions: Question[]) {
    if (!questions || questions.length === 0) {
        return <p>No questions available.</p>
    }

    console.log(questions)

    return <>
        <h1>
            All Questions Available
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
                questions.map((q, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg shadow">
                        <h2 className="text-lg font-bold mb-2">{q.question}</h2>
                        <p className="text-gray-700 mb-2">Answer: {q.answer}</p>
                        <p className="text-gray-500 text-sm">Category: {q.category}</p>
                    </div>
                ))
            }
        </div>
    </>
}
