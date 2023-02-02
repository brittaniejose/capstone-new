import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ContentToggle({changeContent, setChangeContent}) {
  const handleChange = (event) => {
    console.log(event.target.value, 'select value')
    setChangeContent(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, mt: '10px', mb: '20px'}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select Content</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={changeContent}
          label="Content Type"
          onChange={handleChange}
        >
          <MenuItem value={false}>Posts</MenuItem>
          <MenuItem value={true}>Locations</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}