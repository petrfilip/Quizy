import QuizItem from "./QuizItem";
import { useState } from "react";

export default function Quiz() {
  const quizData = [
    {
      id: 0,
      type: "pickOne",
      question: "Jaký hook použijete pro stav?",
      answers: [
        {
          id: 0,
          text: "useEffect"
        },
        {
          id: 1,
          text: "useState"
        },
        {
          id: 2,
          text: "useContext"
        }
      ],
      correct: 1,
      comment: "Použije se useEffect"
    },
    {
      id: 1,
      type: "pickOne",
      question: "Další otázka?",
      answers: [
        {
          id: 0,
          text: "useEffect"
        },
        {
          id: 1,
          text: "useState"
        },
        {
          id: 2,
          text: "useContext"
        }
      ],
      correct: 1,
      comment: "Použije se useEffect"
    },
    {
      id: 2,
      type: "pickOneCode",
      question: "Nová otázka?",
      answers: [
        {
          id: 0,
          text: `const paging = {
    currentIndex: currentQuestionIndex,
    total: quizData.length,
    onChange: (index) => {
      setCurrentQuestionIndex(index)
    }
  }`
        },
        {
          id: 1,
          text: "useState"
        },
        {
          id: 2,
          text: "useContext"
        }
      ],
      correct: 1,
      comment: "Použije se useEffect"
    },
    {
      id: 3,
      type: "sequence",
      question: "Nejnovější otázka?",
      answers: [
        {
          id: 0,
          text: "useEffect"
        },
        {
          id: 1,
          text: "useState"
        },
        {
          id: 2,
          text: "useContext"
        }
      ],
      correct: 1,
      comment: "Použije se useEffect"
    }
  ]

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([])

  const paging = {
    currentIndex: currentQuestionIndex,
    total: quizData.length,
    onChange: (index) => {
      setCurrentQuestionIndex(index)
    }
  }

  return (
    <>
      {quizData[currentQuestionIndex] && <QuizItem question={quizData[currentQuestionIndex]} paging={paging}/>}
    </>
  )
}