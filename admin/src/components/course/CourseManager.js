import React, { useLayoutEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Container } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { useAuth } from "../../app/AuthContext";
import List from "../../app/List";

export default function CourseManager() {

  const [data, setData] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();

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

  const deleteItem = (lessonId) => {
    console.log(data)
    setIsPending(true)
    fetch(`${process.env.REACT_APP_BASE_URI}/courses/${lessonId}`,
      {
        method: 'DELETE',
        headers: {
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
      .then(() => enqueueSnackbar('Course deleted', { variant: "success" }))
      .catch((err) => {
        enqueueSnackbar('Course not deleted', { variant: "error" });
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
    <Typography variant="h4">Courses</Typography>

    {/*{isPending && "Loading data"}*/}
    {error}

    <Button color={"primary"}
            startIcon={<AddIcon/>}
            variant="outlined"
            to={`/courses/newCourse`}
            component={RouterLink}
    >Add new course</Button>
    <List isPending={isPending} columns={columns} data={data} component={(item) => {
      return OutlinedCard(item, deleteItemDialog)
    }}/>
  </Container>

}

function OutlinedCard(lessonItem, onDelete) {

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


      </CardContent>
      <CardActions>
        {/*<Badge badgeContent={lessonItem && lessonItem.flashcards && lessonItem.flashcards.length || "0"} color="primary">*/}
        {/*  <MenuBookIcon/>*/}
        {/*</Badge>*/}
        {/*<Badge badgeContent={lessonItem.questions && lessonItem.questions.length || "0"} color="primary">*/}
        {/*  <QuestionAnswerIcon/>*/}
        {/*</Badge>*/}

        <Button color={"primary"} startIcon={<EditIcon/>} component={RouterLink} to={`/courses/${lessonItem.slug}`}>Edit</Button>
        <Button color={"secondary"} startIcon={<DeleteIcon/>} onClick={() => onDelete(lessonItem)}>Delete</Button>
      </CardActions>
    </Card>
  );
}

