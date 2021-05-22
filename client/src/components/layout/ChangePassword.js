import React, { useLayoutEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useAuth } from "./AuthContext";
import { Redirect, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://quizy.cz">
        Quizy.cz
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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

export default function ChangePassword() {
  const classes = useStyles();

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPending, setIsPending] = useState(true)
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("reset")

  function postLogin(e) {
    e.preventDefault()



    fetch(`${process.env.REACT_APP_BASE_URI}/users/password`,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token, password: password }) // body data type must match "Content-Type" header
      })
      .then(response => {
        if (response.ok) {
          return;
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {
        setLoggedIn(true);
        enqueueSnackbar('Password changed', { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar('Password changing failed', { variant: "error" });
        setIsError(err.message)
      })
      .finally(() => setIsPending(false))

  }


  if (!token) {
    return <Redirect to="/password/reset"/>;
  }

  if (isLoggedIn) {
    return <Redirect to="/login"/>;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Change password
        </Typography>
        <form className={classes.form} noValidate onSubmit={postLogin}>
          <TextField
            error={isError}
            onChange={e => {
              setPassword(e.target.value)
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="mail"
            label="Password"
            name="password"
            type={"password"}
            value={password}
          />
          <TextField
            value={passwordConfirm}
            error={isError}
            onChange={e => {
              setPasswordConfirm(e.target.value)
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirm_password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {/*<FormControlLabel*/}
          {/*  control={<Checkbox value="remember" color="primary"/>}*/}
          {/*  label="Remember me"*/}
          {/*/>*/}
          {password !== passwordConfirm && "Passwords are not same" }
          {password.length < 10 && "Passwords have to have at least 10 characters" }
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Change password
          </Button>
          <Grid container>
            {/*<Grid item xs>*/}
            {/*  <Link href="#" variant="body2">*/}
            {/*    Forgot password?*/}
            {/*  </Link>*/}
            {/*</Grid>*/}
            {/*<Grid item>*/}
            {/*  <Link href="#" variant="body2">*/}
            {/*    {"Don't have an account? Sign Up"}*/}
            {/*  </Link>*/}
            {/*</Grid>*/}
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright/>
      </Box>
    </Container>
  );
}