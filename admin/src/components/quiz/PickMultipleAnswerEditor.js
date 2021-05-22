import AnswerFields from "./AnswerFields";
import { useState } from "react";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Checkbox from '@material-ui/core/Checkbox';
import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from "react-i18next";

export default function PickMultipleAnswerEditor({ answers, onAnswerChange, correctAnswer, onCorrectAnswerChange, answerType }) {

  const [correct, setCorrect] = useState(correctAnswer && Array.isArray(correctAnswer) && correctAnswer || [])
  const { t } = useTranslation();

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
    setCorrect([]) // todo improve
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
        <Checkbox id={`${index}`}
               name={"question"}
               checked={correct && correct.filter(i => i == index).length}
               value={index} onChange={onAnswerChangeHandler}
        />
        <AnswerFields key={`answer-${index}`}
                      id={index} answer={item}
                      onInputChange={onInputChange}
                      answerType={answerType}
        />

        <Button onClick={() => removeAnswer(index)} startIcon={<DeleteIcon />} />

      </div>
    )}

    <Button startIcon={<AddIcon />} onClick={addNewAnswer}>{t('qe_addAnotherAnswer')}</Button>


  </>
}