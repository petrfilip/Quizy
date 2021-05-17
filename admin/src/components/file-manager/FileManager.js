import React, { useCallback, useLayoutEffect, useState } from 'react';
import List from "../../app/List";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Paper } from "@material-ui/core";
import { useAuth } from "../../app/AuthContext";
import { useSnackbar } from "notistack";
import FileCard from "./FileCard";
import DirectoryCreate from "./DirectoryCreate";
import DirectoryCard from "./DirectoryCard";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import Button from "@material-ui/core/Button";

const gridItemSizes = {
  xs: 6,
  sm: 6,
  md: 4,
  lg: 6,
  xl: 2
}

export default function FileManager({ location = "/", onFileClick, showUploadForm = true, gridSizes = gridItemSizes }) {
  // const history = useHistory();

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
  const [currentLocation, setCurrentLocation] = useState(location);
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
        body: JSON.stringify({ location: currentLocation, directory: newDirectoryName }) // body data type must match "Content-Type" header
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {
        mediaList.directories.push(json)
        setMediaList({ ...mediaList })
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
    setIsPending(true)
    fetch(`${process.env.REACT_APP_BASE_URI}/media/list${currentLocation}`, {
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

  }, [timestamp, currentLocation, location])

  const doUpload = (filesToUpload) => {
    if (filesToUpload) {
      const formData = new FormData()
      formData.append('location', currentLocation)

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

  const onDirectoryClick = (directory) => {
    setCurrentLocation((directory.path.endsWith("/") ? directory.path : directory.path + "/" || "/") + directory.slugName)
  }

  const mediaData = mediaList.files !== undefined ? [...mediaList.directories, ...mediaList.files] : [];

  const onDrop = useCallback(acceptedFiles => {
    doUpload(acceptedFiles)
  }, [currentLocation, location])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const locationItems = () => currentLocation.substr(1)
    .split("/")
    .filter(i => i !== "");

  const getAllPreviousLocationItems = (index) => {
    return locationItems().splice(0, index).join("/")
  }

  const navigator = <div>
    <KeyboardArrowRightIcon/><Button onClick={() => setCurrentLocation("/")}>Root</Button>
    {locationItems()
      .map((item, index) => <span key={`fm-item-${item}`}>
        <KeyboardArrowRightIcon/>
        <Button onClick={() => {
          setCurrentLocation("/" + getAllPreviousLocationItems(index + 1))
        }
        }>{item}</Button>
      </span>)}
  </div>

  return (
    <>
      <DirectoryCreate onSubmit={doCreateDirectory}/>
      {navigator}
      {showUploadForm && <Paper variant={"outlined"} {...getRootProps()} style={{ textAlign: "center" }} className={isDragActive && classes.isDragActive}>
        <CloudUploadIcon/>
        {isDragActive ? <Typography>drop</Typography> : <Typography>Drop File here</Typography>}
      </Paper>}

      <List
        isPending={isPending}
        gridSizes={gridSizes}
        data={mediaData}
        component={item => item.type === "directory" ?
          <DirectoryCard directory={item} onDirectoryClick={onDirectoryClick}/> :
          <FileCard file={item} onFileClick={onFileClick}/>}/>

    </>
  );
}



