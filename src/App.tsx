import { useState, useEffect, useMemo } from 'react'
import './App.css'

import AllQuestions from './displays/All';
import OneInOne from './displays/OneInOne';
import type { Question } from './types';

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function App() {
    const [mode, setMode] = useState('one-on-one')
    const [questions, setQuestions] = useState<Question[]>([])
    const [tableFilter] = useState(false)

    // Parse once; the URL does not change during the app's lifetime
    const initialQuestionId = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        const raw = params.get('q');
        return raw ? parseInt(raw) : undefined;
    }, []);

    useEffect(() => {
        const path = window.location.hostname === 'localhost' ? './atpl-questions/questions.json' : './questions.json';
        fetch(path)
            .then(res => res.json())
            .then(data => {
                // Shuffle questions on load so the order is different each session
                setQuestions(shuffleArray(data))
            })
    }, [])

    function changeMode(newMode: string) {
        setMode(newMode)
    }

    const displayedQuestions = tableFilter
        ? questions.filter(q => q.answer.includes('[table'))
        : questions;

    return (
        <>
            <div className='grid grid-cols-1 2xl:grid-cols-4 gap-4 p-4'>
                <div className='col-span-1 rounded-lg p-4 bg-blue-100 text-gray-700'>
                    <h1 className='text-xl font-bold text-gray-700 mb-4'>
                        ATPL Questions
                    </h1>

                    <div className='space-y-2'>
                        <button
                        className='w-full p-2 rounded-lg bg-blue-400 hover:bg-blue-500 transition-colors duration-300 text-white cursor-pointer' onClick={() => changeMode('one-on-one')}>
                            One-on-One
                        </button>
                        <button
                        className='w-full p-2 rounded-lg bg-blue-400 hover:bg-blue-500 transition-colors duration-300 text-white cursor-pointer' onClick={() => changeMode('all-questions')}>
                            All Questions
                        </button>
                    </div>
                </div>
                {
                    questions && questions.length > 0 &&
                    <div className='col-span-3 flex flex-col p-4 bg-blue-100 rounded-lg text-gray-700'>
                        {
                            mode === 'one-on-one' ?
                            <OneInOne questions={displayedQuestions} initialQuestionId={initialQuestionId} /> :
                            <AllQuestions questions={displayedQuestions} />
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default App
