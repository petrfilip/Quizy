import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useAuth } from "./AuthContext";
import { useSnackbar } from "notistack";
import useUser from "./UserHook";
import { useHistory } from "react-router-dom";
import { ExamContext } from "./ExamContext";

const useExam = (lesson) => {

  const [answers, setAnswers] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizItems, setQuizItems] = useState([])
  const { token } = useAuth();
  const { refreshUser } = useUser();
  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory();
  const { setExam } = useContext(ExamContext)

  const [results, setResults] = useState(null)
  const [metadata, setMetadata] = useState(null)

  const persistToLocalStorage = (metadata, questions, answers, index) => {
    localStorage.setItem("exam", JSON.stringify({ metadata, questions, answers, index }))
  }

  useLayoutEffect(() => {
    const exam = JSON.parse(localStorage.getItem("exam") || null);
    if (exam) {
      setCurrentQuestionIndex(exam.index);
      setQuizItems(exam.questions)
      setAnswers(exam.answers)
      setMetadata(exam.metadata)

      setExam(exam.metadata)
      exam.metadata && history?.push(`/lessons/${exam.metadata.examSlug}/exam`)

    }
  }, [])

  const onAnswerSubmitHandler = (question, answer, isCorrect) => {
    const answerQuestion = {
      questionIndex: currentQuestionIndex,
      answer: answer
    }

    const newAnswers = [...answers];
    newAnswers.push(answerQuestion)
    setAnswers(newAnswers);
    setCurrentQuestionIndex(currentQuestionIndex + 1)

    persistToLocalStorage(metadata, quizItems, newAnswers, currentQuestionIndex + 1)

    if (quizItems.length === currentQuestionIndex + 1) {
      submitResults(newAnswers)
    }
  }

  const submitResults = (newAnswer) => {
    const exam = JSON.parse(localStorage.getItem("exam") || null);

    setResults({})
    setQuizItems(null)
    setCurrentQuestionIndex(0)
    fetch(`${process.env.REACT_APP_BASE_URI}/lessons/${exam.metadata.examSlug}/exam`, {
      method: 'post', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ metadata: exam.metadata, answers: newAnswer })
    }).then(r => r.json())
      .then(json => {
        setResults(json)
        setExam(undefined)
        setCurrentQuestionIndex(null)
        setQuizItems(null)
        localStorage.removeItem("exam");
        refreshUser()
      })
      .catch(() => {
        enqueueSnackbar('Error when getting data', { variant: "error" });
      })
      .finally(() => {
      });

  }

  const cancelExam =  () => {
    submitResults([])
    history.push("/profile")
  }

  const loadExamData = () => {
    fetch(`${process.env.REACT_APP_BASE_URI}/lessons/${lesson.slug}/exam`, {
      method: 'get', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Authorization': 'Bearer ' + token
      },
    }).then(r => r.json())
      .then(json => {
        setQuizItems(json.questions)
        setMetadata(json.metadata)
        persistToLocalStorage(json.metadata, json.questions, [], 0)
        setExam(json.metadata)
      })
      .catch(() => {
        enqueueSnackbar('Error when getting data', { variant: "error" });
      })
      .finally(() => {
      });
  }

  const getAnswerByQuestionIndex = (qIdx) => {
    return answers.find(item => item.questionIndex === qIdx)?.answer
  }

  return ({
    loadExamData,
    question: quizItems && quizItems[currentQuestionIndex] || null,
    answers: getAnswerByQuestionIndex(),
    onAnswerSubmitHandler,
    currentQuestionIndex,
    results,
    cancelExam
  });
};

export default useExam;