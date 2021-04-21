import { useState, useEffect } from "react";
import PickOneAnswerEditor from "./quizItem/PickOneAnswerEditor";
import PickMultipleAnswerEditor from "./quizItem/PickMultipleAnswerEditor";

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
    <select value={data.questionType} name={"questionType"} onChange={handleInputChange}>
      <option value={"pickOne"}>Pick one</option>
      <option value={"pickOneSourceCode"}>Pick one (source code)</option>
      <option value={"pickMultiple"}>Pick multiple</option>
      <option value={"sequence"}>Sequence</option>
    </select>

    <select value={data.answerType} name={"answerType"} onChange={handleInputChange}>
      <option value={"simpleInput"}>Simple input</option>
      <option value={"codeEditor"}>Source code</option>
    </select>

    <textarea name={"question"} value={data.question} onChange={handleInputChange}/>


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

    <hr/>

    {/*<button>Delete this question</button>*/}

    {/*{JSON.stringify(data)}*/}


  </div>
}


