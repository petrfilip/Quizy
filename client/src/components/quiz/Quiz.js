import QuizItem from "./QuizItem";
import { useEffect, useState } from "react";
import QuizScore from "./QuizScore";
import { Timer } from "../Timer";
import QuizProgress from "./QuizProgress";
import Paging from "../Paging";
import { Container, Paper } from "@material-ui/core";

export default function Quiz({ quizData }) {

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
        <QuizScore score={getScore()} total={answers.length}/>
        <QuizScore score={getScore()} total={quizItems.length}/>
      </Container><Container maxWidth="md" style={{ textAlign: "center", margin: "10px" }}>
      <Paper>
        <Paging paging={paging}/>
        {/*<Button>Odeslat hotový formulář</Button>*/}
      </Paper>
    </Container>
    </Container>
  )
}

