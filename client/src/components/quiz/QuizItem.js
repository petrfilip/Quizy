import { useState, useLayoutEffect } from "react";
import PickOne from "./quizItem/PickOne";
import PickOneSourceCode from "./quizItem/PickOneSourceCode";
import SimpleSequence from "./quizItem/SimpleSequence";
import PickMultiple from "./quizItem/PickMultiple";
import MarkdownPreview from "@uiw/react-markdown-preview";
import FillTextExactly from "./quizItem/FillTextExactly";

export default function QuizItem({ question, answer, onAnswerSubmit }) {

  const [selected, setSelected] = useState(answer)
  const [customView, setCustomView] = useState()
  const [showCustomView, setShowCustomView] = useState(true)

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

        <div>
          {customView && <button onClick={() => setShowCustomView(!showCustomView)}>Show origin</button>}
          <MarkdownPreview source={showCustomView && customView || question.question}/>
        </div>

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

        {question.questionType === "fillTextExactly" && <FillTextExactly
          setCustomView={setCustomView}
          questionItem={question}
          selectedItem={answer}
          onSubmit={onSubmitHandler}/>}
      </div>
    </>)
}