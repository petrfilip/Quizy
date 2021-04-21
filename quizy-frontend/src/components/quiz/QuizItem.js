import { useState, useLayoutEffect } from "react";
import Paging from "../Paging";
import PickOne from "./quizItem/PickOne";
import PickOneSourceCode from "./quizItem/PickOneSourceCode";
import SimpleSequence from "./quizItem/SimpleSequence";
import PickMultiple from "./quizItem/PickMultiple";

export default function QuizItem({ question, answer, onAnswerSubmit }) {
  // console.log(question)
  const [selected, setSelected] = useState(answer)

  useLayoutEffect(() => {
    setSelected(answer);
  }, [question.id])

  const onSubmitHandler = (question, answer, isCorrect) => {
    setSelected(answer);
    onAnswerSubmit(question, answer, isCorrect)
  }

  return (
    <>
      <div className={"question-frame"}>
        {selected && question.comment}

        {question.type === "pickOne" && <PickOne
          questionItem={question}
          selectedItem={answer}
          onSubmit={onSubmitHandler}/>}

        {question.type === "pickOneSourceCode" && <PickOneSourceCode
          questionItem={question}
          selectedItem={answer}
          onSubmit={onSubmitHandler}/>}

        {question.type === "sequence" && <SimpleSequence
          questionItem={question}
          selectedItem={answer}
          onSubmit={onSubmitHandler}/>}

        {question.type === "pickMultiple" && <PickMultiple
          questionItem={question}
          selectedItem={answer}
          onSubmit={onSubmitHandler}/>}
      </div>
    </>)
}