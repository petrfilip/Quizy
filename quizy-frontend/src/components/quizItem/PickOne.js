import { useState, useLayoutEffect } from "react";
import "./PickOne.css"

export default function PickOne({ questionItem, selectedItem, onSubmit }) {
  const { question, answers, correct } = questionItem;

  const [selected, setSelected] = useState(selectedItem)

  useLayoutEffect(() => {
    setSelected(selectedItem)
  }, [questionItem.id])

  const isCorrect = (selected) => {
    return selected.id === correct
  }

  const onSubmitHandler = (selectedAnswer) => {
    setSelected(selectedAnswer);
    onSubmit(questionItem, selectedAnswer, isCorrect(selectedAnswer));
  }

  function renderButton(item) {

    const correctButton = selected && selected.id === item.id && <button
      className={"btn-correct"}
      onClick={() => {
        if (selected) {
          return
        }
        onSubmitHandler(item)
      }}
    >
      {item.text}
    </button>

    const incorrectButton = selected && selected.id === item.id && !isCorrect(selected) && <button
      className={"btn-incorrect"}
      onClick={() => {
        if (selected) {
          return
        }
        onSubmitHandler(item)
      }}
    >
      {item.text}
    </button>

    const notSelectedCorrectButton = selected && selected.id !== item.id && !isCorrect(selected) && <button
      className={"btn-correct"}
      onClick={() => {
        if (selected) {
          return
        }
        onSubmitHandler(item)
      }}
    >
      {item.text}
    </button>

    const selectedButton = selected && selected.id !== item.id && <button
      className={"btn-disabled"}
      onClick={() => {
        if (selected) {
          return
        }
        onSubmitHandler(item)
      }}
    >
      {item.text}
    </button>

    const noOptionSelectedButton = !selected && <button onClick={() => {
      if (selected) {
        return
      }
      onSubmitHandler(item)
    }}>
      {item.text}
    </button>

    return <>
      {selected && isCorrect(selected) ? correctButton : incorrectButton}
      {selected && isCorrect(item) ? notSelectedCorrectButton : selectedButton}
      {noOptionSelectedButton}
    </>;
  }

  return (
    <>
      {<h2>{question}</h2>}


      {answers && answers.map(item =>
        <div key={`${questionItem.id}-${item.id}`}>
          {renderButton(item)}
        </div>)}

    </>)
}