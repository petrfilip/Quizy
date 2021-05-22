import React, { useLayoutEffect, useState } from "react";
import List from "../../app/List";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Container, makeStyles } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { useAuth } from "../../app/AuthContext";
import LessonCard from "./LessonCard";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function LessonManager() {
  const classes = useStyles();
  const { t } = useTranslation();

  const [data, setData] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();

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
        headers:{
          'Authorization': 'Bearer ' + token,
        },
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to delete data: ${response.statusText}`)
      })
      .then(json => setData(removeFromCollection(lessonId)))
      .then(() => enqueueSnackbar('Lesson deleted', { variant: "success" }))
      .catch((err) => {
        enqueueSnackbar('Lesson not deleted', { variant: "error" });
        setError(err.message)
      })
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

  const columns = [
    {
      Header: 'Title',
      accessor: 'title'
    }
  ];

  return <Container maxWidth={"lg"}>
    <Typography variant="h4">{t('title_lesson')}</Typography>

    {/*{isPending && "Loading data"}*/}
    {error}

    <Button color={"primary"}
            startIcon={<AddIcon/>}
            variant="outlined"
            to={`/lessons/newQuiz`}
            component={RouterLink}
    >{t('lm_addNewLesson')}</Button>
    <List isPending={isPending} columns={columns} data={data} component={(item) => {
      return <LessonCard lessonItem={item} onDelete={deleteItemDialog}/>
    }}/>
    </Container>

}


