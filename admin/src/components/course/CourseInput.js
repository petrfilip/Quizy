import React, { useLayoutEffect, useState } from 'react';
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";

const CourseInput = ({defaultValue = {}, onChange}) => {

  const [data, setData] = useState([]);
  const [loadedItem, setLoadedItem] = useState();
  const [isPending, setIsPending] = useState(true)
  const [isError, setIsError] = useState(false);

  useLayoutEffect(() => {

    fetch(`${process.env.REACT_APP_BASE_URI}/courses`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {
        setData(json)
      })
      .catch((err) => setIsError(err.message))
      .finally(() => setIsPending(false))

  }, [])




  const onChangeHandler = (item)=> {

    if (!item) {
      setLoadedItem(undefined);
      onChange && onChange(undefined)
      return
    }

    fetch(`${process.env.REACT_APP_BASE_URI}/courses/${item.slug}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {
        setLoadedItem(json)
        onChange && onChange(json)
      })
      .catch((err) => setIsError(err.message))
      .finally(() => setIsPending(false))
  }

  return (
    <Autocomplete
      onChange={(item, newValue) => {
        onChangeHandler(newValue)
      }}
      defaultValue={defaultValue}
      options={data}
      getOptionLabel={(option) => option.title}
      style={{ width: "100%" }}
      renderInput={(params) => <TextField
        {...params} label="Courses" variant="outlined" />}
    />

  );
};

export default CourseInput;