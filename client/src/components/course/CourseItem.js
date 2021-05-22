import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { Container, makeStyles, Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import List from "../layout/List";
import LessonItemCard from "../lesson/LessonItemCard";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  info: { color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main, textAlign: "center", padding: "15px" },
}));

export default function CourseItem({ slug }) {
  const classes = useStyles();
  const { t } = useTranslation();

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

  return <>


    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <div className={classes.info}>{t('title_course')}</div>
      <Paper style={{ padding: "20px", minHeight: '500px' }}>
        <Typography variant={"h4"}>{data.title}</Typography>
        <Typography color={"textSecondary"}>{data.description}</Typography>
        {data.lessonList && <List data={data.lessonList} component={(item) => <LessonItemCard lessonItem={item} />} />}
      </Paper>
    </Container>


  </>

}

