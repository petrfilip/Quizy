import React, { useLayoutEffect, useState } from 'react';
import { useAuth } from "./AuthContext";
import { useSnackbar } from "notistack";

const useUser = () => {

  const { user, token } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [data, setData] = useState(JSON.parse(localStorage.getItem("user") || "{}"))

  console.log(JSON.stringify(localStorage.getItem("user")))
  const refreshUser = () => {
    fetch(`${process.env.REACT_APP_BASE_URI}/users/${user.user_id}`, {
      method: 'get', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Authorization': 'Bearer ' + token
      },
    }).then(r => r.json())
      .then(json => {
        setData(json)
        localStorage.setItem("user", JSON.stringify(json));
      })
      .catch(() => {
        enqueueSnackbar('Error when getting data', { variant: "error" });
      })
      .finally(() => {
      });
  }

  useLayoutEffect(() => {
    !data && refreshUser()
  }, [])

  return ({ user: data, refreshUser });
};

export default useUser;