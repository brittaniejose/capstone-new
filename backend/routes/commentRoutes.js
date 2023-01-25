var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const { User, Post, Comment, Hashtag } = require("../models");
const routeHelpers = require('../helperFns/routeHelpers');

// GET All Comments for a Post
router.get('/:postID', async function (req, res) {
    const { postID } = req.params
    try {
        const comments = await Comment.findAll({ where: { postID: postID }, include: [{ 
            model: User, 
            attributes: ["id", "username", "displayName", "icon"] 
        }]})

        const modifiedComments = comments.map(comment => {
            comment.User.username = "@" + comment.User.username;
            return comment;
        });

        const post = await Post.findOne({ where: { id: postID }, 
            include: [{ 
                model: User, 
                attributes: ["username"] 
            }] });

        const replyingToUsername = post.User.username;

        if (comments.length > 0) {
            const commentsObj = {
                comments: modifiedComments,
                replyingTo: `Replying to @${replyingToUsername}`
            }
            res.status(200).json(commentsObj)
        } else {
            res.status(200).json({commentsMessage: "No comments yet"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
  
});

// GET All Comments for user
router.get('/user/:username', async function (req, res) {
        // Do you want to add username to get route via retrieval of username from auth middleware? Or keep param as userID?
        const userObj = {
            username: '@benji123',
            userID: 1
        }
    
        try {
            let comments = await Comment.findAll({ where: { userID: userObj.userID }, include: [{ 
                model: User, 
                attributes: ["id", "username", "displayName", "icon"] 
            }]});
    
            const modifiedComments = comments.map(comment => {
                comment.User.username = "@" + comment.User.username;
                return comment;
            });
    
            res.status(200).json(modifiedComments);
    
        } catch (error) {
            console.log(error, "error from get location for user")
            res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
        }
})

// create comments
router.post("/create", async function (req, res) {
    // const { postID } = req.params;
    const { content, postID, locationID } = req.body;
    // GET USER ID FROM REQ USER COOKIE AND REPLACE HARDCODED
    const userID = 1;
    try {
        const comment = await Comment.create({ content: content, postID: postID, userID: userID, locationID: locationID })

        const hash_tags = routeHelpers.checkForHashtag(comment.content);
        let hashtagsRes = [];

        if (hash_tags) {
            const hashtags = routeHelpers.extractHashtags(comment.content);
            const storedHashtagsPromise  = hashtags.map(async (ht) => {
                const [hashtag, created] = await Hashtag.findOrCreate({ where: { name: ht }})
    
                if (hashtag) {
                    return hashtag;
                } else {
                    return created;
                }
            })
            const storedHashtags = await Promise.all(storedHashtagsPromise);
            await comment.setHashtags(storedHashtags);
            hashtagsRes = [...storedHashtags];
        }
        const commentObj = {
            comment: comment,
            hashtags: hashtagsRes,
        }
        res.status(200).json(commentObj)
    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
})


module.exports = router;