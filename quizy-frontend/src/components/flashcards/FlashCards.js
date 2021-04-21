import FlashCardItem from "./FlashCardItem";
import Paging from "../Paging";
import { useState } from "react";

export default function FlashCards({ flashcards }) {

  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

  const paging = {
    currentIndex: currentFlashcardIndex,
    total: flashcards.length,
    onChange: (index) => {
      setCurrentFlashcardIndex(index)
    }
  }

  return <>
    <FlashCardItem flashcard={flashcards[currentFlashcardIndex]}/>
    <Paging paging={paging}/>
  </>
}