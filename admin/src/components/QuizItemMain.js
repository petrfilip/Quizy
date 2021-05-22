import React from "react";
import urlSlug from 'url-slug'
import MDEditor from "@uiw/react-md-editor";
import { FormControlLabel, FormHelperText, Switch, TextField, Typography } from "@material-ui/core";
import UploadImageArea from "./file-manager/UploadImageArea";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { useTranslation } from "react-i18next";

export default function QuizItemMain({ data, onChangeCallback }) {
  const { t } = useTranslation();

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    onChangeCallback(name, value);
  }

  const onSaveCallbackHandler = (file) => {
    onChangeCallback("heroImage", {
      mediaId: file._id,
      path: file.publicPath
    })
  }

  return <div>
    {/*<Typography variant="h5">{t('qim_titleLessonInfo')}</Typography>*/}
    <FormHelperText>{t('qim_formTitle')}</FormHelperText>

    <TextField fullWidth type={"text"} name={"title"} value={data.title || ""} onChange={handleInputChange}/>
    <TextField fullWidth disabled={true} type={"text"} name={"slug"} value={urlSlug(data.title || "")} onChange={handleInputChange}/>

    <FormHelperText>{t('qim_formDescription')}</FormHelperText>

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
          <Typography variant="h5">{t('qim_formHeroImage')}</Typography>
        </Box>
        <UploadImageArea location={`/`} initialFile={data?.heroImage?.path} onSaveCallback={onSaveCallbackHandler}/>
      </Grid>
      <Grid item xs={6}>
        <Box paddingBottom={2} paddingTop={2}>
          <Typography variant="h5">{t('qim_formTitleExamParameters')}</Typography>
        </Box>
        <Grid container direction={'column'} spacing={3}>
          <Grid item>
            <TextField
              onChange={handleInputChange}
              name={"examParameters.minimalScore"}
              helperText={t('qim_formMinimalScoreDescription')}
              variant={"outlined"}
              label={t('qim_formMinimalScoreTitle')}
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
              helperText={t('qim_formQuestionsInExamDescription')}
              variant={"outlined"}
              label={t('qim_formQuestionsInExamTitle')}
              type="number"
              value={data?.examParameters?.questionsInExam || 20}
              fullWidth={true}
              InputProps={{
                inputProps: {
                  max: data?.questions?.length || 1, min: 1
                }
              }}
            />
          </Grid>
          {/*<Grid item>*/}
          {/*  <TextField*/}
          {/*    name={"examParameters.timeLimit"}*/}
          {/*    onChange={handleInputChange}*/}
          {/*    helperText={"Time limit for exam"}*/}
          {/*    variant={"outlined"}*/}
          {/*    label="Time limit (in minutes)"*/}
          {/*    type="number"*/}
          {/*    defaultValue={data?.questions?.length || 1}*/}
          {/*    fullWidth={true}*/}
          {/*    InputProps={{*/}
          {/*      inputProps: {*/}
          {/*        max: data?.questions?.length || 1, min: 1*/}
          {/*      }*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</Grid>*/}
          <Grid item>

            <FormControlLabel
              control={
                <Switch
                  onChange={handleInputChange}
                  checked={data?.examParameters?.repeatable != null ? data.examParameters.repeatable : true  }
                  name="examParameters.repeatable"
                  color="primary"
                />
              }
              label={<Typography color={"textSecondary"}>{t('qim_formRepeatableTitle')}</Typography>}
            />
            <FormHelperText>{t('qim_formRepeatableDescription')}</FormHelperText>

          </Grid>
          {/*<Grid item>*/}
          {/*  <TextField*/}
          {/*    onChange={handleInputChange}*/}
          {/*    helperText={"When the exam will be available"}*/}
          {/*    name="examParameters.availableFrom"*/}
          {/*    id="datetime-local"*/}
          {/*    label={"Available from"}*/}
          {/*    type="datetime-local"*/}
          {/*    value={data?.examParameters?.availableFrom || null}*/}
          {/*    InputProps={{*/}
          {/*      endAdornment: (*/}
          {/*        <IconButton size={"small"}>*/}
          {/*          <ClearIcon/>*/}
          {/*        </IconButton>*/}
          {/*      )*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</Grid>*/}
          {/*<Grid item>*/}
          {/*  <TextField*/}
          {/*    onChange={handleInputChange}*/}
          {/*    helperText={"When the exam will be hidden"}*/}
          {/*    name="examParameters.availableTo"*/}
          {/*    id="datetime-local"*/}
          {/*    label="Available to"*/}
          {/*    type="datetime-local"*/}
          {/*    defaultValue={null}*/}
          {/*    value={data?.examParameters?.availableTo || null}*/}
          {/*    InputLabelProps={{*/}
          {/*      shrink: true,*/}
          {/*    }}*/}
          {/*    InputProps={{*/}
          {/*      endAdornment: (*/}
          {/*        <IconButton size={"small"} onClick={() => setValue("examParameters.availableTo", null)}>*/}
          {/*          <ClearIcon/>*/}
          {/*        </IconButton>*/}
          {/*      )*/}
          {/*    }}*/}
          {/*  />*/}

          {/*</Grid>*/}
        </Grid>
      </Grid>
    </Grid>

    {/*<pre style={{ fontSize: "10px" }}>*/}
    {/*  {JSON.stringify(data, null, 2)}*/}
    {/*</pre>*/}
  </div>
}