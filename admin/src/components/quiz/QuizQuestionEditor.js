import React, { useState } from "react";
import PickOneAnswerEditor from "./PickOneAnswerEditor";
import PickMultipleAnswerEditor from "./PickMultipleAnswerEditor";
import MDEditor from "@uiw/react-md-editor";
import FillTextFromOptionsAnswerEditor from "./FillTextFromOptionsAnswerEditor";
import FillTextExactlyAnswerEditor from "./FillTextExactlyAnswerEditor";
import { FormControl, InputLabel, makeStyles, MenuItem, Select } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export default function QuizQuestionEditor({ question }) {

  const [data, setData] = useState(question)
  const { t } = useTranslation();

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
    setData({ ...data })
  }

  const classes = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 220,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }))();

  const onQuestionChange = (src) => {
    handleInputChange({
        target: {
          value: src,
          name: "question"
        }
      }
    )
  }

  return <>
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">{t('qqe_questionType')}</InputLabel>
      <Select value={data.questionType} name={"questionType"} onChange={handleInputChange}>
        <MenuItem value={"pickOne"}>{t('qqe_pickOne')}</MenuItem>
        <MenuItem value={"pickMultiple"}>{t('qqe_pickMultiple')}</MenuItem>
        {/*<MenuItem value={"sequence"}>Sequence</MenuItem>*/}
        {/*<MenuItem value={"fillTextFromOptions"}>Fill text from options</MenuItem>*/}
        <MenuItem value={"fillTextExactly"}>{t('qqe_pickFillTextExactly')}</MenuItem>
      </Select>
    </FormControl>

    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">{t('qqe_answerType')}</InputLabel>
      <Select value={data.answerType} name={"answerType"} onChange={handleInputChange}>
        <MenuItem value={"simpleInput"}>{t('qqe_simpleInput')}</MenuItem>
        <MenuItem value={"markdown"}>{t('qqe_markdown')}</MenuItem>
      </Select>
    </FormControl>

    <MDEditor
      value={data.question || ""}
      onChange={onQuestionChange}
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
      onQuestionChange={onQuestionChange}
      answerType={data.answerType}
    />}

    <hr/>

    {/*<button>Delete this question</button>*/}

    {/*{JSON.stringify(data)}*/}


  </>
}


