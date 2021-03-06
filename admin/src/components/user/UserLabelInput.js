import React, { useLayoutEffect, useState } from 'react';
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../app/AuthContext";

const UserLabelInput = ({defaultValues = [], onChange}) => {
  const { t } = useTranslation();

  const [availableLabels, setAvailableLabels] = useState([]);
  const [isPending, setIsPending] = useState(true)
  const [isError, setIsError] = useState(false);
  const { token } = useAuth();


  const filter = createFilterOptions();


  useLayoutEffect(() => {

    fetch(`${process.env.REACT_APP_BASE_URI}/users/labels`,{
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    })
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

  return (
    <Autocomplete
      style={{width:"100%"}}
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
          return  option.inputValue;
        }
        // Regular option
        return option;
      }}
      defaultValue={defaultValues}
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
          onChange(newValue);
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          onChange(newValue.inputValue);
        } else {
          onChange(newValue);
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
          label={t('cm_userLabels')}
        />
      )}
    />

  );
};

export default UserLabelInput;