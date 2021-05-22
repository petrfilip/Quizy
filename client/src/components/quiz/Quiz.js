import QuizItem from "./QuizItem";
import { useEffect, useState } from "react";
import QuizScore from "./QuizScore";
import { Timer } from "../Timer";
import QuizProgress from "./QuizProgress";
import Paging from "../Paging";
import { Container, Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";

export default function Quiz({ quizData, onLastItem }) {

  useEffect(() => {
    const quiz = quizData.map((item, index) => {
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
      isCorrect: isCorrect,
      questionIndex: currentQuestionIndex,
      answer: answer
    }

    const newAnswer = [...answers];
    newAnswer.push(answerQuestion)
    setAnswers(newAnswer);
  }

  const paging = {
    currentIndex: currentQuestionIndex,
    total: quizItems.length,
    onChange: (index) => {
      setCurrentQuestionIndex(index)
    }
  }

  const getAnswerByQuestionIndex = (qIdx) => {
    return answers.find(item => item.questionIndex === qIdx)?.answer
  }

  const getScore = () => {
    return answers.filter(item => item.isCorrect).length
  }

  return (
    <>

      <Container maxWidth="md" style={{ marginTop: "20px" }}>
        <Paper style={{ minHeight: '500px' }}>
          {quizItems[currentQuestionIndex] && <QuizItem
            key={`quizItem-${currentQuestionIndex}`}
            question={quizItems[currentQuestionIndex]}
            answer={getAnswerByQuestionIndex(quizItems[currentQuestionIndex].index)}
            onAnswerSubmit={onAnswerSubmitHandler}
          />}

        </Paper>
      </Container>


      <Container maxWidth="md" style={{
        marginTop: "20px", alignItems: "center",
        flexDirection: "row", display: "flex", justifyContent: "space-between",
      }}>
        {/*<Timer/>*/}
        <QuizProgress current={answers.length} total={quizItems.length}/>
        <QuizScore score={getScore()} total={answers.length}/>
        <QuizScore score={getScore()} total={quizItems.length}/>
      </Container>
      <Container maxWidth="md" style={{ marginTop: "20px", textAlign: "center" }}>
        <Paper>
          <Paging paging={paging} onLast={onLastItem}/>
          {/*<Button color={"primary"} fullWidth={true}>Odeslat hotový formulář</Button>*/}
        </Paper>
      </Container>
    </>
  )
}

