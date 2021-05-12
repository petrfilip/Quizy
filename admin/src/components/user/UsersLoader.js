import React, { useLayoutEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { useAuth } from "../../app/AuthContext";
import List from "../../app/List";
import { Container } from "@material-ui/core";

export default function UserLoader() {

  const [data, setData] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();

  useLayoutEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI}/users`,{
      headers: new Headers({
        'Authorization': 'Bearer ' + token,
      }),
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
        headers: new Headers({
          'Authorization': 'Bearer ' + token,
        }),
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
    console.log(data)
    return data.filter((item) => item._id !== lessonId)
  }

  const deleteItemDialog = (item) => {
    console.log(data)

    if (window.confirm(`Are you sure to delete "${item.name}" record?`)) {
      deleteItem(item)
    }
  }

  const columns = [
    {
      accessor: 'mail'
    }
  ];

  return <Container maxWidth={"lg"}>
    {error}
    <Button color={"primary"}
            startIcon={<AddIcon/>}
            variant="outlined"
            to={`/users/new`}
            component={RouterLink}
    >Add new user</Button>
    <List columns={columns} data={data} component={(item) => OutlinedCard(item, deleteItemDialog)}/>
  </Container>

}

function OutlinedCard(userItem, onDelete) {

  return (
    <Card variant="outlined">
      {/*<CardMedia*/}
      {/*  style={{*/}
      {/*    width: "auto",*/}
      {/*    maxHeight: "200px",*/}
      {/*  }}*/}
      {/*  component="img"*/}
      {/*  alt="Contemplative Reptile"*/}
      {/*  image="https://via.placeholder.com/500"*/}
      {/*  title="Contemplative Reptile"*/}
      {/*/>*/}
      <CardContent>
        <Typography>
          {userItem.mail}
        </Typography>


      </CardContent>
      <CardActions>
        <Button color={"secondary"} startIcon={<DeleteIcon/>} onClick={() => onDelete(userItem)}/>
      </CardActions>
    </Card>
  );
}

