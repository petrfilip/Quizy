import { useState, useLayoutEffect } from "react";
import "./PickOne.css"
import AnswerFields from "./AnswerFields";
import { Button, Checkbox, FormControlLabel } from "@material-ui/core";

export default function PickMultiple({ questionItem, selectedItem, onSubmit }) {
  const { question, answers, correct } = questionItem;

  const [selected, setSelected] = useState(selectedItem || [])
  const [isSubmitted, setIsSubmitted] = useState(selectedItem && selectedItem.length)

  useLayoutEffect(() => {
    setIsSubmitted(selectedItem || false)
    setSelected(selectedItem || [])
  }, [questionItem.index])

  const isCorrect = () => {
    const arrayOfSelected = selected.map(arrayItem => arrayItem.checkedItem.index).sort();
    const diff = [...correct].filter((i, index) => arrayOfSelected[index] != i)
    return diff.length === 0
  }

  const isItemCorrect = (item) => {
    const diff = correct.findIndex(i => i == item.index)
    return diff !== -1
  }

  const isInSelected = (item) => {
    const diff = selected.findIndex(i => i.checkedItem.index == item.index)
    return diff !== -1
  }

  const onCheckHandler = (checkedItem, checked) => {
    if (checked) { // new item
      const newSelected = [...selected];
      newSelected.push({ checkedItem, checked })
      setSelected(newSelected);
    } else { //remove item
      const filtered = selected.filter(item => item.checkedItem.index != checkedItem.index)
      setSelected(filtered)
    }
  }

  const onSubmitHandler = () => {
    setIsSubmitted(true)
    onSubmit(questionItem, selected, isCorrect(selected));
  }

  const boxStyle = {
    display: "flex",
  };

  function renderButton(index, item) {
    item.index = index

    const correctButton = <div style={boxStyle} className={"btn-correct"}>

      <FormControlLabel
        disabled={true}
        id={`checkbox-${item.index}`}
        checked={isInSelected(item)}
        onChange={(e) => onCheckHandler(item, e.target.checked)}
        control={<Checkbox/>}
        label={<AnswerFields answerType={questionItem.answerType} content={item.text}/>}
      />
    </div>

    const incorrectButton = <div style={boxStyle} className={"btn-incorrect"}>
      <FormControlLabel
        disabled={true}
        checked={isInSelected(item)}
        onChange={(e) => onCheckHandler(item, e.target.checked)}
        id={`checkbox-${item.index}`}
        control={<Checkbox/>}
        label={<AnswerFields answerType={questionItem.answerType} content={item.text}/>}
      />
    </div>

    const noOptionSelectedButton = <div style={boxStyle}>
      <FormControlLabel
        id={`checkbox-${item.index}`}
        onChange={(e) => onCheckHandler(item, e.target.checked)}
        control={<Checkbox/>}
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
      {button()}
    </>;
  }

  return (
    <>
      {answers && answers.map((item, index) =>
        <div key={`pickMultiple-${index}`}>
          {renderButton(index, item)}
        </div>)}

      <Button fullWidth variant={"contained"} onClick={() => {
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