import AnswerFields from "./AnswerFields";
import { useState } from "react";

export default function PickOneAnswerEditor({ answers, onAnswerChange, correctAnswer, onCorrectAnswerChange, parameters, onUpdateParameters, answerType }) {

  const [correct, setCorrect] = useState(correctAnswer && correctAnswer || undefined)

  const onCorrectAnswerChangeHandler = (event) => {
    const target = event.target;
    setCorrect(target.id)
    onCorrectAnswerChange(target.id)
  }

  const updateParameters = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    parameters = parameters || {}
    parameters[name] = value
    onUpdateParameters({...parameters})
  }

  const onInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    answers[target.id][name] = value
    onAnswerChange([...answers])
  }

  const addNewAnswer = () => {
    answers.push({})
    onAnswerChange([...answers])
  }

  const removeAnswer = (index) => {
    answers.splice(index, 1)
    onAnswerChange([...answers])
  }

  return <>
    {answers && answers.map((item, index) =>
      <div key={`pickOne-${index}`}>
        <input type="radio" id={index} name={"question"}
               checked={index == correct}
               value={index}
               onChange={onCorrectAnswerChangeHandler}
        />


        <AnswerFields key={`answer-${index}`}
                      id={index}
                      answer={item}
                      onInputChange={onInputChange}
                      answerType={answerType}
        />
        <button onClick={() => removeAnswer(index)}>-</button>
      </div>
    )}

    <button onClick={addNewAnswer}>Add more answer</button>
    <button>Edit parameters</button>

    <hr/>
    <label>Column layout:</label>
    <input type="number" name={"layout"} max={4} min={1} value={parameters?.layout} onChange={updateParameters}/>



  </>
}