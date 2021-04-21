import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CoursePage() {

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
    {isPending && "Loading data"}
    {error}
    {data.map(item => <div key={`quizLink-${item.slug}`}><Link to={`/course/${item.slug}`}>{item.title}</Link></div>)}
  </div>

}