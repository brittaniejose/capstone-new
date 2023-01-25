var express = require('express');
var router = express.Router();
const { Op } = require('sequelize');
const { User, Post, Location, Comment, Tag } = require('../models');
const routeHelpers = require('../helperFns/routeHelpers');

router.get('/', async function (req, res) {
    const searchInput = req.query.q;
    try {
      let users = await User.findAll({ where: {  
        [Op.or]: [
            { username: { [Op.iLike]: `%${searchInput}%` } }, 
            { displayName:{ [Op.iLike]: `%${searchInput}%` } }
        ] }});
      
      let posts = await Post.findAll({ where: { 
        [Op.or]: [
            { title: { [Op.iLike]: `%${searchInput}%` } }, 
            { content: { [Op.iLike]: `%${searchInput}%` } }
        ]
        }, include: [
            { model: User, attributes: ["id", "username", "displayName", "icon"] },
            { model: Tag, attributes: ["name"] }
        ]});

      let locations = await Location.findAll({ where: { 
        [Op.or]: [
            { name: { [Op.iLike]: `%${searchInput}%` } }, 
            { content: { [Op.iLike]: `%${searchInput}%` } }, 
            { header: { [Op.iLike]: `%${searchInput}%` }} 
        ] 
        }, include: [{ 
            model: User, 
            attributes: ["id", "username", "displayName", "icon"] 
        }]});

      let comments = await Comment.findAll({ where: { content: { [Op.iLike]: `%${searchInput}%` }
        }, include: [{ 
            model: User, 
            attributes: ["id", "username", "displayName", "icon"] 
        }]});
    
        const modifiedUsers = users.map(user => {
            user.username = "@" + user.username;
            return user;
        });

        const modifiedPosts = posts.map(post => {
            post.User.username = "@" + post.User.username;
            routeHelpers.checkForTag(post.Tags)
            return post;
        });

        const modifiedLocations = locations.map(location => {
            location.User.username = "@" + location.User.username;
            return location;
        });
        const commentsPromise = comments.map( async (comment) => {
            comment.User.username = "@" + comment.User.username;
            const commentedPost = await Post.findOne({ where: { id: comment.postID }, include: [{ 
                model: User, 
                attributes: ["username"] 
            }]});

            const replyingToUsername = commentedPost.User.username;
            
            const commentObj = {
                comment: comment,
                replyingTo: `Replying to @${replyingToUsername}`
            }

            return commentObj;
        });
        const modifiedComments = await Promise.all(commentsPromise);

        const resultsObj = {
            users: modifiedUsers,
            posts: modifiedPosts,
            locations: modifiedLocations,
            comments: modifiedComments
        }

        res.status(200).json(resultsObj);
    } catch (error) {
        console.log(error, "global search error")
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
});

router.get('/tags/tutorial', async function (req, res) {
    const searchInput  = req.query.q;
    try {
        const posts = await Post.findAll({
            where: { content: { [Op.iLike]: `%${searchInput}%` }, [Op.and]: [{'$Tags.name$': 'tutorial'}] },
            include: [
                { model: Tag },
                { model: User, attributes: ["id", "username", "displayName", "icon"] }
            ]
        });

        const modifiedPosts = posts.map(post => {
            post.User.username = "@" + post.User.username;
            routeHelpers.checkForTag(post.Tags)
            return post;
        });
        
        if (modifiedPosts.length > 0) {
            res.status(200).json(modifiedPosts)
        } else{
            res.status(400).json({message: 'No posts found in #tip for this search'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"});
    }
});

router.get('/tags/tip', async function (req, res) {
    const searchInput  = req.query.q;
    try {
        const posts = await Post.findAll({
            where: { content: { [Op.iLike]: `%${searchInput}%` }, [Op.and]: [{'$Tags.name$': 'tip'}] },
            include: [
                { model: Tag },
                { model: User, attributes: ["id", "username", "displayName", "icon"] }
            ]
        });

        const modifiedPosts = posts.map(post => {
            post.User.username = "@" + post.User.username;
            routeHelpers.checkForTag(post.Tags)
            return post;
        });

        if (modifiedPosts.length > 0) {
            res.status(200).json(modifiedPosts)
        } else{
            res.status(400).json({message: 'No posts found in #tip for this search'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"});
    }
})

module.exports = router;