import React from 'react';
import FlashCardItemEditor from "./FlashCardItemEditor";
import { Button, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const FlashCardManager = ({data, onChangeCallback}) => {

  const addNewFlashcard = () => {

    const flashcards = data.flashcards && [...data.flashcards] || []
    flashcards.push({
      title: "",
      description: ""
    })

    onChangeCallback({...data, flashcards})
  }

  return (
    <>
      <Typography variant="h5">Flash Cards</Typography>
      {data?.flashcards?.map((item, index) =>

        <div key={`fc-${index}`}>
          <FlashCardItemEditor flashcard={item}/>
          <hr/>
        </div>
      )}
      <Button startIcon={<AddIcon/>}
              variant={"outlined"}
              onClick={addNewFlashcard}>Add flashcard</Button>

    </>
  );
};

export default FlashCardManager;