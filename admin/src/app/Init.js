import React, { useLayoutEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Redirect } from "react-router-dom";
import { useSnackbar } from "notistack";
import List from "./List";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Accordion, AccordionDetails, AccordionSummary, Divider } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

const gridItemSizes = {
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

export default function Init() {
  const classes = useStyles();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState({});
  const [isPending, setIsPending] = useState(true)
  const [requirements, setRequirements] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    data[name] = value
    setData({ ...data })
  }

  function initApp(e) {
    e.preventDefault()

    fetch(`${process.env.REACT_APP_BASE_URI}/app/init`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {
        setIsInitialized(true);
        enqueueSnackbar('Init application successful', { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar('Init application failed', { variant: "error" });
        setIsError(err.message)
      })
      .finally(() => setIsPending(false))

  }

  useLayoutEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI}/app/init/requirements`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => setRequirements(json))
      .catch((err) => setIsError(err.message))
      .finally(() => setIsPending(false))

  }, [])



  if (isInitialized) {
    return <Redirect to="/"/>;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Init application
        </Typography>
        <form className={classes.form} noValidate onSubmit={initApp}>
          <TextField
            disabled={isInitialized}
            error={isError}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="mail"
            label="Mail Address"
            name="mail"
            autoComplete="email"
            autoFocus
          />
          <TextField
            disabled={isInitialized}
            error={isError}
            onChange={handleInputChange}
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

          <Divider/>

          <TextField
            disabled={isInitialized}
            error={isError}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="emailHost"
            label="Email host"
            type="text"
            id="emailHost"
          />

          <TextField
            disabled={isInitialized}
            error={isError}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="emailPort"
            label="Email port"
            type="number"
            id="emailPort"
          />

          <TextField
            disabled={isInitialized}
            error={isError}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="emailUsername"
            label="Email username"
            type="text"
            id="emailUsername"
          />

          <TextField
            disabled={isInitialized}
            error={isError}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="emailPassword"
            label="Email password"
            type="text"
            id="emailPassword"
          />

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>Application requirements</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List data={requirements} component={(item) => (<OutlinedCard item={item}/>)} gridSizes={gridItemSizes}/>
            </AccordionDetails>
          </Accordion>



          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Init
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright/>
      </Box>
    </Container>
  );
}

function OutlinedCard({ item }) {

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {item.key}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography>
              {item.current}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {item.required}
            </Typography>
          </Grid>
        </Grid>


        <Typography>
          {item.status}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {item.description}
        </Typography>


      </CardContent>
    </Card>
  );
}


