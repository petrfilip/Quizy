import FlashCardItem from "./FlashCardItem";
import Paging from "../Paging";
import { useState } from "react";
import { Container, Paper } from "@material-ui/core";
import QuizItem from "../quiz/QuizItem";
import { Timer } from "../Timer";
import QuizProgress from "../quiz/QuizProgress";
import QuizScore from "../quiz/QuizScore";

export default function FlashCards({ flashcards }) {

  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

  const paging = {
    currentIndex: currentFlashcardIndex,
    total: flashcards.length,
    onChange: (index) => {
      setCurrentFlashcardIndex(index)
    }
  }

  return (
    <Container maxWidth="md" style={{ minHeight: '500px' }}>

      <Container maxWidth="md" style={{ minHeight: '500px', margin: "10px" }}>
          {flashcards[currentFlashcardIndex] && <FlashCardItem index={currentFlashcardIndex} flashcard={flashcards[currentFlashcardIndex]}/>}
      </Container>

      <Container maxWidth="md" style={{ textAlign: "center", margin: "10px" }}>
        <Paper>
          <Paging paging={paging}/>
        </Paper>
      </Container>
    </Container>
  )

}