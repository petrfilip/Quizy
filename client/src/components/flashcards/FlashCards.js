import FlashCardItem from "./FlashCardItem";
import Paging from "../Paging";
import { useState } from "react";
import { Container, Paper } from "@material-ui/core";

export default function FlashCards({ flashcards }) {

  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

  const paging = {
    currentIndex: currentFlashcardIndex,
    total: flashcards.length,
    onChange: (index) => {
      setCurrentFlashcardIndex(index)
    }
  }

  return (<>
      <Container maxWidth="md" style={{ marginTop: "20px" }}>
        {flashcards[currentFlashcardIndex] && <FlashCardItem index={currentFlashcardIndex} flashcard={flashcards[currentFlashcardIndex]}/>}
      </Container>

      <Container maxWidth="md" style={{ marginTop: "20px", textAlign: "center" }}>
        <Paper>
          <Paging paging={paging}/>
        </Paper>
      </Container>
    </>
  )

}