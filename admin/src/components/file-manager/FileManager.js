import React, { useLayoutEffect, useReducer, useState } from 'react';
import { DropzoneArea } from "material-ui-dropzone";
import List from "../../app/List";
import Typography from "@material-ui/core/Typography";
import { Button, createStyles, makeStyles } from "@material-ui/core";
import { useAuth } from "../../app/AuthContext";
import { useSnackbar } from "notistack";
import FileCard from "./FileCard";
import DirectoryCreate from "./DirectoryCreate";
import DirectoryCard from "./DirectoryCard";

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
  const [mediaList, setMediaList] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [isPending, setIsPending] = useState(false)
  const [filesToUpload, setFilesToUpload] = useState([])
  const [timestamp, setTimestamp] = useState(new Date());


  const doCreateDirectory = (newDirectoryName) => {
    setIsPending(true)
    fetch(`${process.env.REACT_APP_BASE_URI}/media/directory`,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({location: mediaList.location, directory: newDirectoryName}) // body data type must match "Content-Type" header
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
      .finally(() => {
        setIsPending(false)
        setTimestamp(new Date())

      })
  }

  useLayoutEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI}/media/list`, {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => setMediaList(json))
      .catch((err) => setIsError(err.message))
      .finally(() => setIsPending(false))

  }, [timestamp])

  const doUpload = () => {
    if (filesToUpload) {
      const formData = new FormData()
      formData.append('location', "/")

      for (const file of filesToUpload) {
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
          setFilesToUpload([])
        })
        .catch((err) => {
          enqueueSnackbar(`Files cannot be uploaded. ${err}`, { variant: "error" });
          setIsError(err.message)
        })
        .finally(() => {
          setTimestamp(new Date())
          setIsPending(false)
        })

    }
  }

  const mediaData = mediaList.files !== undefined ? [...mediaList.directories,...mediaList.files] : [];

  return (
    <>
      <Typography variant="h4">File manager</Typography>
      <DropzoneArea
        initialFiles={filesToUpload}
        onChange={(item) => setFilesToUpload(item)}
        showPreviews={true}
        showPreviewsInDropzone={false}
        useChipsForPreview
        previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
        previewChipProps={{ classes: { root: classes.previewChip } }}
        previewText="Selected files"
        maxFileSize={5000000}
      />
      <Button onClick={doUpload} color={"primary"} variant={"contained"} disabled={filesToUpload.length === 0}>Upload </Button>


      <Typography>Current location: {mediaList.location}</Typography>
      <DirectoryCreate onSubmit={doCreateDirectory}/>

      <List data={mediaData}
            component={item => item.type === "directory" ?
              <DirectoryCard directory={item}/> :
              <FileCard file={item}/>}/>
    </>
  );
}


