import AnswerFields from "./AnswerFields";
import { useState } from "react";
import { Button, FormControl, InputLabel, Radio, TextField } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

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
    onUpdateParameters({ ...parameters })
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
    setCorrect([]) // todo improve
    answers.splice(index, 1)
    onAnswerChange([...answers])
  }

  return <>
    {answers && answers.map((item, index) =>
      <div key={`pickOne-${index}`}>
        <Radio id={`${index}`} name={"question"}
               checked={index == correct}
               value={index}
               onChange={onCorrectAnswerChangeHandler}
        />


        <AnswerFields key={`answer-${index}`}
                      id={`${index}`}
                      answer={item}
                      onInputChange={onInputChange}
                      answerType={answerType}
        />
        <Button startIcon={<DeleteIcon/>} onClick={() => removeAnswer(index)}/>
      </div>
    )}

    <Button startIcon={<AddIcon/>} onClick={addNewAnswer}>Add more answer</Button>

    <hr/>
    <TextField label={"Column layout"} type="number" name={"layout"} max={4} min={1} value={parameters?.layout} onChange={updateParameters}/>

  </>
}