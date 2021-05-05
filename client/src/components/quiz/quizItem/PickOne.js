import { useState, useLayoutEffect } from "react";
import "./PickOne.css"
import AnswerFields from "./AnswerFields";

export default function PickOne({ questionItem, selectedItem, onSubmit }) {
  const { question, answers, correct } = questionItem;

  const [selected, setSelected] = useState(selectedItem)
  const [isSubmitted, setIsSubmitted] = useState(selectedItem && selectedItem.length)

  useLayoutEffect(() => {
    setIsSubmitted(selectedItem || false)
    setSelected(selectedItem || [])
  }, [questionItem.index])

  const isCorrect = () => {
    return selected.index == correct
  }

  const isItemCorrect = (item) => {
    debugger
    return item.index == correct
  }

  const isInSelected = (item) => {
    return selected && selected.index == item.index
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
    padding: "10px",
    margin: "10px"
  };

  const checkBoxStyle = {
    marginRight: "10px",
    transform: "scale(1.5)"
  };

  function renderButton(index, item) {
    item.index = index

    const correctButton = <div style={boxStyle} className={"btn-correct"}>
      <input type={"radio"} checked={isInSelected(item)} style={checkBoxStyle} disabled={true}/>
      <AnswerFields answerType={questionItem.answerType} content={item.text}/>
    </div>

    const incorrectButton = <div style={boxStyle} className={"btn-incorrect"}>
      <input type={"radio"} checked={isInSelected(item)} style={checkBoxStyle} disabled={true}/>
      <AnswerFields answerType={questionItem.answerType} content={item.text}/>
    </div>

    const noOptionSelectedButton = <div style={boxStyle}>
      <input type={"radio"} id={`${item.index}`}
             name={"pickOne"}
             onChange={(e) => onCheckHandler(item, e.target.checked)}
             style={checkBoxStyle}/>
      <label htmlFor={`${item.index}`}><AnswerFields
        answerType={questionItem.answerType}
        content={item.text}/></label>
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

      <button onClick={() => {
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
      </button>

    </>)
}