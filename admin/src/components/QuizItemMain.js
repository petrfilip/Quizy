import React from "react";
import urlSlug from 'url-slug'
import MDEditor from "@uiw/react-md-editor";
import { TextField, Typography } from "@material-ui/core";
import UploadImageArea from "./file-manager/UploadImageArea";
import Grid from "@material-ui/core/Grid";

export default function QuizItemMain({ data, onChangeCallback }) {


  const handleInputChange = (event) => {
    debugger
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    onChangeCallback({ ...data, [name]: value });
  }

  const onSaveCallbackHandler = (file) => {
    onChangeCallback({...data, "heroImage": {
        mediaId: file._id,
        path: file.publicPath
      }})
  }


  return <div>
    <Typography variant="h5">Lesson info</Typography>
    <TextField fullWidth type={"text"} name={"title"} value={data.title || ""} onChange={handleInputChange}/>
    <TextField fullWidth disabled={true} type={"text"} name={"slug"} value={urlSlug(data.title || "")} onChange={handleInputChange}/>

    <MDEditor
      value={data.description || ""}
      onChange={(src) => {
        debugger
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
        <UploadImageArea location={`/`} initialFile={data?.heroImage?.path} onSaveCallback={onSaveCallbackHandler}/>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">Another info</Typography>
      </Grid>
    </Grid>

  </div>
}