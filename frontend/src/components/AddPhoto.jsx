import React from 'react'
import { Widget } from "@uploadcare/react-widget";
import { Typography } from '@mui/material';

function AddPhoto({stagePhotos}) {
  return (
<div>
        <Typography variant='body2' align='center' sx={{ mb: '5px'}}>
            Upload Photos
        </Typography>
            <Widget
                publicKey='4e6a1edb02dcebdd2f89'
                crop="free, 16:9, 4:3, 5:4, 1:1"
                onChange={(info) => { stagePhotos(info.cdnUrl, info.name) }}
                clearable
            />
    </div>)
}

export default AddPhoto
