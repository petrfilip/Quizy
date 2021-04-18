import { useState, useLayoutEffect } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco, a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';


export default function PickOneCode({questionItem, onSubmit}) {
  const { question, answers, correct } = questionItem;

  const [selected, setSelected] = useState(null)

  useLayoutEffect(() => {
    setSelected(null)
  }, [questionItem])

  const isCorrect = () => {
    return correct === selected.id
  }

  return (
    <>
      {<h2>{question}</h2>}

      {answers && answers.map(item =>
        <div key={item.id}>

          {/*correctly selected*/}
          {selected && selected === item && isCorrect() && <SyntaxHighlighter
            language="javascript" style={docco}
            onClick={() => {
              setSelected(item)
              onSubmit(item)
            }}
            disabled={selected}>
            {item.text}
          </SyntaxHighlighter>}

          {/*incorrectly selected*/}
          {selected && selected === item && !isCorrect() && <SyntaxHighlighter
            language="javascript" style={docco}
            onClick={() => {
              setSelected(item)
              onSubmit(item)
            }}
            disabled={selected}>
            {item.text}
          </SyntaxHighlighter>}

          {/*when any option selected*/}
          {selected && selected !== item && <SyntaxHighlighter
            language="javascript" style={docco}
            onClick={() => {
              setSelected(item)
              onSubmit(item)
            }}
            disabled={selected}>
            {item.text}
          </SyntaxHighlighter>}

          {/*no option selected*/}
          {!selected && <SyntaxHighlighter
            language="javascript" style={docco}
            onClick={() => {
            setSelected(item)
            onSubmit(item)
          }}>
            {item.text}
          </SyntaxHighlighter>}
        </div>)}

    </>)
}