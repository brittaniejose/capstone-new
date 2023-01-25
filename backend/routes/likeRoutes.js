var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const { Like, User, Post, Location, Comment } = require('../models');

router.post('/post', async function (req, res) {
    const { userID, postID } = req.body;

    try {
        const existingLike = await Like.findOne({ where: { userID, postID } });
        if (existingLike) {
            await Like.destroy({ where: { userID, postID } });
            res.status(200).json({ message: "Like removed" });
        } else {
            const like = await Like.create({ userID, postID });
            res.status(200).json({ message: "Like added", like });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
});

router.post('/location', async function (req, res) {
    const { userID, locationID } = req.body;
    try {
        const existingLike = await Like.findOne({ where: { userID, locationID } });
        if (existingLike) {
            await Like.destroy({ where: { userID, locationID } });
            res.status(200).json({ message: "Like removed" });
        } else {
            const like = await Like.create({ userID, locationID });
            res.status(200).json({ message: "Like added", like });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }

});

router.post('/comment', async function (req, res) {
    const { userID, commentID } = req.body;

    try {
        const existingLike = await Like.findOne({ where: { userID, commentID } });
        if (existingLike) {
            await Like.destroy({ where: { userID, commentID } });
            res.status(200).json({ message: "Like removed" });
        } else {
            const like = await Like.create({ userID, commentID });
            res.status(200).json({ message: "Like added", like });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
});



module.exports = router;