import { useLayoutEffect, useState } from "react";
import { Container } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import List from "../layout/List";
import { useTranslation } from "react-i18next";
import CourseItemCard from "./CourseItemCard";

export default function CoursePage() {

  const [data, setData] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState()
  const { t } = useTranslation();


  useLayoutEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI}/courses`)
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


  const columns = [
    {
      Header: 'Title',
      accessor: 'title'
    }
  ];

  return <Container maxWidth={"lg"}>
    <Typography variant="h2">{t('title_allCourses')}</Typography>
    {/*{isPending && "Loading data"}*/}
    {error}
    <List columns={columns} data={data} component={(item) => <CourseItemCard  lessonItem={item}/>}/>

    {/*{data.map(item => <div key={`quizLink-${item.slug}`}><Link to={`/course/${item.slug}`}>{item.title}</Link></div>)}*/}
  </Container>

}






