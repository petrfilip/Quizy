import { useState, useLayoutEffect } from "react";
import "./PickOne.css"
import AnswerFields from "./AnswerFields";
import { Button, Checkbox, FormControlLabel, Radio, RadioGroup, TextField } from "@material-ui/core";

export default function PickOne({ questionItem, selectedItem, onSubmit }) {
  const { question, answers, correct } = questionItem;

  const [selected, setSelected] = useState(selectedItem)
  const [isSubmitted, setIsSubmitted] = useState(selectedItem && selectedItem.length)

  useLayoutEffect(() => {
    setIsSubmitted(selectedItem || false)
    setSelected(selectedItem)
  }, [questionItem.index])

  const isCorrect = () => {
    if (!correct) {
      return undefined
    }
    return selected.index == correct
  }

  const isItemCorrect = (item) => {
    return item.index == correct
  }

  const isInSelected = (item) => {
    return selected && selected.index == item.index || false
  }

  const onCheckHandler = (checkedItem, checked) => {
    console.log(checkedItem)
    setSelected(checkedItem)
  }

  const onSubmitHandler = () => {
    setIsSubmitted(true)
    onSubmit(questionItem, selected, isCorrect());
  }

  const boxStyle = {
    display: "flex",
    marginBottom: '5px'
  };

  function renderButton(index, item) {
    item.index = index

    const correctButton = <div style={boxStyle} className={"btn-correct"}>
      <FormControlLabel
        disabled={true}
        checked={isInSelected(item)}
        control={<Radio/>}
        label={<AnswerFields answerType={questionItem.answerType} content={item.text}/>}
      />
    </div>

    const incorrectButton = <div style={boxStyle} className={"btn-incorrect"}>
      <FormControlLabel
        disabled={true}
        checked={isInSelected(item)}
        control={<Radio/>}
        label={<AnswerFields answerType={questionItem.answerType} content={item.text}/>}
      />
    </div>

    const noOptionSelectedButton = <div style={boxStyle}>


      <FormControlLabel
        checked={isInSelected(item)}
        onChange={(e) => onCheckHandler(item, e.target.checked)}
        control={<Radio/>}
        label={<AnswerFields answerType={questionItem.answerType} content={item.text}/>}
      />

    </div>

    const button = () => {
      if (isSubmitted && isItemCorrect(item)) {
        return correctButton
      } else if (isSubmitted && !isItemCorrect(item)) {
        return incorrectButton
      } else {
        return noOptionSelectedButton
      }
    }

    return <>
      <RadioGroup aria-label="answer" name="pick-one-answer">
        {button()}
      </RadioGroup>
    </>;
  }

  return (
    <>
      {answers && answers.map((item, index) =>
        <div key={`pickOne-${index}`}>
          {renderButton(index, item)}
        </div>)}

      <Button fullWidth
              disabled={!selected}
              variant={"contained"}
              onClick={() => {
        if (isSubmitted) {
          return
        }
        onSubmitHandler()
      }
      }
      >
        {!isSubmitted && "Hotovo"}
        {isSubmitted && isCorrect() && "Správně"}
        {isSubmitted && !isCorrect() && "Chyba"}
      </Button>

    </>)
}