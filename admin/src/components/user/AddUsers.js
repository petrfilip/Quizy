import React, { useLayoutEffect, useReducer, useState } from 'react';
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
import Grid from "@material-ui/core/Grid";
import UploadImageArea from "../file-manager/UploadImageArea";
import * as XLSX from "xlsx";
import CreatableSelect from 'react-select/creatable';
import { Autocomplete, createFilterOptions } from "@material-ui/lab";

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

export default function AddUsers() {
  const classes = useStyles();

  const [isError, setIsError] = useState(false);
  const [users, setUsers] = useState([{}]);
  const [isPending, setIsPending] = useState(false)
  const [userLabels, setUserLabels] = React.useState([]);
  const [availableLabels, setAvailableLabels] = React.useState([]);
  const [updatedValue, forceUpdate] = useReducer((x) => x + 1, 0);

  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {

    fetch(`${process.env.REACT_APP_BASE_URI}/users/labels`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {
        setAvailableLabels(json)
      })
      .catch((err) => setIsError(err.message))
      .finally(() => setIsPending(false))

  }, [])

  function postLogin(e) {
    e.preventDefault()
    setIsPending(true)
    const usersToCreate = users.map(user => {
      user.labels = userLabels
      return user
    })

    fetch(`${process.env.REACT_APP_BASE_URI}/users`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usersToCreate) // body data type must match "Content-Type" header
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {
        setIsError(false)
        enqueueSnackbar(`User "${json.mail}" created with id ${json._id}`, { variant: "success" });
        setUsers([{name:"", mail:""}])
        forceUpdate()
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
      <Container component="main" maxWidth="sm">
        <Backdrop open={isPending}>
          <CircularProgress color="inherit"/>
        </Backdrop>


        <CssBaseline/>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <AccountCircleIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Create new users
          </Typography>
          <form className={classes.form} noValidate onSubmit={postLogin}>

            <Autocomplete
              multiple
              id="tags-outlined"
              options={availableLabels}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                  return option;
                }
                // // Add "xxx" option created dynamically
                if (option.inputValue) {
                  return option.inputValue;
                }
                // Regular option
                return option;
              }}
              defaultValue={userLabels}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                // Suggest the creation of a new value
                if (params.inputValue !== '') {
                  filtered.push(params.inputValue);
                }

                return filtered;
              }}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  setUserLabels(newValue);
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setUserLabels(newValue.inputValue);
                } else {
                  setUserLabels(newValue);
                }
              }}

              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  onKeyPress={(e) => {
                    e.key === 'Enter' && e.preventDefault();
                  }}
                  variant="outlined"
                  label="User labels"
                />
              )}
            />

            {users.map((user, index) => <Grid key={`user-${updatedValue}-${index}`} container spacing={4}>
              <Grid item xs={6}>
                <TextField
                  type={"email"}
                  value={user.name || null}
                  error={isError}
                  onChange={e => {

                    const editedUser = { ...users[index] };
                    editedUser.name = e.target.value
                    const updatedUsers = [...users]
                    updatedUsers[index] = editedUser;

                    if (index === users.length - 1) {
                      updatedUsers.push({})
                    }

                    setUsers(updatedUsers)

                  }}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="User name"
                  name="name"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  value={user.mail || null}
                  error={isError}
                  onChange={e => { //todo improve

                    const editedUser = { ...users[index] };
                    editedUser.mail = e.target.value
                    const updatedUsers = [...users]
                    updatedUsers[index] = editedUser;

                    if (index === users.length - 1) {
                      updatedUsers.push({})
                    }

                    setUsers(updatedUsers)

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
              </Grid>
            </Grid>)}


            <UploadImageArea location={"/"} onDropFiles={(files) => {
              var f = files[0];
              var reader = new FileReader();
              reader.onload = function(e) {
                var data = e.target.result;
                let readedData = XLSX.read(data, { type: 'binary' });
                const wsname = readedData.SheetNames[0];
                const ws = readedData.Sheets[wsname];

                /* Convert array to json*/
                const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
                const importedUsers = dataParse.map((row => ({ name: row[0], mail: row[1] })))
                importedUsers.push({})
                setUsers((currentValue) => [...currentValue, ...importedUsers])
              };
              reader.readAsBinaryString(f)
            }}/>
            <Button
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

const filter = createFilterOptions();
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  "test1", "abcd"
];