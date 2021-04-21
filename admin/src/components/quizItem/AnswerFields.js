import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another

export default function AnswerFields({ id, answer, onInputChange, answerType }) {

  const simpleInput = <input id={id} type={"text"} name={"text"} value={answer.text} onChange={onInputChange}/>

  const codeEditor = <Editor
    value={answer?.text || ""}
    onValueChange={(src) => {
      onInputChange({
          target: {
            id: id,
            value: src,
            name: "text",
            type: "text"
          }
        }
      )
    }}
    highlight={(code) => highlight(answer && answer.text || "", languages.js)}
    padding={10}
    style={{
      backgroundColor: "white",
      fontFamily: '"Fira code", "Fira Mono", monospace',
      fontSize: 12,
    }}
  />

  return (
    <>
      <label htmlFor={`field${id}`}>{id}: </label>

      {answerType === "simpleInput" && simpleInput}
      {answerType === "codeEditor" && codeEditor}


      <textarea id={id} name={"reason"} value={answer.reason} onChange={onInputChange}/>
    </>
  );
}