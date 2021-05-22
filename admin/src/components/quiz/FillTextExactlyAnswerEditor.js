import AnswerFields from "./AnswerFields";
import React, { useEffect, useLayoutEffect, useState } from "react";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Button, Checkbox, FormControlLabel, Typography } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { useTranslation } from "react-i18next";

export default function FillTextExactlyAnswerEditor({ question, answers, onAnswerChange, correctAnswer, onCorrectAnswerChange, parameters, onUpdateParameters, answerType, onQuestionChange }) {

  const [showPreview, setShowPreview] = useState(false)
  const { t } = useTranslation();


  useLayoutEffect(() => {
    const matches = question.match(/\${([^}]+)}/g)
    for (const matchesKey in matches) {
      answers[matchesKey] = answers[matchesKey] || ""
    }

    if (answers && matches && answers.length > matches.length) {
      const remove = answers.length - matches.length
      for (let i = 0; i < remove; i++) {
        answers.pop()
      }
    }

    onAnswerChange([...answers])
    onCorrectAnswerChange([...answers])
  }, [question])

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
    answers[target.id] = value
    onAnswerChange([...answers])
    onCorrectAnswerChange([...answers])
  }

  let text = question && question.match(/\${([^}]+)}/g) && answers.reduce((acc, item, i) => {
    return acc.replace(question.match(/\${([^}]+)}/g)[i], answers[i]);
  }, question);

  return <>
    <div>
      {question && !question.match(/\${([^}]+)}/g) && <>
        <Typography>{t('qe_templates')}</Typography>
        <Button variant={"outlined"} onClick={()=> onQuestionChange(t('qe_template_1_content'))}>{t('qe_template_1_title')}</Button>
        <Button variant={"outlined"} onClick={()=> onQuestionChange(t('qe_template_2_content'))}>{t('qe_template_2_title')}</Button>
        {/*<Button variant={"outlined"} onClick={()=> onQuestionChange(t('qe_template_3_content'))}>{t('qe_template_3_title')}</Button>*/}
      </>}
      {showPreview ?
        <Button variant={"text"} startIcon={<VisibilityOffIcon/>} onClick={() => setShowPreview(false)}><MarkdownPreview source={text}/></Button> :
        <Button variant={"text"} startIcon={<VisibilityIcon/>} onClick={() => setShowPreview(true)}>{t('qe_showPreview')}</Button>}
    </div>
    {question.match(/\${([^}]+)}/g) && answers && answers.map((item, index) =>
      <div key={`fillExact-${index}`}>

        <label
          style={{
            fontSize: "1em",
            fontWeight: "bold"
          }}
          htmlFor={`field${index}`}>{question.match(/\${([^}]+)}/g)[index]}: </label>

        <AnswerFields key={`answer-${index}`}
                      id={`${index}`}
                      answer={{ text: typeof item == 'object' ? "" : item }}
                      onInputChange={onInputChange}
                      answerType={answerType}
        />


      </div>
    )}

    <div>
      {false && <FormControlLabel
        control={
          <Checkbox
            checked={parameters?.ignoreCases}
            onChange={updateParameters}
            name="ignoreCases"
            color="primary"
          />
        }
        label="Ignore cases"
      />}

      {false && <FormControlLabel
        control={
          <Checkbox
            checked={parameters?.stripEmptyCharacters}
            onChange={updateParameters}
            name="stripEmptyCharacters"
            color="primary"
          />
        }
        label="Strip empty characters"
      />}
    </div>

  </>
}