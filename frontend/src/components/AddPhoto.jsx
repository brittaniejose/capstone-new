import React from 'react'
import { Widget } from "@uploadcare/react-widget";
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

function AddPhoto() {
  return (
<div style={{height:"41px"}} >
        <p >
            <AddAPhotoIcon/>
            <Widget
                publicKey='4e6a1edb02dcebdd2f89'
                crop="free, 16:9, 4:3, 5:4, 1:1"
                clearable
            />
        </p>
    </div>)
}

export default AddPhoto
