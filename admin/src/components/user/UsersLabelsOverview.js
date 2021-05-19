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
import Typography from "@material-ui/core/Typography";

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
      field: 'name', headerName: 'Users', width: 250,
      hide: false,
      resizable: true,
      renderCell: (params) => (
        <div>
          <Typography>
            {params.getValue("name")}
          </Typography>
          <Typography color="textSecondary">
            {params.getValue("mail")}
          </Typography>
          <Typography>
            {params.getValue("labels")?.map(label => <Chip key={`${label}`} label={label}/>)}
          </Typography>
        </div>
      )
    },

  ];

  const columnsWithLessons = () => {
    const columnsWithLessons = [...columns];
    selectedLessons.forEach(lesson => columnsWithLessons.push({
      field: lesson.slug, headerName: lesson.title, width: 220,
      sortable: true,
      filterable: false,
      resizable: false,
      sortComparator: (v1, v2, cellParams1, cellParams2) => {
        return cellParams1.getValue("achievements")?.lessonList.find(finishedLesson => finishedLesson.examId === v1._id)?.score || -1 < cellParams2.getValue("achievements")?.lessonList.find(finishedLesson => finishedLesson.examId === v2._id)?.score || -1
      },
      renderCell: (params) => {
        function getFind() {
          return params.getValue("achievements")?.lessonList.sort((a,b) => new Date(a.finishedAt) > new Date(b.finishedAt) ? -1 : 1).find(finishedLesson => finishedLesson.examId === params.value._id);
        }

        function getTries() {
          return params.getValue("achievements")?.lessonList.filter(value => value.examId === params.value._id).length
        }

        function getExamDuration() {
          const now = moment(getFind()?.finishedAt); //todays date
          const end = moment(getFind()?.startedAt); // another date
          const duration = moment.duration(now.diff(end));
          return duration.asSeconds();
        }

        const lessonCard = (
          <Card>
            <CardActions>
              <Button size="small" startIcon={<GradeIcon/>} color="primary">
                {getFind()?.score}
              </Button>
              <Button size="small" startIcon={<TimerIcon/>} color="primary">
                {moment.utc(getExamDuration() * 1000).format('H:mm:ss')}
              </Button>
            </CardActions>
            <CardActions>

              <Button size="small" startIcon={<ReplayIcon/>} color="primary">
                {getTries()}
              </Button>

              <Button size="small" startIcon={<EventAvailableIcon/>} color="primary" title={`Completion date: ${getFind()?.finishedAt}`}>
                {moment(getFind()?.finishedAt).format("YYYY-MM-DD")}
              </Button>
            </CardActions>
          </Card>
        )

        return params.getValue("achievements")?.lessonList.find(finishedLesson => finishedLesson.examId === params.value._id) != undefined ? lessonCard : <>-</>
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
    <>

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
            onChange={(e) => {
              setIsCourseView(e.target.checked)
            }}
            name="lessonOrCourse"
          />
        </Grid>
      </Grid>

      <div style={{ height: '1100px', width: '100%' }}>
        <DataGrid density={"compact"} rowHeight={150} rows={dataGridData()} columns={columnsWithLessons()} pageSize={50} columnBuffer={50}   headerHeight={50} />
      </div>

    </>
  );
};

function containsAll(arr, arr2) {
  return arr.every(i => arr2.includes(i));
}

export default UsersLabelsOverview;