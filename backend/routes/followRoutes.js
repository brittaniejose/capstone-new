var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const db  = require('../models/index');
const { Op } = require('sequelize');
const { User, Follow, Post, Location, Tag } = require('../models')
const routeHelpers = require('../helperFns/routeHelpers');

// Query following to find follows were followerID = userID. GET followingIDs and query Post where followingIDs = userID

// Query following to find follows were followerID = userID. GET followingIDs and query Locations where followingIDs = userID

// GET Reposts here

// Follow POST
router.post('/', async function (req, res) {
    const { followingID, userID } = req.body;
    console.log(followingID, 'following id');
    console.log(userID, 'user id')
    // const userID = 3
    try {
        const follower = await User.findByPk(userID);
        const following = await User.findByPk(followingID);

        const exisitingFollow = await Follow.findOne({ where: { followerID: userID, followingID: followingID }});
        if (exisitingFollow) {
            await db.sequelize.query(
                `DELETE FROM "Follow_Following" WHERE "followID" = ${exisitingFollow.id}`
            );
            await db.sequelize.query(
                `DELETE FROM "Follow_Follower" WHERE "followID" = ${exisitingFollow.id}`
            );
            await Follow.destroy({ where: { followerID: userID, followingID: followingID }});
            res.status(200).json({ message: `Unfollowed @${following.username}` });
        } else {
            const follow = await Follow.create({ followerID: userID, followingID: followingID });
            await follow.setFollower(follower);
            await follow.setFollowing(following);
    
            res.status(200).json({follow, message: `Followed @${following.username}`});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
});

// create follow delete route

// GET Followers for user 
router.get('/followers/:userID', async function (req, res) {
    const { userID } = req.params;

    try {
        const follow_followers = await Follow.findAll({ where: { followingID: userID },
            include: [{ model: User, as: 'Follower', attributes: ['id', 'icon', 'displayName', 'username']}]
        });
        const followers = follow_followers.map(({Follower}) => Follower).flat()
        .map(follower => {
            follower.username = "@" + follower.username;
            return follower;
        });
        res.status(200).json(followers)
    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"});
    }

});

// GET Following for user
router.get('/following/:userID', async function (req, res) {
    const { userID } = req.params;

    try {
        const follow_following = await Follow.findAll({ where: { followerID: userID },
            include: [{ model: User, as: 'Following', attributes: ['id', 'icon', 'displayName', 'username']}]
        });
        const following = follow_following.map(({Following}) => Following).flat()
        .map(following => {
            following.username = "@" + following.username;
            return following;
        });
        res.status(200).json(following)
    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"});
    }

});

// GET all content for who a user is following
router.get('/content/:userID', async function (req, res) {
    const { userID } = req.params;

    try {
        const following = await Follow.findAll({ where: { followerID: userID },
            include: [{ model: User, as: 'Following', attributes: ['id', 'icon', 'displayName', 'username']}]
        });
        const followingIDs = following.map(({Following}) => Following).flat().map(following => following.id);
        console.log(followingIDs, 'following IDs')
    
        const posts = await Post.findAll({
        include: [
            { model: User, where: { id: followingIDs }, attributes: ['id', 'icon', 'displayName', 'username']},
            { model: Tag, attributes: ["name"] }
        ]});
        const locations = await Location.findAll({
        include: [{
            model: User,
            where: { id: followingIDs },
            attributes: ['id', 'icon', 'displayName', 'username']
        }]});

        const modifiedPosts = posts.map(post => {
            post.User.username = "@" + post.User.username;
            routeHelpers.checkForTag(post.Tags);
            return post;
        });
        const modifiedLocations = locations.map(location => {
            location.User.username = "@" + location.User.username;
            return location;
        });
        
        const content = {
            posts: modifiedPosts,
            locations: modifiedLocations
        }

        res.status(200).json({posts: {posts: modifiedPosts, resource: 'post'}, locations: {locations: modifiedLocations, resource: 'location'}})
    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"});
    }
    
});



module.exports = router;