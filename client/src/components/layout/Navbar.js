import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link as RouterLink } from "react-router-dom";
import useExam from "./ExamHook";
import CloseIcon from '@material-ui/icons/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import { ExamContext } from "./ExamContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar({ items }) {
  const classes = useStyles();
  const { exam } = useContext(ExamContext)
  let {cancelExam} = useExam();


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancelExam = () => {
    setOpen(false);
    cancelExam()
  }

  const navbar = (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>

          <Typography variant="h6" className={classes.title}>
            Quizy app
          </Typography>
          {items.map((item, i) => {
            return <Button key={`navbar-item-${i}`} startIcon={item.icon} color="inherit" component={RouterLink} to={item.to}>{item.title}</Button>
          })}

        </Toolbar>
      </AppBar>
    </div>
  );

  const navbarRunningTest = (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>

          <Typography variant="h6" className={classes.title}>
            Quizy app
          </Typography>
          <Button startIcon={<CloseIcon/>} color="inherit" onClick={handleClickOpen}></Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Cancel exam?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                If you cancel the exam then you will lose all your gathered answers and the exam will be submitted with 0 points.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant={"outlined"} onClick={handleCancelExam} color="secondary">
                Cancel exam and lose all points
              </Button>
              <Button variant={"outlined"} onClick={handleClose} color="primary" autoFocus>
                Back to exam
              </Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>
    </div>
  );

  return !exam ? navbar : navbarRunningTest;
  // return navbar;
}