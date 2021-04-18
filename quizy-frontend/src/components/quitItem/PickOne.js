import { useState, useLayoutEffect } from "react";

export default function PickOne({ questionItem, onSubmit }) {
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
          {selected && selected === item && isCorrect() && <button
            onClick={() => {
              setSelected(item)
              onSubmit(item)
            }}
            disabled={selected}>
            ok+{item.text}
          </button>}

          {/*incorrectly selected*/}
          {selected && selected === item && !isCorrect() && <button
            onClick={() => {
              setSelected(item)
              onSubmit(item)
            }}
            disabled={selected}>
            no+{item.text}
          </button>}

          {/*when any option selected*/}
          {selected && selected !== item && <button
            onClick={() => {
              setSelected(item)
              onSubmit(item)
            }}
            disabled={selected}>
            /{item.text}
          </button>}

          {/*no option selected*/}
          {!selected && <button onClick={() => {
            setSelected(item)
            onSubmit(item)
          }}>
            -{item.text}
          </button>}
        </div>)}

    </>)
}