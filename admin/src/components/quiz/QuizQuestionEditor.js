import React, { useState, useEffect } from "react";
import PickOneAnswerEditor from "./PickOneAnswerEditor";
import PickMultipleAnswerEditor from "./PickMultipleAnswerEditor";
import MDEditor from "@uiw/react-md-editor";
import FillTextFromOptionsAnswerEditor from "./FillTextFromOptionsAnswerEditor";
import FillTextExactlyAnswerEditor from "./FillTextExactlyAnswerEditor";

export default function QuizQuestionEditor({ question }) {

  const [data, setData] = useState(question)

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    question[name] = value
    data[name] = value

    setData({ ...data })
  }

  const answerChangedHandler = (answers) => {
    data.answers = answers;
    question.answers = answers;
    setData({ ...data })
  }

  const onCorrectAnswerChangeHandler = (correct) => {
    data.correct = correct;
    question.correct = correct;
    setData({ ...data })
  }

  const onUpdateParametersHandler = (parameters) => {
    data.parameters = parameters
    question.parameters = parameters;
    setData({...data})
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
      parameters={data.parameters}
      onUpdateParameters={onUpdateParametersHandler}
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

    {data.questionType === "fillTextFromOptions" && <FillTextFromOptionsAnswerEditor
      answers={data.answers}
      correctAnswer={question.correct}
      onCorrectAnswerChange={onCorrectAnswerChangeHandler}
      onAnswerChange={answerChangedHandler}
      answerType={data.answerType}
    />}

    {data.questionType === "fillTextExactly" && <FillTextExactlyAnswerEditor
      question={data.question}
      answers={data.answers}
      correctAnswer={question.correct}
      parameters={data.parameters}
      onUpdateParameters={onUpdateParametersHandler}
      onCorrectAnswerChange={onCorrectAnswerChangeHandler}
      onAnswerChange={answerChangedHandler}
      answerType={data.answerType}
    />}

    <hr/>

    {/*<button>Delete this question</button>*/}

    {/*{JSON.stringify(data)}*/}


  </div>
}


