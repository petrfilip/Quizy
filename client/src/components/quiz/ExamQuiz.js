import QuizItem from "./QuizItem";
import { useEffect, useState } from "react";
import QuizScore from "./QuizScore";
import { Timer } from "../Timer";
import QuizProgress from "./QuizProgress";
import Paging from "../Paging";
import { Container, Paper, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useAuth } from "../layout/AuthContext";
import { useSnackbar } from "notistack";
import useUser from "../layout/UserHook";

export default function ExamQuiz({ lesson }) {

  const [examResult, setExamResult] = useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([])
  const [quizItems, setQuizItems] = useState([])
  const [metadata, setMetadata] = useState({})
  const { enqueueSnackbar } = useSnackbar()
  const { token } = useAuth();
  const {refreshUser} = useUser();

  const onAnswerSubmitHandler = (question, answer, isCorrect) => {
    const answerQuestion = {
      questionIndex: currentQuestionIndex,
      answer: answer
    }

    const newAnswer = [...answers];
    newAnswer.push(answerQuestion)
    setAnswers(newAnswer);
    setCurrentQuestionIndex(currentQuestionIndex + 1)
    if (quizItems.length === currentQuestionIndex + 1) {
      submitResults(newAnswer)
    }
  }

  const submitResults = (newAnswer) => {
    console.log(newAnswer)

    fetch(`${process.env.REACT_APP_BASE_URI}/lessons/${lesson.slug}/exam`, {
      method: 'post', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({metadata, answers: newAnswer})
    }).then(r => r.json())
      .then(json => {
        setMetadata(json)
        refreshUser()
      })
      .catch(() => {
        enqueueSnackbar('Error when getting data', { variant: "error" });
      })
      .finally(() => {
      });

  }

  const getAnswerByQuestionIndex = (qIdx) => {
    return answers.find(item => item.questionIndex === qIdx)?.answer
  }

  const questionPage = (
    <Container maxWidth="md" style={{ minHeight: '500px' }}>

      <Container maxWidth="md" style={{ minHeight: '500px', margin: "10px" }}>
        <Paper>
          {quizItems[currentQuestionIndex] && <QuizItem
            key={`quizItem-${currentQuestionIndex}`}
            question={quizItems[currentQuestionIndex]}
            answer={getAnswerByQuestionIndex(quizItems[currentQuestionIndex].index)}
            onAnswerSubmit={onAnswerSubmitHandler}
          />}

        </Paper>
      </Container>


      <Container maxWidth="md" style={{
        margin: "10px", alignItems: "center",
        flexDirection: "row", display: "flex", justifyContent: "space-between",
      }}>
        <Timer/>
        <QuizProgress current={answers.length} total={quizItems.length}/>
      </Container>
    </Container>
  )

  const resultPage = (
    <Container maxWidth="md" style={{ minHeight: '500px' }}>
      <Container maxWidth="md" style={{ minHeight: '500px', margin: "10px" }}>
        <Paper>
          <Typography variant={"h2"}>Your results: {examResult} {metadata.score}</Typography>
          <Button>Go to profile</Button>
        </Paper>
      </Container>
    </Container>
  )

  const getExamData = () => {
    fetch(`${process.env.REACT_APP_BASE_URI}/lessons/${lesson.slug}/exam`, {
      method: 'get', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Authorization': 'Bearer ' + token
      },
    }).then(r => r.json())
      .then(json => {
        setQuizItems(json.questions)
        setMetadata(json.metadata)
      })
      .catch(() => {
        enqueueSnackbar('Error when getting data', { variant: "error" });
      })
      .finally(() => {
      });
  }

  const confirmStartPage = (
    <Container maxWidth="md" style={{ minHeight: '500px' }}>
      <Container maxWidth="md" style={{ minHeight: '500px', margin: "10px" }}>
        <Paper>
          <Typography variant={"h2"} component={"button"} onClick={getExamData}>Start you exam</Typography>
        </Paper>
      </Container>
    </Container>
  )

  return quizItems.length === 0 ? confirmStartPage : (quizItems.length === currentQuestionIndex ? resultPage : questionPage)
}

