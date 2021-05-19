import React from "react";
import urlSlug from 'url-slug'
import MDEditor from "@uiw/react-md-editor";
import { FormControlLabel, Paper, Switch, TextField, Typography } from "@material-ui/core";
import UploadImageArea from "./file-manager/UploadImageArea";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

export default function QuizItemMain({ data, onChangeCallback }) {

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    onChangeCallback({ ...data, [name]: value });
  }

  const onSaveCallbackHandler = (file) => {
    onChangeCallback({
      ...data, "heroImage": {
        mediaId: file._id,
        path: file.publicPath
      }
    })
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
        <Box paddingBottom={2} paddingTop={2}>
          <Typography variant="h5">Hero image</Typography>
        </Box>
        <UploadImageArea location={`/`} initialFile={data?.heroImage?.path} onSaveCallback={onSaveCallbackHandler}/>
      </Grid>
      <Grid item xs={6}>
        <Box paddingBottom={2} paddingTop={2}>
          <Typography variant="h5">Exam parameters</Typography>
        </Box>
        <Grid container direction={'column'} spacing={3}>
          <Grid item>
            <TextField
              helperText={"Minimal score for success"}
              variant={"outlined"}
              label="Minimal score"
              type="number"
              defaultValue={66}
              fullWidth={true}
              InputProps={{
                inputProps: {
                  max: 100, min: 0
                }
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              helperText={"How many questions will be generated in the exam"}
              variant={"outlined"}
              label="Questions in exams"
              type="number"
              defaultValue={data?.questions?.length || 0}
              fullWidth={true}
              InputProps={{
                inputProps: {
                  max: data?.questions?.length || 0, min: 0
                }
              }}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={"checked"}
                  name="checkedB"
                  color="primary"
                />
              }

              label="Repeatable"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>

  </div>
}