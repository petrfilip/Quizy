import React, { useState, useEffect, useLayoutEffect } from "react";
import FlashCardItemEditor from "./flashcard/FlashCardItemEditor";
import urlSlug from 'url-slug'
import MDEditor from "@uiw/react-md-editor";
import { Button, TextField, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import UploadImageArea from "./file-manager/FileButton";
import Grid from "@material-ui/core/Grid";

export default function QuizItemMain({ data }) {

  const [componentData, setComponentData] = useState(data)

  useLayoutEffect(() => {
    setComponentData(data)
  }, [data]) //todo data.sys.revision

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    data[name] = value
    setComponentData({ ...data })
  }

  const addNewFlashcard = () => {

    if (!data.flashcards) {
      data.flashcards = [];
    }

    data.flashcards.push({
      title: "",
      description: ""
    })

    const newData = { ...data };
    setComponentData(newData)
  }

  return <div>
    <Typography variant="h5">Lesson info</Typography>
    <TextField fullWidth type={"text"} name={"title"} value={componentData.title || ""} onChange={handleInputChange}/>
    <TextField fullWidth disabled={true} type={"text"} name={"slug"} value={urlSlug(componentData.title || "")} onChange={handleInputChange}/>

    <MDEditor
      value={componentData.description || ""}
      onChange={(src) => {
        console.log(src)
        handleInputChange({
            target: {
              value: src,
              name: "description"
            }
          }
        )
      }
      }
    />



    <Grid container spacing={3}>
      <Grid item xs={6}>
          <Typography variant="h5">Hero image</Typography>
          <UploadImageArea location={`/`}/>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">Hero image</Typography>

      </Grid>
    </Grid>

    <h2>Flash Cards</h2>
    {data?.flashcards?.map((item, index) =>

      <div key={`fc-${index}`}>
        <FlashCardItemEditor flashcard={item}/>
        <hr/>
      </div>
    )}
    <Button             startIcon={<AddIcon/>}
                        variant={"outlined"} onClick={addNewFlashcard}>Add flashcard</Button>

  </div>
}