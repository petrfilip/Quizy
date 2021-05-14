import React, { useLayoutEffect, useState } from "react";
import List from "../../app/List";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Badge, CardHeader, CardMedia, Container, makeStyles } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { useSnackbar } from "notistack";
import { useAuth } from "../../app/AuthContext";
import LessonCard from "./LessonCard";

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
    <Typography variant="h4">Lessons</Typography>

    {/*{isPending && "Loading data"}*/}
    {error}

    <Button color={"primary"}
            startIcon={<AddIcon/>}
            variant="outlined"
            to={`/lessons/newQuiz`}
            component={RouterLink}
    >Add new lesson</Button>
    <List columns={columns} data={data} component={(item) => {
      return LessonCard(item, deleteItemDialog)
    }}/>
    </Container>

}


