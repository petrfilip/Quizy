import React from "react";
import urlSlug from 'url-slug'
import MDEditor from "@uiw/react-md-editor";
import { FormControlLabel, FormHelperText, Switch, TextField, Typography } from "@material-ui/core";
import UploadImageArea from "./file-manager/UploadImageArea";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import * as immutable from 'object-path-immutable'

export default function QuizItemMain({ data, onChangeCallback }) {

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    onChangeCallback(immutable.set(data, name, value));
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
              onChange={handleInputChange}
              name={"examParameters.minimalScore"}
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
              name={"examParameters.questionsInExam"}
              onChange={handleInputChange}
              helperText={"How many questions will be generated in the exam"}
              variant={"outlined"}
              label="Questions in exams"
              type="number"
              defaultValue={data?.questions?.length || 1}
              fullWidth={true}
              InputProps={{
                inputProps: {
                  max: data?.questions?.length || 1, min: 1
                }
              }}
            />
          </Grid>
          <Grid item>

            <FormControlLabel
              control={
                <Switch
                  onChange={handleInputChange}
                  checked={"checked"}
                  name="examParameters.minimalScore"
                  color="primary"
                />
              }

              label={<Typography>Repeatable</Typography>}
            />
            <FormHelperText>Can be done multiple times</FormHelperText>

          </Grid>
        </Grid>
      </Grid>
    </Grid>

    <pre style={{fontSize: "8px"}}>
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
}