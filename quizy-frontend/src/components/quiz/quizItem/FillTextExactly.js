import { useState } from "react";
import AnswerFields from "./AnswerFields";
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function FillTextExactly({ questionItem, selectedItem, onSubmit, setCustomView }) {

  const { question, answers, correct } = questionItem;
  const [selected, setSelected] = useState(selectedItem || [])
  const [isSubmitted, setIsSubmitted] = useState(selectedItem && selectedItem.length)

  const onInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    selected[target.id] = value
    setSelected([...selected])
  }

  let text = question && question.match(/\${([^}]+)}/g) && selected.reduce((acc, item, i) => {
    return selected[i] ? acc.replace(question.match(/\${([^}]+)}/g)[i], selected[i]) : acc
  }, question);

  setCustomView(text);

  return <>
    {answers && answers.map((item, index) =>
      <div key={`fillExact-${index}`}>

        <label
          style={{
            fontSize: "1em",
            fontWeight: "bold"
          }}
          htmlFor={`${index}`}>{index}: </label>

        <input id={index} value={selected[index]} onChange={onInputChange} autoComplete={"off"}/>
      </div>
    )}
  </>

}