import QuizItem from "./QuizItem";
import { Timer } from "../Timer";
import { Box, Container, makeStyles, Paper, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import useExam from "../layout/ExamHook";
import { useContext } from "react";
import { ExamContext } from "../layout/ExamContext";

const useStyles = makeStyles((theme) => ({
  info: { color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main, textAlign: "center", padding: "15px" },
}));

export default function ExamQuiz({ lesson }) {

  const { question, onAnswerSubmitHandler, currentQuestionIndex, loadExamData, results } = useExam(lesson)
  const { exam } = useContext(ExamContext)

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
      <Typography variant={"h2"}>Your result: {results?.score} %</Typography>
      {
        lesson.examParameters.minimalScore < results?.score ?
          <Typography variant={"h3"} color={"primary"}>You passed the exam</Typography> :
          <Typography variant={"h3"} color={"primary"}>You failed the exam</Typography>
      }
      <Button>Go to profile</Button>
    </>
  )

  const resultPage = (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <div className={classes.info}>Results</div>
      <Paper style={{ padding: "20px", minHeight: '500px', textAlign: "center" }}>
        {results?.score !== undefined  && resultPageContent }
      </Paper>
    </Container>
  )

  const confirmStartPage = (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <div className={classes.info}>Are you ready?</div>
      <Paper style={{ padding: "20px", minHeight: '500px', textAlign: "center" }}>

        {lesson?.examParameters && <>
          <Box>Minimal score {lesson.examParameters.minimalScore}</Box>
          <Box>Count of questions {lesson.examParameters.questionsInExam}</Box>
          <Box>Time limit {lesson.examParameters.timeLimit}</Box>
        </>
        }
        <Typography variant={"h2"} component={"button"} onClick={loadExamData}>Start exam</Typography>
      </Paper>
    </Container>
  )

  return (<>
    {!question && !results && confirmStartPage}
    {exam && question && !results && questionPage}
    {results && resultPage}
  </>)
}

