import QuizItem from "./QuizItem";
import { useEffect, useState } from "react";
import QuizScore from "./QuizScore";
import { Timer } from "../Timer";
import QuizProgress from "./QuizProgress";
import Paging from "../Paging";
import { Container, Paper, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";

export default function ExamQuiz({ quizData }) {

  const [examResult, setExamResult] = useState();

  useEffect(() => {
    const quiz = quizData.map((item, index) => {
      item.correct = undefined
      item.index = index;
      return item;
    })

    setQuizItems([...quiz])
  }, [])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([])
  const [quizItems, setQuizItems] = useState([])

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
          <Typography variant={"h2"}>Your results: {examResult}</Typography>
          <Button>Go to profile</Button>
        </Paper>
      </Container>
    </Container>
  )

  return quizItems.length === currentQuestionIndex ? resultPage : questionPage
}

