import React, { useState } from "react";
import PickOneAnswerEditor from "./PickOneAnswerEditor";
import PickMultipleAnswerEditor from "./PickMultipleAnswerEditor";
import MDEditor from "@uiw/react-md-editor";
import FillTextFromOptionsAnswerEditor from "./FillTextFromOptionsAnswerEditor";
import FillTextExactlyAnswerEditor from "./FillTextExactlyAnswerEditor";
import { FormControl, InputLabel, makeStyles, MenuItem, Select } from "@material-ui/core";

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

  const classes = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 220,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }))();

  return <>
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">Question type</InputLabel>
      <Select value={data.questionType} name={"questionType"} onChange={handleInputChange}>
        <MenuItem value={"pickOne"}>Pick one</MenuItem>
        <MenuItem value={"pickMultiple"}>Pick multiple</MenuItem>
        <MenuItem value={"sequence"}>Sequence</MenuItem>
        <MenuItem value={"fillTextFromOptions"}>Fill text from options</MenuItem>
        <MenuItem value={"fillTextExactly"}>Fill text exactly</MenuItem>
      </Select>
    </FormControl>

    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label"> Answer type:</InputLabel>
      <Select value={data.answerType} name={"answerType"} onChange={handleInputChange}>
        <MenuItem value={"simpleInput"}>Simple input</MenuItem>
        <MenuItem value={"markdown"}>Markdown</MenuItem>
      </Select>
    </FormControl>

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


  </>
}


