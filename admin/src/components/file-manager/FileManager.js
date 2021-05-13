import React, { useCallback, useLayoutEffect, useState } from 'react';
import List from "../../app/List";
import Typography from "@material-ui/core/Typography";
import { Container, createStyles, makeStyles } from "@material-ui/core";
import { useAuth } from "../../app/AuthContext";
import { useSnackbar } from "notistack";
import FileCard from "./FileCard";
import DirectoryCreate from "./DirectoryCreate";
import DirectoryCard from "./DirectoryCard";
import { useDropzone } from "react-dropzone";

export default function FileManager(props) {

  const useStyles = makeStyles(theme => createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210
    },
    isDragActive: {
      backgroundColor: theme.palette.secondary.main,
      transition: "1s"
    }
  }));
  const classes = useStyles();
  const { token } = useAuth();
  const [isError, setIsError] = useState(false);
  const [mediaList, setMediaList] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [isPending, setIsPending] = useState(false)
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
        body: JSON.stringify({ location: mediaList.location, directory: newDirectoryName }) // body data type must match "Content-Type" header
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {
        mediaList.directories.push(json)
        setMediaList({...mediaList})
        setIsError(false)
        enqueueSnackbar(`Directory "${newDirectoryName}" create`, { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar(`Directory "${newDirectoryName}" creation failed. ${err}`, { variant: "error" });
        setIsError(err.message)
      })
      .finally(() => {
        setIsPending(false)

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

  const doUpload = (filesToUpload) => {
    if (filesToUpload) {
      const formData = new FormData()
      formData.append('location', "/")

      for (const file of filesToUpload) {
        formData.append('files[]', file, file.name)
      }

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
          enqueueSnackbar(`${filesToUpload.length} files has been uploaded`, { variant: "success" });
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

  const mediaData = mediaList.files !== undefined ? [...mediaList.directories, ...mediaList.files] : [];

  const onDrop = useCallback(acceptedFiles => {
    doUpload(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Container>
      <Typography variant="h4">File manager</Typography>
      <Typography>Current location: {mediaList.location}</Typography>
      <DirectoryCreate onSubmit={doCreateDirectory}/>

      <div {...getRootProps()} className={isDragActive && classes.isDragActive}>
        {/*{isDragActive ? <Typography>drop</Typography> : <Typography>Drop image here</Typography>}*/}

        <List
          data={mediaData}
          component={item => item.type === "directory" ?
            <DirectoryCard directory={item}/> :
            <FileCard file={item}/>}/>
      </div>
    </Container>
  );
}


