import { useState } from "react";
import { Button, TextField } from "@material-ui/core";

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

  const isItemCorrect = (index, item) => {
    return correct[index] == item
  }

  const isCorrect = () => {
    if (!correct) {
      return undefined
    }

    return selected.filter((item, i) => !isItemCorrect(i, item)).length === 0
  }

  const onSubmitHandler = () => {
    setIsSubmitted(true)
    onSubmit(questionItem, selected, isCorrect());
  }

  let text = question && question.match(/\${([^}]+)}/g) && selected.reduce((acc, item, i) => {
    return selected[i] ? acc.replace(question.match(/\${([^}]+)}/g)[i], selected[i]) : acc
  }, question);

  setCustomView(text);

  return <>
    {}
    { question && question.match(/\${([^}]+)}/g) && answers && answers.map((item, index) =>
      <div key={`fillExact-${index || "0"}`}>
        <TextField
          style={{marginBottom: '10px'}}
          variant="outlined"
          helperText={isSubmitted && !isItemCorrect(index, selected[index]) && "Correct answer: " + correct[index]}
          error={isSubmitted && !isItemCorrect(index, selected[index])}
          fullWidth
          label={question.match(/\${([^}]+)}/g)[index]}
          id={`${index}`}
          value={selected[index] || ""}
          onChange={onInputChange} autoComplete={"off"} disabled={isSubmitted}/>
      </div>
    )}


    <Button variant={"contained"} fullWidth onClick={() => {
      if (isSubmitted) {
        return
      }
      onSubmitHandler()
    }
    }
    >
      {!isSubmitted && "Hotovo"}
      {isSubmitted && isCorrect() && "Správně"}
      {isSubmitted && !isCorrect() && "Chyba"}
    </Button>
  </>

}