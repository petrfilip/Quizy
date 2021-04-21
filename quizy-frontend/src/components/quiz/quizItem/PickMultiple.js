import { useState, useLayoutEffect } from "react";
import "./PickOne.css"

export default function PickMultiple({ questionItem, selectedItem, onSubmit }) {
  const { question, answers, correct } = questionItem;

  const [selected, setSelected] = useState(selectedItem || [])
  const [isSubmitted, setIsSubmitted] = useState(!!selectedItem)

  useLayoutEffect(() => {
    setIsSubmitted(selectedItem || false)
    setSelected(selectedItem || [])
  }, [questionItem.id])

  const isCorrect = () => {
    const arrayOfSelected = selected.map(arrayItem => arrayItem.checkedItem.id).sort();
    const diff = correct.filter(i => arrayOfSelected.indexOf(i) === -1)
    return diff.length === 0
  }

  const isItemCorrect = (item) => {
    const diff = correct.indexOf(item.id)
    return diff !== -1
  }

  const isInSelected = (item) => {
    debugger
    const diff = selected.findIndex(i => i.checkedItem.id === item.id)
    return diff !== -1
  }

  const onCheckHandler = (checkedItem, checked) => {
    if (checked) { // new item
      const newSelected = [...selected];
      newSelected.push({ checkedItem, checked })
      setSelected(newSelected);
    } else { //remove item
      const filtered = selected.filter(item => item.checkedItem.id !== checkedItem.id)
      setSelected(filtered)
    }
  }

  const onSubmitHandler = () => {
    setIsSubmitted(true)
    onSubmit(questionItem, selected, isCorrect(selected));
  }

  const boxStyle = {
    padding: "10px",
    margin: "10px"
  };

  const checkBoxStyle = {
    marginRight: "10px",
    transform: "scale(1.5)"
  };


  function renderButton(item) {

    const correctButton = <div style={boxStyle} className={"btn-correct"}>
      <input type={"checkbox"} checked={isInSelected(item)} style={checkBoxStyle} disabled={true}/>
      {item.text}
    </div>

    const incorrectButton = <div style={boxStyle} className={"btn-incorrect"}>
      <input type={"checkbox"} checked={isInSelected(item)} style={checkBoxStyle} disabled={true}/>
      {item.text}
    </div>

    const noOptionSelectedButton = <div style={boxStyle}>
      <input type={"checkbox"} id={`${item.id}`} onChange={(e) => onCheckHandler(item, e.target.checked)} style={checkBoxStyle}/>
      <label htmlFor={`${item.id}`}>{item.text}</label>
    </div>

    return <>
      {isSubmitted && isItemCorrect(item) && correctButton}
      {isSubmitted && !isItemCorrect(item) && incorrectButton}
      {!isSubmitted && noOptionSelectedButton}
    </>;
  }



  return (
    <>
      {<h2>{question}</h2>}


      {answers && answers.map(item =>
        <div key={`${questionItem.id}-${item.id}`}>
          {renderButton(item)}
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