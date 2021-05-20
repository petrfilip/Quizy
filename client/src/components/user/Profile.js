import React from 'react';
import { Paper, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useAuth } from "../layout/AuthContext";
import List from "../layout/List";
import useUser from "../layout/UserHook";
import AchievementCard from "./AchievementCard";

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

  const { user: userToken } = useAuth()
  const { user: data } = useUser()

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

        {Object.entries(userToken).map(([key, value]) => {
          return <Grid container>
            <Grid item xs={6} style={{ textAlign: "right", paddingRight: "10px" }}>
              <strong>{key}:</strong>
            </Grid>
            <Grid item xs={6}>
              {value}
            </Grid>
          </Grid>
        })}


      </Paper>

      {data?.achievements?.lessonList.length && <List gridSizes={defaultGridItemSizes} data={reverse(data.achievements.lessonList) || []} component={(item) => {
        return <AchievementCard item={item} />
      }}/>}

    </Container>
  );
}

function reverse(array){
  return array.map((item,idx) => array[array.length-1-idx])
}

export default Profile;