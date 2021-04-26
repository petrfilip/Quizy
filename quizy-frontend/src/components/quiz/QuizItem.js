import { useState, useLayoutEffect } from "react";
import PickOne from "./quizItem/PickOne";
import PickOneSourceCode from "./quizItem/PickOneSourceCode";
import SimpleSequence from "./quizItem/SimpleSequence";
import PickMultiple from "./quizItem/PickMultiple";
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function QuizItem({ question, answer, onAnswerSubmit }) {

  const [selected, setSelected] = useState(answer)

  useLayoutEffect(() => {
    setSelected(answer);
  }, [question.id])

  const onSubmitHandler = (question, answer, isCorrect) => {
    setSelected(answer);
    onAnswerSubmit(question, answer, isCorrect)
  }
  console.log(answer)

  return (
    <>
      <div className={"question-frame"}>
        {selected && question.comment}

        <MarkdownPreview source={question.question}/>

        {question.questionType === "pickOne" && <PickOne
          questionItem={question}
          selectedItem={answer}
          onSubmit={onSubmitHandler}/>}

        {question.questionType === "pickOneSourceCode" && <PickOneSourceCode
          questionItem={question}
          selectedItem={answer}
          onSubmit={onSubmitHandler}/>}

        {question.questionType === "sequence" && <SimpleSequence
          questionItem={question}
          selectedItem={answer}
          onSubmit={onSubmitHandler}/>}

        {question.questionType === "pickMultiple" && <PickMultiple
          questionItem={question}
          selectedItem={answer}
          onSubmit={onSubmitHandler}/>}
      </div>
    </>)
}