import React from 'react';
import FlashCardItemEditor from "./FlashCardItemEditor";
import { Button, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from "react-i18next";

const FlashCardManager = ({data, onChangeCallback}) => {
  const { t } = useTranslation();


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
      <Typography variant="h5">{t('title_flashcards')}</Typography>
      {data?.flashcards?.map((item, index) =>

        <div key={`fc-${index}`}>
          <FlashCardItemEditor flashcard={item}/>
          <hr/>
        </div>
      )}
      <Button startIcon={<AddIcon/>}
              variant={"outlined"}
              onClick={addNewFlashcard}>{t('button_addFlashcard')}</Button>

    </>
  );
};

export default FlashCardManager;