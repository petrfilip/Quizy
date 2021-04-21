import QuizItem from "./QuizItem";
import { useState } from "react";
import QuizScore from "./QuizScore";
import { Timer } from "../Timer";
import QuizProgress from "./QuizProgress";
import Paging from "../Paging";

export default function Quiz({quizData}) {


  // const quizData = [
  //   {
  //     id: 5,
  //     type: "pickOne",
  //     question: "Jaký hook použijete pro stav?",
  //     answers: [
  //       {
  //         id: 0,
  //         text: "useEffect",
  //         comments: "Tato volba není správná, protože je ..."
  //
  //       },
  //       {
  //         id: 1,
  //         text: "useState",
  //         comments: "Tato volba není správná, protože je ..."
  //
  //       },
  //       {
  //         id: 2,
  //         text: "useContext",
  //         comments: "Tato volba není správná, protože je ..."
  //
  //       },
  //       {
  //         id: 20,
  //         text: "useContext",
  //         comments: "Tato volba není správná, protože je ..."
  //
  //       }
  //     ],
  //     correct: 1,
  //     comment: "Použije se useEffect"
  //   },
  //   {
  //     id: 1,
  //     type: "pickOne",
  //     question: "Další otázka?",
  //     answers: [
  //       {
  //         id: 4,
  //         text: "První odpověď",
  //         comments: "Tato volba není správná, protože je ..."
  //
  //       },
  //       {
  //         id: 5,
  //         text: "Druhá",
  //         comments: "Tato volba není správná, protože je ..."
  //
  //       },
  //       {
  //         id: 6,
  //         text: "Třetí",
  //         comments: "Tato volba není správná, protože je ..."
  //       }
  //     ],
  //     correct: 6,
  //     comment: "Použije se useEffect"
  //   },
  //   {
  //     id: 2,
  //     type: "pickOneSourceCode",
  //     question: "Nová otázka?",
  //     answers: [
  //       {
  //         id: 0,
  //         text: `const paging = {
  //   currentIndex: currentQuestionIndex,
  //   total: quizData.length,
  //   onChange: (index) => {
  //     setCurrentQuestionIndex(index)
  //   }
  // }`
  //       },
  //       {
  //         id: 1,
  //         text: "useState",
  //         comments: "Tato volba není správná, protože je ..."
  //
  //       },
  //       {
  //         id: 2,
  //         text: "useContext",
  //         comments: "Tato volba není správná, protože je ..."
  //
  //       }
  //     ],
  //     correct: 1,
  //     comment: "Použije se useEffect"
  //   },
  //   {
  //     id: 3,
  //     type: "sequence",
  //     question: "Nejnovější otázka?",
  //     answers: [
  //       {
  //         id: 0,
  //         text: "useEffect",
  //       },
  //       {
  //         id: 1,
  //         text: "useState"
  //       },
  //       {
  //         id: 2,
  //         text: "useContext"
  //       }
  //     ],
  //     correct: 1,
  //     comment: "Použije se useEffect"
  //   },
  //   {
  //     id: 30,
  //     type: "pickMultiple",
  //     question: "Multiple otázka?",
  //     answers: [
  //       {
  //         id: 550,
  //         text: "useEffect",
  //       },
  //       {
  //         id: 551,
  //         text: "useState"
  //       },
  //       {
  //         id: 5522,
  //         text: "AAAA"
  //       },
  //       {
  //         id: 5523,
  //         text: "BBBB"
  //       },
  //       {
  //         id: 5524,
  //         text: "CCCC"
  //       }
  //     ],
  //     correct: [550, 5522],
  //     comment: "Použije se useEffect"
  //   }
  // ]
  //
  // const quiz = {
  //   id: "react-pro-zacatecniky",
  //   title: "React pro začátečníky",
  //   description: "Základy Reactu pro začátečníky",
  //   heroImage: "",
  //   questions: quizData
  // }
  //


  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([])

  const onAnswerSubmitHandler = (question, answer, isCorrect) => {
    const answerQuestion = {
      isCorrect: isCorrect,
      questionId: question.id,
      answer: answer
    }

    const newAnswer = [...answers];
    newAnswer.push(answerQuestion)
    setAnswers(newAnswer);
  }

  const paging = {
    currentIndex: currentQuestionIndex,
    total: quizData.length,
    onChange: (index) => {
      setCurrentQuestionIndex(index)
    }
  }

  const getAnswerByQuestionId = (qId) => {
    const answerById = answers.find(item => item.questionId === qId)?.answer
    console.log(answerById);
    return answerById;
  }

  const getScore = () => {
    return answers.filter(item => item.isCorrect).length
  }

  return (
    <>
      <Timer/>
      <QuizProgress current={answers.length} total={quizData.length}/>
      <QuizScore score={getScore()} total={answers.length}/>
      <QuizScore score={getScore()} total={quizData.length}/>
      {quizData[currentQuestionIndex] && <QuizItem
        question={quizData[currentQuestionIndex]}
        answer={getAnswerByQuestionId(quizData[currentQuestionIndex].id)}
        onAnswerSubmit={onAnswerSubmitHandler}
      />}
      <Paging paging={paging}/>
      <button>Odeslat hotový formulář</button>

    </>
  )
}