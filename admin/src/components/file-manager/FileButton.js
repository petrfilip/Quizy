import React, { useCallback, useState } from 'react';
import Button from "@material-ui/core/Button";
import { DropzoneDialog } from "material-ui-dropzone";
import { useAuth } from "../../app/AuthContext";
import { useSnackbar } from "notistack";
import { Backdrop, CardMedia, CircularProgress, createStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles, Paper, TextField } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import Avatar from "@material-ui/core/Avatar";
import Image from 'material-ui-image'
import Typography from "@material-ui/core/Typography";

const UploadImageArea = ({ initialFile, location }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(initialFile);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { token } = useAuth();
  const [isError, setIsError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isPending, setIsPending] = useState(false)

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
    // Do something with the files
    doUpload(acceptedFiles[0])
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
      <Paper {...getRootProps()} variant={"outlined"} className={isDragActive && classes.paperOverlay || classes.paper}>
        {file && <img
          className={isDragActive && classes.imageOverlay || classes.image}
          src={file}
        />}
        <div/>
        {isDragActive ? <Typography>drop</Typography> : <Typography>Drop image here</Typography>}
      </Paper>
  );
};

export default UploadImageArea;