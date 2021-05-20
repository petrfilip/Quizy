import FlashCards from "../flashcards/FlashCards";
import { Link as RouterLink, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import Quiz from "../quiz/Quiz";
import { Card, CardActions, Container, Grid, Paper } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import Skeleton from '@material-ui/lab/Skeleton';
import ExamQuiz from "../quiz/ExamQuiz";
import useUser from "../layout/UserHook";
import GradeIcon from "@material-ui/icons/Grade";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import DoneIcon from '@material-ui/icons/Done';

export default function LessonItem({ slug }) {

  const [currentAction, setCurrentAction] = useState("choice")
  const [data, setData] = useState({})
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState()
  const history = useHistory();
  const location = useLocation();
  const { user } = useUser()
  let { path, url } = useRouteMatch();


  useLayoutEffect(() => {

    fetch(`${process.env.REACT_APP_BASE_URI}/lessons/${slug}`)
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

  function getAchievementItem() {
    return user?.achievements?.lessonList.find(item => item.examId === data._id);
  }

  const choicer = <Container maxWidth="md" style={{ minHeight: '500px' }}>
    <Paper style={{ padding: "10px" }}>

      <Grid container spacing={2}>
        {data.flashcards && <Grid item xs={6}>
          <OutlinedCard
            content={<Typography>FlashCards</Typography>}
            action={<Button component={RouterLink}
                            to={`${url}/flashcards`}
                            color={"secondary"}
                            startIcon={<DoubleArrowIcon/>}
            />}
          />
        </Grid>}
        <Grid item xs={6}>
          <OutlinedCard
            content={<Typography>Quiz</Typography>}
            action={<Button component={RouterLink}
                            to={`${url}/quiz`}
                            color={"secondary"}
                            startIcon={<DoubleArrowIcon/>}
            />}
          />
        </Grid>
        <Grid item xs={6}>
          <OutlinedCard
            content={<>
              <Typography>Exam</Typography>
              {getAchievementItem() && <Button startIcon={<EventAvailableIcon/>} color={"primary"}>{(getAchievementItem()?.finishedAt)}</Button>}
              {getAchievementItem() && <Button startIcon={<GradeIcon/>} color={"primary"}>{JSON.stringify(getAchievementItem()?.score)}</Button>}
            </>}
            action={user?.mail ? <Button component={RouterLink}
                            to={`${url}/exam`}
                            color={"secondary"}
                            startIcon={getAchievementItem() ? <DoneIcon /> : <DoubleArrowIcon/>}/> :
              <Button component={RouterLink}
                      to={`/login`}
                      color={"primary"}
                      startIcon={<DoubleArrowIcon/>}>Log in</Button>
            }
          />
        </Grid>
        <Grid item xs={6}>
          <OutlinedCard
            content={<Typography>Feedback</Typography>}
            action={<Button component={RouterLink}
                            to={`${url}/feedback`}
                            color={"secondary"}
                            startIcon={<DoubleArrowIcon/>}
            />}
          />
        </Grid>
      </Grid>

    </Paper>
  </Container>

  return <>
    <Container maxWidth="md">
      <Typography variant={"h4"}>{data.title || <Skeleton/>}</Typography>
    </Container>

    <Switch>
      <Route exact path={path}>
        {choicer}
      </Route>
      <Route path={`${path}/flashcards`}>
        {data.flashcards && <FlashCards flashcards={data.flashcards}/>}
      </Route>
      <Route path={`${path}/quiz`}>
        {data.questions && <Quiz quizData={data.questions}/>}
      </Route>
      <Route path={`${path}/exam`}>
        {data.questions && <ExamQuiz lesson={data}/>}
      </Route>
    </Switch>
  </>

}

function OutlinedCard({ content, action }) {
  return (
    <Card variant="outlined">
      <CardContent>
        {content}
      </CardContent>
      <CardActions>
        {action}
      </CardActions>
    </Card>
  );
}