import { Link as RouterLink } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { Card, CardActions, CardMedia, Container } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "../layout/List";
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import LessonItemCard from "./LessonItemCard";
import { useTranslation } from "react-i18next";

export default function LessonPage() {

  const [data, setData] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState()
  const { t } = useTranslation();


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


  const columns = [
    {
      Header: 'Title',
      accessor: 'title'
    }
  ];

  return <Container maxWidth={"lg"}>
    <Typography variant="h2">{t('title_allLessons')}</Typography>
    {/*{isPending && "Loading data"}*/}
    {error}
    <List columns={columns} data={data}
          component={(item) => <LessonItemCard lessonItem={item} /> }/>
  </Container>

}




