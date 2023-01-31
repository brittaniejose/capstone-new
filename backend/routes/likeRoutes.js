var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const { Like } = require('../models');

// Posting likes
router.post('/post', async function (req, res) {
    const { userID, resourceID } = req.body;

    try {
        const existingLike = await Like.findOne({ where: { userID, postID: resourceID } });
        if (existingLike) {
            await Like.destroy({ where: { userID, postID: resourceID } });
            res.status(200).json({ message: "Like removed" });
        } else {
            const like = await Like.create({ userID, postID: resourceID });
            res.status(200).json({ message: "Like added", like });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
});

// Posting likes
router.post('/location', async function (req, res) {
    const { userID, resourceID } = req.body;
    try {
        const existingLike = await Like.findOne({ where: { userID, locationID: resourceID } });
        if (existingLike) {
            await Like.destroy({ where: { userID, locationID: resourceID } });
            res.status(200).json({ message: "Like removed" });
        } else {
            const like = await Like.create({ userID, locationID: resourceID });
            res.status(200).json({ message: "Like added", like });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }

});

// Posting likes
router.post('/comment', async function (req, res) {
    const { userID, resourceID } = req.body;

    try {
        const existingLike = await Like.findOne({ where: { userID, commentID: resourceID } });
        if (existingLike) {
            await Like.destroy({ where: { userID, commentID: resourceID } });
            res.status(200).json({ message: "Like removed" });
        } else {
            const like = await Like.create({ userID, commentID: resourceID });
            res.status(200).json({ message: "Like added", like });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
});

// Getting likes
router.get('/for-post', async function (req, res) {
    const { userID, postID } = req.body;

    try {
        const postLikesCount = await Like.count({ where: { postID } });
        res.status(200).json({ postLikesCount });
    } catch (error) {
        console.log(error, "error from Post Likes count");
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
});

// Getting likes
router.post('/for-location', async function (req, res) {
    const { userID, locationID } = req.body;

    try {
        const locationLikesCount = await Like.count({ where: { locationID } });
        res.status(200).json({ locationLikesCount });
    } catch (error) {
        console.log(error, "error from Location Likes count");
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
});
// Getting likes
router.post('/for-comment', async function (req, res) {
    const { userID, commentID } = req.body;
    console.log(userID, 'userID from req.body');
    console.log(commentID, 'commentID from req.body');
    try {
        const likesCount = await Like.count({ where: { commentID } });

        const alreadyLiked = async () => {
            const liked = await Like.findOne({where: { commentID, userID } });
            if (liked) {
                return true
            } else {
                return false
            }
        }
        const liked = await alreadyLiked();
        res.status(200).json({likesCount, liked});
    } catch (error) {
        console.log(error, "error from Comment Likes count");
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
});

module.exports = router;