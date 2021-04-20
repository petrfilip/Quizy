import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function QuizManager() {

  const [data, setData] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState()

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI}/quiz`)
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

  return <div>
    {data.map(item => <div><Link to={`/quiz/${item.slug}`}>{item.title}</Link></div>)}
  </div>

}