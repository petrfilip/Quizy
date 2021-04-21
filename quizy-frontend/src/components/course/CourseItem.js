import FlashCards from "../flashcards/FlashCards";
import CourseList from "./CourseList";
import { useHistory, useLocation } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import Quiz from "../quiz/Quiz";

export default function CourseItem({ slug }) {

  const [currentAction, setCurrentAction] = useState("choice")
  const [data, setData] = useState({})
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState()
  const history = useHistory();
  const location = useLocation();

  useLayoutEffect(() => {

    if (slug === "newQuiz") {
      setData({
        title: "New quiz"
      })
      setIsPending(false)
      return
    }

    fetch(`${process.env.REACT_APP_BASE_URI}/quiz/${slug}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {

        setData(json)
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsPending(false))

  }, [slug])

  const choiceQuiz = <div onClick={() => {
    history.push(`${location.pathname}/quiz`)
    setCurrentAction("quiz")
  }}>Quiz</div>

  const choiceFlashcards = <div onClick={() => {
    history.push(`${location.pathname}/flashcards`)
    setCurrentAction("flashcards")
  }}>Flashcards</div>

  return <div>
    <h3>{data.title}</h3>
    {currentAction === "flashcards" && data.flashcards && <FlashCards flashcards={data.flashcards}/>}
    {currentAction === "quiz" && data.flashcards && <Quiz quizData={data.questions}/>}
    {currentAction === "choice" && <>{choiceQuiz} {choiceFlashcards}</>}
  </div>

}