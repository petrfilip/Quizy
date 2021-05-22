import React, { useState, useLayoutEffect, useReducer, useEffect } from "react";
import QuizQuestionEditor from "../quiz/QuizQuestionEditor";
import QuizItemMain from "../QuizItemMain";
import 'react-simple-tabs-component/dist/index.css'
import urlSlug from "url-slug"; // (Optional) Provide some basic style
import { useHistory } from "react-router-dom";
import { Button, ButtonGroup } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import { useSnackbar } from 'notistack';
import VerticalTabs from "../../app/TabPanel";
import { Prompt } from "react-router-dom";
import { useAuth } from "../../app/AuthContext";
import FlashCardManager from "../flashcard/FlashCardManager";
import * as immutable from 'object-path-immutable'
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import { useTranslation } from "react-i18next";

export default function LessonItemManager({ slug }) {

  const [isPersisted, setIsPersisted] = useState(true)
  const [data, setData] = useState(null)
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState()
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [selectedTab, setSelectedTab] = useState(0)
  const { token } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    setIsPersisted(false)
  }, [JSON.stringify(data)])

  useLayoutEffect(() => {

    if (slug === "newQuiz") {
      setData({
        title: "New quiz"
      })
      setIsPending(false)
      return
    }

    fetch(`${process.env.REACT_APP_BASE_URI}/lessons/${slug}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {

        setData(json)
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsPending(false))

  }, [slug])

  const persistQuizHandler = () => {

    if (!data.slug) {
      data.slug = urlSlug(data.title)
    }

    fetch(`${process.env.REACT_APP_BASE_URI}/lessons`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response;
      })
      .then(json => {
        if (!data._id) {
          history.push(json.slug)
        }
        setData(json)
      }).then(() => {
      setIsPersisted(true)
      enqueueSnackbar('Lesson persisted', { variant: "success" });
    })
      .catch((err) => {
        err.json().then(errorMessage => {
          enqueueSnackbar(`Lesson not persisted :: ${errorMessage.error}`, { variant: "error" })
        })
        ;

      })
      .finally(() => {
      });
    forceUpdate()
  }

  const onDataChangeHandler = (changed) => {
    setData({ ...changed })
  }

  const onMainDataChangeHandler = (key, value) => {
    setData((current) => {
      return immutable.set(current, key, value)
    });
  }

  const Main = () => (<>
    {data && <QuizItemMain data={data} onChangeCallback={onMainDataChangeHandler}/>}
  </>)

  const FlashCards = () => (<>
    {data && <FlashCardManager data={data} onChangeCallback={onDataChangeHandler}/>}
  </>)

  const tabs = [
    {
      label: t('lim_main'), // Tab title
      index: 0,         // Tab index
      Component: Main // Tab Component
    },
    {
      label: t('lim_flashcards'),
      index: 1,
      Component: FlashCards
    }
  ]

  const Item = () => (<div>
    <QuizQuestionEditor question={tabs[selectedTab].question}/>
  </div>)

  data?.questions?.map(item => tabs.push(
    {
      label: <Button startIcon={!item?.correct?.length ? <ReportProblemIcon/> : ""}>
        {item.question}</Button>,
      index: tabs.length,
      question: item,
      Component: Item
    }
  ))

  const addNewQuestionHandler = () => {

    isPersisted && setIsPersisted(false)

    data.questions = data.questions || []

    const defaultQuestion = {
      questionType: "pickOne",
      answerType: "simpleInput",
      question: `${t('lim_newPrefix')} ${data.questions.length}`,
      answers: [
        { text: "" },
        { text: "" }
      ]
    }
    const questions = [...data.questions];
    questions.push(defaultQuestion)
    setData({ ...data, questions })
    setSelectedTab(tabs.length)
  }

  const removeQuestionHandler = () => {

    isPersisted && setIsPersisted(false)

    const questions = [...data.questions];
    questions.splice(selectedTab - 2, 1)
    setData({ ...data, questions })
    setSelectedTab(selectedTab - 1)
  }

  return data != null ? (<div>
    {/*{isPending && "Loading data..."}*/}
    {error && <div>{error}</div>}

    <Prompt
      when={!isPersisted}
      message={location => t('lim_unsavedWarning')}
    />

    <ButtonGroup color="primary" aria-label="outlined primary button group">
      <Button variant={isPersisted && "outlined" || "contained"}
              startIcon={<SaveIcon/>} color={"primary"}
              onClick={persistQuizHandler}
              disabled={data.title === "New quiz"}>{t('lim_persistLesson')}</Button>
      <Button startIcon={<AddIcon/>} onClick={addNewQuestionHandler}>{t('lim_addNewQuestion')}</Button>
      <Button startIcon={<DeleteIcon/>} color={"secondary"}
              onClick={removeQuestionHandler} disabled={selectedTab <= 1}>{t('lim_addDeleteQuestion')}</Button>
    </ButtonGroup>
    <VerticalTabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>

  </div>) : null
}