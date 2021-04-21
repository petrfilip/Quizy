import React, { useState, useEffect } from "react";
import PickOneAnswerEditor from "./quizItem/PickOneAnswerEditor";
import PickMultipleAnswerEditor from "./quizItem/PickMultipleAnswerEditor";
import MDEditor from "@uiw/react-md-editor";
import FillTextFromOptions from "./quizItem/FillTextFromOptions";
import FillTextExactly from "./quizItem/FillTextExactly";

export default function QuizItemEditor({ question }) {

  const [data, setData] = useState(question)

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    question[name] = value
    data[name] = value

    const newData = Object.assign({}, data);
    setData(newData)
  }

  const answerChangedHandler = (answers) => {
    data.answers = answers;
    question.answers = answers;
    const newData = Object.assign({}, data);
    setData(newData)
  }

  const onCorrectAnswerChangeHandler = (correct) => {
    data.correct = correct;
    question.correct = correct;
    const newData = Object.assign({}, data);
    setData(newData)
  }

  return <div>
    <div>
      Question type:
      <select value={data.questionType} name={"questionType"} onChange={handleInputChange}>
        <option value={"pickOne"}>Pick one</option>
        <option value={"pickMultiple"}>Pick multiple</option>
        <option value={"sequence"}>Sequence</option>
        <option value={"fillTextFromOptions"}>Fill text from options</option>
        <option value={"fillTextExactly"}>Fill text exactly</option>
      </select>
    </div>

    <div>
      Answer type:
      <select value={data.answerType} name={"answerType"} onChange={handleInputChange}>
        <option value={"simpleInput"}>Simple input</option>
        <option value={"codeEditor"}>Source code</option>
        <option value={"markdown"}>Markdown</option>
      </select>
    </div>
    <button>Delete question</button>

    <MDEditor
      value={data.question || ""}
      onChange={(src) => {
        handleInputChange({
            target: {
              value: src,
              name: "question"
            }
          }
        )
      }
      }
    />


    <hr/>


    {data.questionType === "pickOne" && <PickOneAnswerEditor
      answers={data.answers}
      correctAnswer={question.correct}
      onCorrectAnswerChange={onCorrectAnswerChangeHandler}
      onAnswerChange={answerChangedHandler}
      answerType={data.answerType}
    />
    }
    {data.questionType === "pickMultiple" && <PickMultipleAnswerEditor
      answers={data.answers}
      correctAnswer={question.correct}
      onCorrectAnswerChange={onCorrectAnswerChangeHandler}
      onAnswerChange={answerChangedHandler}
      answerType={data.answerType}
    />}

    {data.questionType === "fillTextFromOptions" && <FillTextFromOptions
      answers={data.answers}
      correctAnswer={question.correct}
      onCorrectAnswerChange={onCorrectAnswerChangeHandler}
      onAnswerChange={answerChangedHandler}
      answerType={data.answerType}
    />}

    {data.questionType === "fillTextExactly" && <FillTextExactly
      question={data.question}
      answers={data.answers}
      correctAnswer={question.correct}
      onCorrectAnswerChange={onCorrectAnswerChangeHandler}
      onAnswerChange={answerChangedHandler}
      answerType={data.answerType}
    />}

    <hr/>

    {/*<button>Delete this question</button>*/}

    {/*{JSON.stringify(data)}*/}


  </div>
}


