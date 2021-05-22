import QuizItem from "./QuizItem";
import { Timer } from "../Timer";
import { Box, Container, makeStyles, Paper, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import useExam from "../layout/ExamHook";
import { useContext } from "react";
import { ExamContext } from "../layout/ExamContext";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  info: { color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main, textAlign: "center", padding: "15px" },
}));

export default function ExamQuiz({ lesson }) {

  const { question, onAnswerSubmitHandler, currentQuestionIndex, loadExamData, results } = useExam(lesson)
  const { exam } = useContext(ExamContext)
  const { t } = useTranslation();


  const questionPage = (
    <>
      <Container maxWidth="md" style={{ marginTop: "20px" }}>
        <Paper>
          <QuizItem
            key={`quizItem-${currentQuestionIndex}`}
            question={question}
            onAnswerSubmit={onAnswerSubmitHandler}
          />
        </Paper>
      </Container>


      <Container maxWidth="md" style={{
        alignItems: "center",
        flexDirection: "row", display: "flex", justifyContent: "space-between",
      }}>
        <Timer/>
        {/*<QuizProgress current={answers.length} total={quizItems.length}/>*/}
      </Container>
    </>
  )
  const classes = useStyles();

  const resultPageContent = (<>
      <Typography variant={"h2"}>{t('title_yourExamResult')}: {results?.score} %</Typography>
      {
        lesson.examParameters.minimalScore < results?.score ?
          <Typography variant={"h3"} color={"primary"}>{t('title_passedExamResult')}</Typography> :
          <Typography variant={"h3"} color={"primary"}>{t('title_failedExamResult')}</Typography>
      }
      <Button
        variant={"contained"}
        component={RouterLink}
        to={`/profile`}
        color={"primary"}>{t('button_goToProfile')}</Button>
    </>
  )

  const resultPage = (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <div className={classes.info}>{t('title_examResult')}</div>
      <Paper style={{ padding: "20px", minHeight: '500px', textAlign: "center" }}>
        {results?.score !== undefined && resultPageContent}
      </Paper>
    </Container>
  )

  const confirmStartPage = (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <div className={classes.info}>{t('title_areYouReady')}</div>
      <Paper style={{ padding: "20px", minHeight: '500px', textAlign: "center" }}>

        {lesson?.examParameters && <>
          <Box>{t('title_minimalScore')}: {lesson.examParameters.minimalScore} %</Box>
          <Box>{t('title_countOfQuestions')}: {lesson.examParameters.questionsInExam}</Box>
          <Box>{t('title_repeatable')}: {!!lesson.examParameters.repeatable ? t('yes') : t('no')}</Box>
          {false && <Box>Time limit {lesson.examParameters.timeLimit}</Box>}
        </>
        }
        <Typography variant={"h2"} component={"button"} onClick={loadExamData}>{t('button_startExam')}</Typography>
      </Paper>
    </Container>
  )

  return (<>
    {!question && !results && confirmStartPage}
    {exam && question && !results && questionPage}
    {results && resultPage}
  </>)
}

