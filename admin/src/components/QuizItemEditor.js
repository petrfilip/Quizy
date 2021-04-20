import { useState } from "react";
import PickOneAnswerEditor from "./quizItem/PickOneAnswerEditor";
import PickMultipleAnswerEditor from "./quizItem/PickMultipleAnswerEditor";

export default function QuizItemEditor({ question }) {

  const [data, setData] = useState(question)

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    data[name] = value

    const newData = Object.assign({}, data);
    setData(newData)
  }

  const answerChangedHandler = (answers) => {
    data.answers = answers;
    const newData = Object.assign({}, data);
    setData(newData)
  }




  const onCorrectAnswerChangeHandler = (correct) => {
    data.correct = correct;
    const newData = Object.assign({}, data);
    setData(newData)
  }

  return <div>
    <select value={data.type} name={"type"} onChange={handleInputChange}>
      <option value={"pickOne"}>Pick one</option>
      <option value={"pickOneSourceCode"}>Pick one (source code)</option>
      <option value={"pickMultiple"}>Pick multiple</option>
      <option value={"sequence"}>Sequence</option>
    </select>

    <textarea name={"question"} value={data.question} onChange={handleInputChange}/>


    <hr/>


    {data.type === "pickOne" && <PickOneAnswerEditor
      answers={data.answers}
      correctAnswer={question.correct}
      onCorrectAnswerChange={onCorrectAnswerChangeHandler}
      onAnswerChange={answerChangedHandler}
    />
    }
    {data.type === "pickMultiple" && <PickMultipleAnswerEditor
      answers={data.answers}
      correctAnswer={question.correct}
      onCorrectAnswerChange={onCorrectAnswerChangeHandler}
      onAnswerChange={answerChangedHandler}
    />}

    <hr/>

    <button>Submit</button>
    <button>Delete</button>

    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
}


