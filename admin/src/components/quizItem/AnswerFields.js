import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import MDEditor from "@uiw/react-md-editor";
import React, { useState } from "react"; //Example style, you can use another

export default function AnswerFields({ id, answer, onInputChange, answerType }) {

  const [shownReasons, setShownReasons] = useState(false)


  const markdown = <MDEditor
    value={answer.text || ""}
    onChange={(src) => {
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
  />

  const simpleInput = <input id={id} type={"text"}
                             name={"text"} value={answer.text} onChange={onInputChange}/>

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
      <label
        style={{
          fontSize: "1em",
          fontWeight: "bold"
        }}
        htmlFor={`field${id}`}>Answer{id}: </label>

      {answerType === "simpleInput" && simpleInput}
      {answerType === "codeEditor" && codeEditor}
      {answerType === "markdown" && markdown}


      {/*<textarea id={id} name={"reason"} value={answer.reason} onChange={onInputChange}/>*/}


      {!shownReasons && !answer.reason && <button onClick={() => setShownReasons(true)}>Add reason</button>}
      {!shownReasons && answer.reason && <button onClick={() => setShownReasons(true)}>Edit reason</button>}
      {shownReasons && <button onClick={() => setShownReasons(false)}>Hide reason</button>}
      {shownReasons && <MDEditor
        height={100}
        preview={'edit'}
        value={answer.reason || ""}
        onChange={(src) => {
          onInputChange({
              target: {
                id: id,
                value: src,
                name: "reason",
                type: "text"
              }
            }
          )
        }
        }
      />}



    </>
  );
}