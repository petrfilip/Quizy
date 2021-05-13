import React, { useState } from 'react';
import { Button, TextField } from "@material-ui/core";

const DirectoryCreate = ({onSubmit}) => {

  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <TextField
        value={inputValue}
        disabled={false}
        onChange={e => setInputValue(e.target.value)}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="newDirectory"
        label="New directory"
      />
      <Button
        disabled={inputValue === ""}
        onClick={()=> {
          onSubmit(inputValue)
          setInputValue("")
        }}
        variant={"contained"} color={"primary"}>Create</Button>

    </>
  );
};

export default DirectoryCreate;