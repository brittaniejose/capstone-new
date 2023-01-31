var express = require('express');
var router = express.Router();
require('dotenv').config();
const Sequelize = require('sequelize');
const { User, Post, Tag, Hashtag, Post_Tag, Post_Hashtag, Comment } = require("../models");
const Upload = require('upload-js');
const routeHelpers = require('../helperFns/routeHelpers');

const upload = Upload({
    apiKey: process.env.UPLOAD_API_KEY
  });
  
// Fetch in Feed component
// Posts GET All
router.get('/', async function (req, res) {
    try {
        let posts = await Post.findAll({ where: { deleted: false },
            include: [
                { model: User, attributes: ["id", "username", "displayName", "icon"] },
                { model: Tag, attributes: ["name"] }
            ]
        });

        const modifiedPosts = posts.map(post => {
            post.User.username = "@" + post.User.username;
            routeHelpers.checkForTag(post.Tags)
            return post;
        });
        res.status(200).json(modifiedPosts);
    } catch (error) {
        console.log(error, "error from Post.findAll()")        
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
});

// GET All Posts for USER
router.get('/user/:username', async function (req, res) {
    // Do you want to add username to get route via retrieval of username from auth middleware? Or keep param as userID?
    const userObj = {
        username: '@tewcold05',
        userID: 2
    }

    try {
        let posts = await Post.findAll({ where: { userID: userObj.userID }, 
            include: [
                { model: User, attributes: ["id", "username", "displayName", "icon"] },
                { model: Tag, attributes: ["name"] }
            ]
        });

        if (!posts) {
            res.status(400).json({ noPostsMessage: "Post not found" })
        } else {
            const modifiedPosts = posts.map(post=> {
                post.User.username = "@" + post.User.username;
                routeHelpers.checkForTag(post.Tags)
                return post;
            });
            res.status(200).json(modifiedPosts)
        }
    } catch (error) {
        console.log(error, "error from single post route")
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
});

// GET SINGLE Post
router.get('/:postID', async function (req, res) {
    const { postID } = req.params;

    try {
        let post = await Post.findOne({ where : { id: postID }, 
            include: [
                { model: User, attributes: ["id", "username", "displayName", "icon"] },
                { model: Tag, attributes: ["name"] }
            ]
        });
        
        post.User.username = "@" + post.User.username;
        routeHelpers.checkForTag(post.Tags)

        res.status(200).json(post)
    } catch (error) {
        console.log(error, "error from Post.findOne");
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
    
});


router.post('/create', async function (req, res) {
    const { title, content, media, userID, tagName } = req.body;

    try {
        const post = await Post.create({ title, content, media, userID, deleted: false });

        const hash_tags = routeHelpers.checkForHashtag(post.content);
        let hashtagsRes = [];

        if (hash_tags) {
            const hashtags = routeHelpers.extractHashtags(post.content);
            const storedHashtagsPromise  = hashtags.map(async (ht) => {
                const [hashtag, created] = await Hashtag.findOrCreate({ where: { name: ht }})
    
                if (hashtag) {
                    return await Post_Hashtag.create({ postID: post.id, hashtagID: hashtag.id})
                } else {
                    return await Post_Hashtag.create({ postID: post.id, hashtagID: created.id})
                }
            })
            const storedHashtags = await Promise.all(storedHashtagsPromise);
            hashtagsRes = [...storedHashtags];
        }
        
        let postTagRes = ""

        if (tagName) {
            const cleanedTagName = tagName.replace("#", "");
            console.log(cleanedTagName, "cleaned tag from req body")
            const [tag, created] = await Tag.findOrCreate({ where: { name: cleanedTagName }});

            if(tag) {
               const postTag = await Post_Tag.create({ postID: post.id, tagID: tag.id });
               console.log(postTag, "postTag from exisiting tag")
               postTagRes = postTag;
            } else {
                const postTag = await Post_Tag.create({ postID: post.id, tagID: created.id });
                console.log(postTag, "postTag from created tag")
                postTagRes = postTag;
            }
        }

        const postObj = {
            post: post,
            postTag: postTagRes,
            hashtags: hashtagsRes,
            message: "Post successfuly created"
        };

        res.status(200).json({postObj})
    } catch (error) {
        // console.log(error)
        if(error instanceof Sequelize.ValidationError){
            let postError = error.errors.map(e => e.message).join(', ');
            res.status(400).json({postError});
        }
    }

});

router.post('/delete', async function (req, res) {
    const { postID } = req.body;
    try {
        const post = await Post.findOne({ where: { id: postID } });
        await post.update({ deleted: true });
        res.status(200).json({message: 'Post deleted'});
    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"});
    }
})

router.post('/edit', async function (req, res) {
    const { postID, title, content, media } = req.body;
    try {
        const post = await Post.findOne({ where: { id: postID }});
        await post.update({ title, content, media })
        res.status(200).json({message: 'Post Saved'})
    } catch (error) {
        console.log(error);
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"});
    }
});

module.exports = router;