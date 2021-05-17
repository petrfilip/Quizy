import React, { useLayoutEffect, useState } from 'react';
import { Chip, Container, Paper, Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useAuth } from "../../app/AuthContext";

const UserDetails = ({ userId }) => {

  const [data, setData] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();

  useLayoutEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI}/users/${userId}`, {
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

  }, [userId])

  const userComponent = <Container maxWidth={"md"}>
      <Paper>
        <Typography variant={"h5"}>{data.name}</Typography>
        <Typography>{data.mail}</Typography>

        {data.labels?.map(label => <Chip label={label} />)}

        {/*{JSON.stringify(data)}*/}
      </Paper>
    </Container>
  ;

  return isPending ? "Loading..." : userComponent;
};

export default UserDetails;