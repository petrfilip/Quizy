import { useState, useLayoutEffect } from "react";
import PickOne from "./quizItem/PickOne";
import SimpleSequence from "./quizItem/SimpleSequence";
import PickMultiple from "./quizItem/PickMultiple";
import MarkdownPreview from "@uiw/react-markdown-preview";
import FillTextExactly from "./quizItem/FillTextExactly";
import { Button, Container } from "@material-ui/core";

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
    <Container maxWidth="md" style={{ minHeight: '500px' }}>
        {selected && question.comment}

        <Container>
          {customView && <Button onClick={() => setShowCustomView(!showCustomView)}>Show origin</Button>}
          <MarkdownPreview source={showCustomView && customView || question.question}/>
        </Container>
        {question.questionType === "pickOne" && <PickOne
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
    </Container>)
}