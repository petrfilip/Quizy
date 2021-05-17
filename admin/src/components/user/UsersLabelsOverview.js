import React, { useLayoutEffect, useState } from 'react';
import { useSnackbar } from "notistack";
import { useAuth } from "../../app/AuthContext";
import UserLabelInput from "./UserLabelInput";
import { useHistory } from "react-router-dom";

const UsersLabelsOverview = ({ labels }) => {

  const [data, setData] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();
  let history = useHistory();

  // const prepareFilterMap = () => {
  //   if (!labels) {
  //     return [];
  //   }
  //
  //   const and = labels.split(":").map(item => ["labels", "CONTAINS", item])
  //   const tmp = [];
  //   and.forEach((item) => {
  //     tmp.push(item)
  //     tmp.push("AND")
  //   })
  //   tmp.pop();
  //
  //   return tmp;
  //
  // }

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

  const cond = labels && labels.split(":") || []

  const filteredData = () => {
    return data.filter((item) => containsAll(cond, item.labels || []))
      .map(item => JSON.stringify(item, null, 2))
  }

  return (
    <div>
      <UserLabelInput defaultValues={labels && labels.split(":")} onChange={(items) => {
        history.push("/users/labels/" + items.join(":"))
      }}/>

      <pre>
      {filteredData()}
        </pre>
    </div>
  );
};

function containsAll(arr, arr2) {
  return arr.every(i => arr2.includes(i));
}

export default UsersLabelsOverview;