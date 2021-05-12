import React from 'react';
import { useAuth } from "./AuthContext";
import { Paper, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";



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

function Profile(props) {
  const classes = useStyles();


  const { user, token } = useAuth()

  return (
    <Container maxWidth="xs">
      <CssBaseline/>

      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountCircleIcon/>
        </Avatar>

        <Typography component="h1" variant="h5">
          Profile
        </Typography>

        {Object.entries(user).map(([key, value]) => {
          return <Grid container>
            <Grid item xs={6} style={{textAlign: "right", paddingRight: "10px"}}>
              <strong>{key}:</strong>
            </Grid>
            <Grid item xs={6}>
              {value}
            </Grid>
          </Grid>
        })}

      </Paper>

    </Container>
  );
}

export default Profile;