import React, { useState, useLayoutEffect } from "react";
import { Tabs } from "react-simple-tabs-component";
import QuizItemEditor from "./QuizItemEditor";
import QuizItemMain from "./QuizItemMain";
import 'react-simple-tabs-component/dist/index.css'
import urlSlug from "url-slug"; // (Optional) Provide some basic style
import { useHistory } from "react-router-dom";
import "./QuizItemManager.css"

export default function QuizItemManager({ slug }) {

  const [data, setData] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState()
  let history = useHistory();

  useLayoutEffect(() => {

    if (slug === "newQuiz") {
      setData({
        title: "New quiz"
      })
      setIsPending(false)
      return
    }

    fetch(`${process.env.REACT_APP_BASE_URI}/quiz/${slug}`)
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

    fetch(`${process.env.REACT_APP_BASE_URI}/quiz`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(r => r.json())
      .then(json => {
        if (data._id) {
          setData(json)
        } else {
          history.push(json.slug)
          setData(json)
        }
      })
      .finally(() => {
      });
  }

  const onMainChange = (changed) => {
    setData({ ...changed })
  }

  const Main = () => <div>
    <QuizItemMain data={data} onChange={onMainChange}/>
  </div>

  const tabs = [
    {
      label: 'Main', // Tab title
      index: 0,         // Tab index
      Component: Main // Tab Component
    },
  ]

  const Item = () => <div>
    <QuizItemEditor question={tabs[selectedTab].question}/>
  </div>

  data?.questions?.map(item => tabs.push(
    {
      label: item.question,
      index: tabs.length,
      question: item,
      Component: Item
    }
  ))

  const addNewQuestionHandler = () => {

    data.questions = data.questions || []

    const defaultQuestion = {
      questionType: "pickOne",
      answerType: "simpleInput",
      question: `New ${data.questions.length}`,
      answers: [
        { text: "" },
        { text: "" }
      ]
    }
    data.questions.push(defaultQuestion)
    setData({ ...data })
    setSelectedTab(tabs.length)
  }

  const [selectedTab, setSelectedTab] = useState(tabs[0].index)

  return <div>
    {isPending && "Loading data..."}
    {error && <div>{error}</div>}


    <button onClick={persistQuizHandler} disabled={data.title === "New quiz"}>Persist quiz</button>
    <button onClick={addNewQuestionHandler}>Add question</button>
    <Tabs orientation={"vertical"}
          tabs={tabs} onClick={setSelectedTab}
          selectedTab={selectedTab}

    />
    {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}


  </div>
}

function Users() {
  return <h2>Users</h2>;
}