import AnswerFields from "./AnswerFields";
import { useState } from "react";

export default function PickMultipleAnswerEditor({ answers, onAnswerChange, correctAnswer, onCorrectAnswerChange, answerType }) {

  const [correct, setCorrect] = useState(correctAnswer && Array.isArray(correctAnswer) && correctAnswer || [])

  const onInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    answers[target.id][name] = value
    onAnswerChange([...answers])
  }

  const onAnswerChangeHandler = (event) => {

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    if (value === true) {
      correct.push(target.id)
      onCorrectAnswerChange(correct)
      setCorrect([...correct])
    } else {
      const filtered = correct.filter(item => item != target.id)
      onCorrectAnswerChange(filtered)
      setCorrect(filtered)
    }

  }

  const removeAnswer = (index) => {
    answers.splice(index, 1)
    onAnswerChange([...answers])
  }


  const addNewAnswer = () => {
    answers.push({})
    onAnswerChange([...answers])
  }

  return <>
    {answers.map((item, index) =>
      <div key={`pickMultiple-${index}`}>
        <input type="checkbox" id={index}
               name={"question"}
               checked={correct && correct.filter(i => i == index).length}
               value={index} onChange={onAnswerChangeHandler}
        />
        <AnswerFields key={`answer-${index}`}
                      id={index} answer={item}
                      onInputChange={onInputChange}
                      answerType={answerType}
        />

        <button onClick={() => removeAnswer(index)}>-</button>

        <hr/>
      </div>
    )}

    <button onClick={addNewAnswer}>Add more answer</button>


  </>
}