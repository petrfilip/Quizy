import React, { useReducer, useState } from 'react';
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
import UserLabelInput from "./UserLabelInput";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const [isError, setIsError] = useState(false);
  const [users, setUsers] = useState([{}]);
  const [isPending, setIsPending] = useState(false)
  const [userLabels, setUserLabels] = useState([]);
  const [updatedValue, forceUpdate] = useReducer((x) => x + 1, 0);

  const { enqueueSnackbar } = useSnackbar();

  function createUsers(e) {
    e.preventDefault()
    setIsPending(true)
    let usersToCreate = users.map(user => {
      user.labels = userLabels
      return user
    })

    usersToCreate = usersToCreate.filter(item => !!item.mail)

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
        enqueueSnackbar(`${usersToCreate.length} users has been created`, { variant: "success" });
        setUsers([{ name: "", mail: "" }])
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
      >{t('cm_userList')}</Button>
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
            {t('cm_addNewUsers')}
          </Typography>
          <form className={classes.form} noValidate={true} onSubmit={createUsers}>

            <UserLabelInput defaultValues={userLabels} onChange={setUserLabels}/>

            {users.map((user, index) => <Grid key={`user-${updatedValue}-${index}`} container spacing={4}>
              <Grid item xs={6}>
                <TextField
                  type={"text"}
                  value={user.name || ""}
                  error={isError || !user.name && users.length - 1 > index}
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
                  label={t('cm_userName')}
                  name="name"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type={"email"}
                  value={user.mail || ""}
                  error={isError || !user.mail && users.length - 1 > index}
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
                  label={t('cm_userMail')}
                  name="mail"
                  autoComplete="off"
                />
              </Grid>
            </Grid>)}


            <UploadImageArea location={"/"}
                             label={t('cm_userDropImport')}
                             onDropFiles={(files) => {
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
            >{t('cm_userCreateButton')}</Button>
          </form>
        </div>

      </Container>
    </Container>

  );
}

