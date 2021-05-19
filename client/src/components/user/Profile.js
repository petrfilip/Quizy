import React, { useLayoutEffect, useState } from 'react';
import { Paper, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useAuth } from "../layout/AuthContext";
import { useSnackbar } from "notistack";
import List from "../layout/List";

const defaultGridItemSizes = {
  xs: 12,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12
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

function Profile(props) {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar()
  const { token } = useAuth();
  const [data, setData] = useState([])
  const { user } = useAuth()


  useLayoutEffect(()=>{
    fetch(`${process.env.REACT_APP_BASE_URI}/users/${user.user_id}`, {
      method: 'get', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Authorization': 'Bearer ' + token
      },
    }).then(r => r.json())
      .then(json => {
        setData(json)
      })
      .catch(() => {
        enqueueSnackbar('Error when getting data', { variant: "error" });
      })
      .finally(() => {
      });
  }, [])



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

      {data?.achievements?.lessonList.length && <List gridSizes={defaultGridItemSizes} data={data.achievements.lessonList || []} component={(item) => {
        return <div>{JSON.stringify(item)}</div>
      }}/>}

    </Container>
  );
}

export default Profile;