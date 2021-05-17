import React, { useLayoutEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { useAuth } from "../../app/AuthContext";
import List from "../../app/List";
import { Container } from "@material-ui/core";
import UserCard from "./UserCard";

export default function UserLoader() {

  const [data, setData] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();

  useLayoutEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI}/users`, {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setIsPending(false))

  }, [])

  const deleteItem = (user) => {
    setIsPending(true)
    fetch(`${process.env.REACT_APP_BASE_URI}/users/${user._id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to delete data: ${response.statusText}`)
      })
      .then(json => setData(removeFromCollection(user._id)))
      .then(() => enqueueSnackbar(`User "${user.mail}" deleted`, { variant: "success" }))
      .catch((err) => {
        enqueueSnackbar(`User "${user.mail}" not deleted`, { variant: "error" });
        setError(err.message)
      })
      .finally(() => setIsPending(false))
  }

  const removeFromCollection = (lessonId) => {
    return data.filter((item) => item._id !== lessonId)
  }

  const deleteItemDialog = (item) => {
    if (window.confirm(`Are you sure to delete "${item.name}" record?`)) {
      deleteItem(item)
    }
  }
  const history = useHistory();
  const showUserDetail = (item) => {
    history.push(`/users/${item._id}`);
  }

  const columns = [
    {
      accessor: 'mail'
    },
    {
      accessor: 'labels'
    }
  ];

  return <Container maxWidth={"lg"}>
    <Typography variant="h4">Users</Typography>

    {error}
    <Button color={"primary"}
            startIcon={<AddIcon/>}
            variant="outlined"
            to={`/users/new`}
            component={RouterLink}
    >Add new user</Button>
    <List isPending={isPending} columns={columns} data={data} component={(item) => <UserCard
      userItem={item}
      onClick={showUserDetail}
      onDelete={deleteItemDialog}/> }/>
  </Container>

}

