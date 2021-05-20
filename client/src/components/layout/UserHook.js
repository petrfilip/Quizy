import React, { useLayoutEffect, useState } from 'react';
import { useAuth } from "./AuthContext";
import { useSnackbar } from "notistack";

const useUser = () => {

  const { user, token } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [data, setData] = useState(JSON.parse(localStorage.getItem("user") || "{}"))

  const refreshUser = () => {

    if (token == null) {
      localStorage.removeItem("user");
      setData(null)
      return
    }

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
    (!data?.mail || !token) && refreshUser()
  }, [token])

  return ({ user: data, refreshUser });
};

export default useUser;