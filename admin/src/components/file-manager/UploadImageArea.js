import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from "../../app/AuthContext";
import { useSnackbar } from "notistack";
import { createStyles, makeStyles, Paper } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import Typography from "@material-ui/core/Typography";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const UploadImageArea = ({ initialFile, location, onSaveCallback, onDropFiles }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState();

  const useStyles = makeStyles(theme => createStyles({
    image: {
      display: "block",
      width: "100%"
    },
    imageOverlay: {
      display: "block",
      width: "100%",
      opacity: "0.3"
    },
    paper: {
      textAlign: "center",
      minHeight: 100
    },
    paperOverlay: {
      textAlign: "center",
      minHeight: 100,
      backgroundColor: theme.palette.secondary.main
    },
    overlay: {
      position: "",
      top: 0,
      left: 0,
      zIndex: 10,
      minHeight: 100,
      backgroundColor: theme.palette.secondary.main

    },
  }));

  const classes = useStyles();
  const { token } = useAuth();
  const [isError, setIsError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isPending, setIsPending] = useState(false)

  useEffect(()=> {
    initialFile && setFile(`${process.env.REACT_APP_BASE_URI}${initialFile}`);
  }, [initialFile])

  const doUpload = (fileToUpload) => {
    if (fileToUpload) {
      const formData = new FormData()
      formData.append('location', location)

      formData.append('files[]', fileToUpload, fileToUpload.name)

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
          onSaveCallback && onSaveCallback(json[0])
          setFile(`${process.env.REACT_APP_BASE_URI}${json[0].publicPath}`)
          setIsError(false)
          enqueueSnackbar(`Files uploaded`, { variant: "success" });
        })
        .catch((err) => {
          enqueueSnackbar(`Files cannot be uploaded. ${err}`, { variant: "error" });
          setIsError(err.message)
        })
        .finally(() => {
          setIsPending(false)
        })

    }
  }

  const onDrop = useCallback(acceptedFiles => {
    onDropFiles(acceptedFiles)
    // Do something with the files
    doUpload(acceptedFiles[0])
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
      <Paper {...getRootProps()}  variant={"outlined"} className={isDragActive && classes.paperOverlay || classes.paper}>

        <input {...getInputProps()} />
        {file && <img
          className={isDragActive && classes.imageOverlay || classes.image}
          src={file}
        />}
        <div/>
        <CloudUploadIcon />
        {isDragActive ? <Typography>drop</Typography> : <Typography>Drop image here</Typography>}
      </Paper>
  );
};

export default UploadImageArea;