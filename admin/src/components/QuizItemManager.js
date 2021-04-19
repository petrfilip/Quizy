import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { Tabs } from "react-simple-tabs-component";
import QuizItemEditor from "./QuizItemEditor";

export default function QuizItemManager({ slug }) {

  const [data, setData] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState()

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI}/quiz/${slug}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setIsPending(false))

  }, [])

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    data[name] = value

    const newData = Object.assign({}, data);
    setData(newData)
  }

  const Main = () => <div><input type={"text"} name={"title"} value={data.title} onChange={handleInputChange}/>
    <input type={"text"} name={"slug"} value={data.slug} onChange={handleInputChange}/>
    <textarea name={"description"} value={data.description} onChange={handleInputChange}/>
    <input type={"text"} name={"heroImage"} value={data.heroImage} onChange={handleInputChange}/></div>

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

  const [selectedTab, setSelectedTab] = useState(tabs[0].index)

  return <div>
    {isPending && "Loading data..."}
    {error && <div>{error}</div>}

    <Tabs tabs={tabs} onClick={setSelectedTab} selectedTab={selectedTab}/>


  </div>
}

function Users() {
  return <h2>Users</h2>;
}