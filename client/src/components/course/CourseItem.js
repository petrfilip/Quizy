import { Link as RouterLink, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { Card, CardActions, Container, Divider, Grid, makeStyles, Paper } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import Skeleton from '@material-ui/lab/Skeleton';
import List from "../layout/List";
import LessonItemCard from "../lesson/LessonItemCard";

const useStyles = makeStyles((theme) => ({
  info: { color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main, textAlign: "center", padding: "15px" },
}));

export default function CourseItem({ slug }) {
  const classes = useStyles();

  const [currentAction, setCurrentAction] = useState("choice")
  const [data, setData] = useState({})
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState()
  const history = useHistory();
  const location = useLocation();

  useLayoutEffect(() => {

    if (slug === "newQuiz") {
      setData({
        title: "New quiz"
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
      .catch((err) => setError(err.message))
      .finally(() => setIsPending(false))

  }, [slug])

  let { path, url } = useRouteMatch();

  return <>


    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <div className={classes.info}>Course</div>
      <Paper style={{ padding: "20px", minHeight: '500px' }}>
        <Typography variant={"h4"}>{data.description}</Typography>
        {data.lessonList && <List data={data.lessonList} component={(item) => <LessonItemCard lessonItem={item} />} />}
      </Paper>
    </Container>


  </>

}

