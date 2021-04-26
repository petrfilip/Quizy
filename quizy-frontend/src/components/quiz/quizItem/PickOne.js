import { useState, useLayoutEffect } from "react";
import "./PickOne.css"
import AnswerFields from "./AnswerFields";

export default function PickOne({ questionItem, selectedItem, onSubmit }) {
  const { question, answers, correct } = questionItem;

  const [selected, setSelected] = useState(selectedItem)

  useLayoutEffect(() => {
    setSelected(selectedItem)
  }, [questionItem.index])

  const isCorrect = (item) => {
    return item.index == correct
  }

  const onSubmitHandler = (selectedAnswer) => {
    setSelected(selectedAnswer);
    onSubmit(questionItem, selectedAnswer, isCorrect(selectedAnswer));
  }

  function renderButton(index, item) {
    item.index = index
    const correctButton = <div
      className={"btn-correct"}
      onClick={() => {
        if (selected) {
          return
        }
        onSubmitHandler(item)
      }}
    >
      <AnswerFields answerType={questionItem.answerType} content={item.text}/>

    </div>

    const incorrectButton = <div
      className={"btn-incorrect"}
      onClick={() => {
        if (selected) {
          return
        }
        onSubmitHandler(item)
      }}
    >
      <AnswerFields answerType={questionItem.answerType} content={item.text}/>

    </div>

    const notSelectedCorrectButton = <div
      className={"btn-correct"}
      onClick={() => {
        if (selected) {
          return
        }
        onSubmitHandler(item)
      }}
    >
      <AnswerFields answerType={questionItem.answerType} content={item.text}/>

    </div>

    const selectedButton = <div
      className={"btn-disabled"}
      onClick={() => {
        if (selected) {
          return
        }
        onSubmitHandler(item)
      }}
    >
      <AnswerFields answerType={questionItem.answerType} content={item.text}/>

    </div>

    const noOptionSelectedButton = <div onClick={() => {
      if (selected) {
        return
      }
      onSubmitHandler(item)
    }}>
      <AnswerFields answerType={questionItem.answerType} content={item.text}/>

    </div>

    const button = () => {
      debugger
      if (selected && selected.index == item.index && isCorrect(selected) && isCorrect(item)) {
        return correctButton
      } else if (selected && selected.index != item.index && !isCorrect(selected) && isCorrect(item)) {
        return notSelectedCorrectButton
      } else if (selected && selected.index != item.index && isCorrect(selected) && !isCorrect(item)) {
        return selectedButton
      } else if (selected && selected.index == item.index && !isCorrect(selected) && !isCorrect(item)) {
        return incorrectButton
      } else if (selected) {
        return selectedButton
      } else {
        return noOptionSelectedButton
      }
    }

    return <>
      {button()}
      {/*item:{JSON.stringify(item)}*/}
      {/*selected: {JSON.stringify(selected)}*/}
      {/*{selected && item.index === selected.index && isCorrect(selected) ? correctButton : incorrectButton}*/}
      {/*{selected && item.index !== selected.index  ? notSelectedCorrectButton : selectedButton}*/}
      {/*{noOptionSelectedButton}*/}
    </>;
  }

  return (
    <>
      {answers && answers.map((item, index) =>
        <div key={`pickOne}-${index}`}>
          {renderButton(index, item)}
        </div>)}

    </>)
}