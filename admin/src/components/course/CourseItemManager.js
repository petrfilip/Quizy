import React, { useLayoutEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Backdrop, Badge, CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import urlSlug from "url-slug";
import { useAuth } from "../../app/AuthContext";
import Grid from "@material-ui/core/Grid";
import List from "../../app/List";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const gridItemSizes = {
  xs: 6,
  sm: 6,
  md: 6,
  lg: 12,
  xl: 12
}

export default function CourseItemManager({ slug }) {
  const classes = useStyles();

  const [isError, setIsError] = useState(false);
  const [data, setData] = useState({});
  const [lessonList, setLessonList] = useState([]);
  const [isPending, setIsPending] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();
  let history = useHistory();


  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    data[name] = value
    setData({ ...data })
  }

  useLayoutEffect(() => {

    if (slug === "newCourse") {
      setData({
        title: "",
        lessonList: []
      })
      setIsPending(false)
      return
    }

    fetch(`${process.env.REACT_APP_BASE_URI}/courses/${slug}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {
        setData(json)
      })
      .catch((err) => setIsError(err.message))
      .finally(() => setIsPending(false))

  }, [slug])

  useLayoutEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI}/lessons`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => setLessonList(json))
      .catch((err) => setIsError(err.message))
      .finally(() => setIsPending(false))

  }, [])

  function saveData(e) {
    e.preventDefault()
    setIsPending(true)

    data.slug = urlSlug(data?.title)
    data.lessonList = data.lessonList.filter(item => item != null)

    fetch(`${process.env.REACT_APP_BASE_URI}/courses`,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {
        if (!data._id) {
          history.push(json.slug)
        }
        setIsError(false)
        setData(json)
        enqueueSnackbar(`Course "${json.title}" ${data._id ? "updated" : "created"}  with id ${json._id}`, { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar(`Course creation failed. ${err}`, { variant: "error" });
        setIsError(err.message)
      })
      .finally(() => setIsPending(false))

  }

  const onLessonSelected = (item) => {
    data.lessonList.push(item._id);
    setData({ ...data })
  }

  const onLessonUnselected = (item) => {
    data.lessonList = data.lessonList.filter(lessonId => lessonId !== item._id)
    setData({ ...data })
  }

  const isSelected = (item) => {
    return data.lessonList.some(lessonId => {
      return lessonId === item._id
    })
  }

  return (<Container maxWidth={"lg"}>
      <Button color={"primary"}
              startIcon={<AddIcon/>}
              variant="outlined"
              to={`/courses`}
              component={RouterLink}
      >List courses</Button>

      <Grid container>
        <Grid item xs={6}>
          <Container component="main" maxWidth="xs">
            {/*<Backdrop open={isPending}>*/}
            {/*  <CircularProgress color="inherit"/>*/}
            {/*</Backdrop>*/}

            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                {data._id ? "Update" : "Create"} new course
              </Typography>

              <form className={classes.form} noValidate onSubmit={saveData}>
                <TextField
                  type={"text"}
                  value={data.title || ""}
                  error={isError}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Title"
                  name="title"
                  autoComplete="off"
                />
                <TextField
                  type={"text"}
                  value={data.title && urlSlug(data?.title) || ""}
                  error={isError}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="slug"
                  label="Slug"
                  disabled={true}
                  autoComplete="off"
                />
                <TextField
                  multiline
                  rows={2}
                  rowsMax={4}
                  value={data?.description || ""}
                  error={isError}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="description"
                  label="Description"
                  type="text"
                  autoComplete="current-password"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  {data._id ? "Update" : "Create"}  course
                </Button>
              </form>

            </div>

          </Container>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Lessons in course
            </Typography>
            <List
              gridSizes={gridItemSizes}
              columns={[{ accessor: 'title' }]}
              data={lessonList.filter(x => isSelected(x))}
              component={(item) => OutlinedCard(item, onLessonUnselected)}/>
            <Typography component="h1" variant="h5">
              Available lessons
            </Typography>
            <List
              gridSizes={gridItemSizes}
              columns={[{ accessor: 'title' }]}
              data={lessonList.filter(x => !isSelected(x))}
              component={(item) => OutlinedCard(item, onLessonSelected)}/>
          </div>
        </Grid>
      </Grid>


    </Container>

  );
}

function OutlinedCard(lessonItem, onSelect) {

  return (
    <Card variant="outlined">
          <CardContent>
            <Typography>
              {lessonItem.title}
            </Typography>
          </CardContent>

          <CardActions>
            <Button color={"primary"} startIcon={<DoubleArrowIcon/>} onClick={() => onSelect(lessonItem)}/>
          </CardActions>
    </Card>
);
}
