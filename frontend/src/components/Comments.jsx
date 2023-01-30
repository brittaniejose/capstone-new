import React, { useState, useEffect } from 'react'
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

function Comments({data}) {
    const [comments, setComments] = useState([]);
    const [commentsFetched, setCommentsFetched] = useState(false);
    const [serverError, setServerError] = useState("");

    useEffect(() => {
        getComments();
    }, [commentsFetched])

    const getComments = async () => {
        const response = await fetch(`http://localhost:3000/comments/post/${data.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
    
        const resComments = await response.json();
        console.log(resComments, "posts GET");
    
        if (resComments.serverMessage) {
          setServerError(resComments.serverMessage);
        } else {
          setComments([...resComments.comments]);
          if (comments) {
            console.log(comments, "comments from setState");
            setCommentsFetched(true);
          }
        }
      };

  return (
    <React.Fragment>
        <Typography variant="h5">
            Comments
        </Typography>
      comments component
    </React.Fragment>
  )
}

export default Comments
