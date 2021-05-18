import React, { useLayoutEffect, useState } from 'react';
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";

const LessonInput = ({defaultValues = [], onChange}) => {

  const [data, setData] = useState([]);
  const [isPending, setIsPending] = useState(true)
  const [isError, setIsError] = useState(false);

  useLayoutEffect(() => {

    fetch(`${process.env.REACT_APP_BASE_URI}/lessons`)
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

  return (
    <Autocomplete
      onChange={(item, newValue) => {
        onChange(newValue)
      }}
      multiple
      defaultValue={defaultValues}
      options={data}
      getOptionLabel={(option) => option.title}
      style={{ width: "100%" }}
      renderInput={(params) => <TextField {...params}
                                          label="Lessons" variant="outlined" />}
    />

  );
};

export default LessonInput;