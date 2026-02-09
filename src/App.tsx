import { useState, useEffect } from 'react'
import './App.css'

import AllQuestions from './displays/All';
import OneInOne from './displays/OneInOne';
import type { Question } from './types';

function App() {
     useEffect(() => {
        fetch('/questions.json')
            .then(res => res.json())
            .then(data => {
                setQuestions(data)
            })
    }, [])

    const [mode, setMode] = useState('one-on-one')
    const [question, setQuestion] = useState<Question>()
    const [questions, setQuestions] = useState<Question[]>()

    function changeMode(newMode: string) {
        setMode(newMode)
    }

    function nextQuestion() {
    }

    function backQuestion() {
    }



    return (
        <>
            <div className='grid grid-cols-4 gap-4 p-4'>
                <div className='col-span-1 rounded-lg p-4 bg-blue-100 rounded-lg text-gray-700'>
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
                            <OneInOne /> :
                            <AllQuestions questions={questions as Question[]} />
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default App
