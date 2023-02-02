import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function TagSelector({setTag, tag}) {
  const handleChange = (event) => {
    setTag(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, mt: '10px', mb: '10px'}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select Tag</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tag}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value='#tip'>#tip</MenuItem>
          <MenuItem value='#tutorial'>#tutorial</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}