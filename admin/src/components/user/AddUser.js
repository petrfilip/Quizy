import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink } from "react-router-dom";
import { useSnackbar } from "notistack";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Backdrop, CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AddUser() {
  const classes = useStyles();

  const [isError, setIsError] = useState(false);
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  function postLogin(e) {
    e.preventDefault()
    setIsPending(true)

    fetch(`${process.env.REACT_APP_BASE_URI}/users`,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, mail: mail, password: password }) // body data type must match "Content-Type" header
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {
        setIsError(false)
        setName("")
        setPassword("")
        setMail("")
        enqueueSnackbar(`User "${json.mail}" created with id ${json._id}`, { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar(`User creation failed. ${err}`, { variant: "error" });
        setIsError(err.message)
      })
      .finally(() => setIsPending(false))

  }

  return (<Container maxWidth={"lg"}>
    <Button color={"primary"}
            startIcon={<AddIcon/>}
            variant="outlined"
            to={`/users`}
            component={RouterLink}
    >List users</Button>
    <Container component="main" maxWidth="xs">
      <Backdrop open={isPending}>
        <CircularProgress color="inherit"/>
      </Backdrop>

      <CssBaseline/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountCircleIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Create new user
        </Typography>
        <form className={classes.form} noValidate onSubmit={postLogin}>
          <TextField
            type={"email"}
            value={name}
            error={isError}
            onChange={e => {
              setName(e.target.value)
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="User name"
            name="name"
            autoComplete="off"
            autoFocus
          />
          <TextField
            value={mail}
            error={isError}
            onChange={e => {
              setMail(e.target.value)
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="mail"
            label="Mail Address"
            name="mail"
            autoComplete="off"
          />
          <TextField
            value={password}
            error={isError}
            onChange={e => {
              setPassword(e.target.value)
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            disabled={!password || !name || !mail}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Create user
          </Button>
        </form>
      </div>

    </Container>
    </Container>

  );
}