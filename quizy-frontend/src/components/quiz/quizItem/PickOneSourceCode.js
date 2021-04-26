import { useState, useLayoutEffect } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco, a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import "./PickOneSourceCode.css"

export default function PickOneSourceCode({ questionItem, selectedItem, onSubmit }) {
  const {  answers, correct } = questionItem;

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

    const correctButton = selected && selected.id === item.id && <div className={"code-correct"}>
      <SyntaxHighlighter
        language="javascript"
        onClick={() => {
          if (selected) {
            return
          }
          onSubmitHandler(item)
        }}
        disabled={selected}>
        {item.text}
      </SyntaxHighlighter></div>

    const incorrectButton = selected && selected.id === item.id && !isCorrect(selected) && <div className={"code-incorrect"}>
      <SyntaxHighlighter
        language="javascript"
        onClick={() => {
          if (selected) {
            return
          }
          onSubmitHandler(item)
        }}
        disabled={selected}>
        {item.text}
      </SyntaxHighlighter>
    </div>

    const selectedButton = selected && selected.id !== item.id && <div className={"code-disabled"}>
      <SyntaxHighlighter
        language="javascript"
        onClick={() => {
          if (selected) {
            return
          }
          onSubmitHandler(item)
        }}
        disabled={selected}>
        {item.text}
      </SyntaxHighlighter>
    </div>

    const notSelectedCorrectButton = selected && selected.id !== item.id && !isCorrect(selected) && <div className={"code-correct"}>
      <SyntaxHighlighter
      language="javascript"
      onClick={() => {
        if (selected) {
          return
        }
        onSubmitHandler(item)
      }}
    >
      {item.text}
    </SyntaxHighlighter>
    </div>

    const noOptionSelectedButton = !selected && <div>
      <SyntaxHighlighter
      language="javascript"
      onClick={() => {
        if (selected) {
          return
        }
        onSubmitHandler(item)
      }}>
      {item.text}
    </SyntaxHighlighter>
    </div>

    return <>

      {selected && isCorrect(selected) ? correctButton : incorrectButton}

      {/*when any option selected*/}
      {selected && isCorrect(item) ? notSelectedCorrectButton : selectedButton}

      {/*no option selected*/}
      {noOptionSelectedButton}
    </>;
  }

  return (
    <>

      {answers && answers.map(item =>
        <div key={item.id}>
          {renderButton(item)}
        </div>)}

    </>)
}