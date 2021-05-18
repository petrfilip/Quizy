import React, { useLayoutEffect, useState } from 'react';
import { useSnackbar } from "notistack";
import { useAuth } from "../../app/AuthContext";
import UserLabelInput from "./UserLabelInput";
import { useHistory } from "react-router-dom";
import { DataGrid } from '@material-ui/data-grid';
import Grid from "@material-ui/core/Grid";
import { Card, CardActions, Chip, Switch } from "@material-ui/core";
import CourseInput from "../course/CourseInput";
import LessonInput from "../lesson/LessonInput";
import Button from "@material-ui/core/Button";
import * as moment from "moment";
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import TimerIcon from '@material-ui/icons/Timer';
import ReplayIcon from '@material-ui/icons/Replay';
import GradeIcon from '@material-ui/icons/Grade';
import CardContent from "@material-ui/core/CardContent";

const UsersLabelsOverview = ({ labels }) => {

  const [data, setData] = useState([])
  const [isCourseView, setIsCourseView] = useState(true)
  const [selectedLessons, setSelectedLessons] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();
  let history = useHistory();

  useLayoutEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI}/users`, {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    })
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

  const cond = labels && labels.split(":") || []

  const dataGridData = () => {
    const users = data
      .filter((item) => containsAll(cond, item.labels || [])) // filter by labels
      .map(item => { //map required id
        item.id = item._id
        return item;
      })
      .map(item => {
        selectedLessons.forEach(lesson => {
          item[lesson.slug] = lesson
        })
        return item;
      })

    console.log(users)

    return users;

  }

  const columns = [
    {
      field: 'name', headerName: 'Labels', width: 230,
      renderCell: (params) => (
        <Card>
          <CardContent>
            {params.getValue("name")}
            {params.getValue("mail")}
            {params.getValue("labels")?.map(label => <Chip key={`${label}`} label={label}/>)}
          </CardContent>
        </Card>
      )
    },

  ];

  const columnsWithLessons = () => {
    const columnsWithLessons = [...columns];
    selectedLessons.forEach(lesson => columnsWithLessons.push({
      field: lesson.slug, headerName: lesson.title, width: 220,
      renderCell: (params) => {
        const lessonCard = (
          <Card>
            <CardActions>
              <Button size="small" startIcon={<GradeIcon/>} color="primary">
                {params.getValue("achievements")?.lessonList.find(finishedLesson => finishedLesson.lessonId === params.value._id)?.score}
              </Button>
              <Button size="small" startIcon={<TimerIcon/>} color="primary">
                {moment.utc(params.getValue("achievements")?.lessonList.find(finishedLesson => finishedLesson.lessonId === params.value._id)?.doneInTime * 1000).format('H:mm:ss')}
              </Button>
            </CardActions>
            <CardActions>

              <Button size="small" startIcon={<ReplayIcon/>} color="primary">
                {params.getValue("achievements")?.lessonList.find(finishedLesson => finishedLesson.lessonId === params.value._id)?.trying}
              </Button>

              <Button size="small" startIcon={<EventAvailableIcon/>} color="primary" title={"Completation date"}>
                {moment(params.getValue("achievements")?.lessonList.find(finishedLesson => finishedLesson.lessonId === params.value._id)?.completionDate).format("YYYY-MM-DD")}
              </Button>
            </CardActions>
          </Card>
        )

        return params.getValue("achievements")?.lessonList.find(finishedLesson => finishedLesson.lessonId === params.value._id) != undefined ? lessonCard : <>-</>
      }
    }));
    return columnsWithLessons;

  }

  const onCourseInputChangedHandler = (item) => {
    setSelectedLessons(item && item.lessonList || [])
  }

  const onLessonInputChangedHandler = (item) => {
    setSelectedLessons(item || [])
  }

  return (
    <div>

      <Grid container spacing={4} style={{ marginTop: "15px", marginBottom: "15px" }}>
        <Grid item xs={6} style={{ textAlign: "right", paddingRight: "10px" }}>
          <UserLabelInput defaultValues={labels && labels.split(":")} onChange={(items) => {
            history.push("/users/labels/" + items.join(":"))
          }}/>
        </Grid>
        <Grid item xs={6} style={{ display: "flex" }}>
          {isCourseView ? <CourseInput onChange={onCourseInputChangedHandler}/> : <LessonInput onChange={onLessonInputChangedHandler}/>}
          <Switch
            checked={isCourseView}
            onChange={(e) => setIsCourseView(e.target.checked)}
            name="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </Grid>
      </Grid>

      <div style={{ height: '1100px', width: '100%' }}>
        <DataGrid density={"compact"} rowHeight={100} rows={dataGridData()} columns={columnsWithLessons()} pageSize={50}/>
      </div>

    </div>
  );
};

function containsAll(arr, arr2) {
  return arr.every(i => arr2.includes(i));
}

export default UsersLabelsOverview;