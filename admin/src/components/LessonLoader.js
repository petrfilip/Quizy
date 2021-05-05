import React, { useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import TableR from "../app/table/Table";

export default function LessonLoader() {

  const [data, setData] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState()

  useLayoutEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI}/lessons`)
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

  const deleteItem = (lessonId) => {
    console.log(data)
    setIsPending(true)
    fetch(`${process.env.REACT_APP_BASE_URI}/lessons/${lessonId}`,
      {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to delete data: ${response.statusText}`)
      })
      .then(json => setData(removeFromCollection(lessonId)))
      .catch((err) => setError(err.message))
      .finally(() => setIsPending(false))
  }

  const removeFromCollection = (lessonId) => {
    console.log(data)
    return data.filter((item) => item._id !== lessonId)
  }

  const deleteItemDialog = (lesson) => {
    console.log(data)

    if (window.confirm(`Are you sure to delete ${lesson.title} record?`)) {
      deleteItem(lesson._id)
    }
  }

  const columns =  [
      {
        id: 'actions',
        Header: () => null,
        // accessor: 'title', // accessor is the "key" in the data
        accessor: (row) => row,
        Cell: ({ value }) => <div>
          <Link to={`/lessons/${value.slug}`}>Edit</Link>
          <Link to={`#`} onClick={() => deleteItemDialog(value)}> <i className="material-icons">Delete</i> </Link>
        </div>
      },
      {
        Header: 'Title',
        accessor: 'title'
      },
      {
        Header: 'Q',
        accessor: 'questions.length',
      },
      {
        Header: 'FC',
        accessor: (row) => row.flashcards && row.flashcards.length || 0
      }
    ];

  return <div>
    {isPending && "Loading data"}
    {error}

    <Link to={`/lessons/newQuiz`}>Add new quiz</Link>
    <TableR columns={columns} data={data}/>

  </div>

}

