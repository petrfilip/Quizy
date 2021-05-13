import React, { useState } from 'react';
import { DropzoneArea, DropzoneDialog } from "material-ui-dropzone";
import List from "../../app/List";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Button, createStyles, makeStyles } from "@material-ui/core";
import { useAuth } from "../../app/AuthContext";
import { useSnackbar } from "notistack";

export default function FileManager(props) {

  const useStyles = makeStyles(theme => createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210
    },
  }));
  const classes = useStyles();
  const { token } = useAuth();
  const [isError, setIsError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isPending, setIsPending] = useState(false)

  const [files, setFiles] = useState([])

  const doUpload = ()=> {
    if (files) {
      const formData = new FormData()
      formData.append('location', "/")

      for (const file of files) {
        formData.append('files[]', file, file.name)
      }


      // DataManager.saveOrUpdate(api.fetchMediaFile(), 'data', data, callback)

      fetch(`${process.env.REACT_APP_BASE_URI}/media/file`,
        {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Authorization': 'Bearer ' + token,
          },
          body: formData // body data type must match "Content-Type" header
        })
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error(`Unable to get data: ${response.statusText}`)
        })
        .then(json => {
          setIsError(false)
          enqueueSnackbar(`Files uploaded`, { variant: "success" });
        })
        .catch((err) => {
          enqueueSnackbar(`Files cannot be uploaded. ${err}`, { variant: "error" });
          setIsError(err.message)
        })
        .finally(() => setIsPending(false))

    }
  }

  return (
    <>
      <Typography variant="h4">File manager</Typography>
      <DropzoneArea
        onChange={(item) => setFiles(item)}
        showPreviews={true}
        showPreviewsInDropzone={false}
        useChipsForPreview
        previewGridProps={{container: { spacing: 1, direction: 'row' }}}
        previewChipProps={{classes: { root: classes.previewChip } }}
        previewText="Selected files"
        maxFileSize={5000000}
      />
      <Button onClick={doUpload} color={"primary"} variant={"contained"}>Upload </Button>

      <List data={[]} component={item => item.type === "directory" ? <DirectoryCard directory={item}/> : <FileCard file={item}/>}/>
    </>
  );
}

function DirectoryCard({ directory }) {

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {directory.slugName}
        </Typography>
      </CardContent>
    </Card>
  );
}

function FileCard({ file }) {

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {file.originName}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography>
              {file.attributes.type}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {formatBytes(file.attributes.size, 2)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}