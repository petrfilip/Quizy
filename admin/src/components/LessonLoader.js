import React, { useLayoutEffect, useState } from "react";
import List from "../app/table/List";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Chip, Link } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';

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

  const columns = [
    {
      Header: 'Title',
      accessor: 'title'
    }
  ];

  return <>
    {isPending && "Loading data"}
    {error}

    <Button color={"primary"}
            startIcon={<AddIcon/>}
            variant="outlined"
            to={`/lessons/newQuiz`}
            component={RouterLink}
    >Add new quiz</Button>
    <List columns={columns} data={data} component={(item) => {
      return OutlinedCard(item)
    }}/>

  </>

}

function OutlinedCard(lessonItem) {

  return (
    <Card variant="outlined">
      {/*<CardMedia*/}
      {/*  style={{*/}
      {/*    width: "auto",*/}
      {/*    maxHeight: "200px",*/}
      {/*  }}*/}
      {/*  component="img"*/}
      {/*  alt="Contemplative Reptile"*/}
      {/*  image="https://via.placeholder.com/500"*/}
      {/*  title="Contemplative Reptile"*/}
      {/*/>*/}
      <CardContent>
        <Typography>
          {lessonItem.title}
        </Typography>
        <Chip label={lessonItem.questions && lessonItem.questions.length || 0}/>
        <Chip label={lessonItem.flashcards && lessonItem.flashcards.length || 0}/>
      </CardContent>
      <CardActions>

        <Button color={"primary"} startIcon={<EditIcon/>} component={RouterLink} to={`/lessons/${lessonItem.slug}`}>Edit</Button>
        <Button color={"secondary"} startIcon={<DeleteIcon/>}>Delete</Button>
      </CardActions>
    </Card>
  );
}

