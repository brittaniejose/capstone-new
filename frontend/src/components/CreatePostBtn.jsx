import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from "@mui/material/Button";

import React from 'react'

function CreatePostBtn({handleClick}) {
  return (
    <div>
      <Button onClick={handleClick}>
        <AddCircleIcon fontSize='large'/>
      </Button>
    </div>
  )
}

export default CreatePostBtn
