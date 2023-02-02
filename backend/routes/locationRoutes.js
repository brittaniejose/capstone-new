var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const { User, Location, Hashtag, Location_Hashtag } = require('../models');
const routeHelpers = require('../helperFns/routeHelpers');


// All Locations GET Route
router.get('/', async function (req, res) {

    try {
        const locations = await Location.findAll({include: [{ 
            model: User, 
            attributes: ["username", "displayName", "icon"] 
        }]})

        const modifiedLocations = locations.map(location => {
            location.User.username = "@" + location.User.username;
            return location;
        });

        res.status(200).json({locations: modifiedLocations, resource: 'location'});
        
    } catch (error) {
        console.log(error, "location GET ALL error")
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }

})

// Locations GET All for user

router.get('/user/:username', async function (req, res) {
    // Do you want to add username to get route via retrieval of username from auth middleware? Or keep param as userID?
    const userObj = {
        username: '@benji123',
        userID: 1
    }

    try {
        let locations = await Location.findAll({ where: { userID: userObj.userID }, include: [{ 
            model: User, 
            attributes: ["id", "username", "displayName", "icon"] 
        }]});

        const modifiedLocations = locations.map(location => {
            location.User.username = "@" + location.User.username;
            return location;
        });

        res.status(200).json(modifiedLocations);

    } catch (error) {
        console.log(error, "error from get location for user")
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
})

// Locations search route
router.get('/search', async function (req, res) {
    console.log(req.query.q, 'req query');

    try {
        const locations = await Location.findAll({ where: {
            [Sequelize.Op.or]: [
                { name: { [Sequelize.Op.iLike]: `%${req.query.q}%` }},
                { content: { [Sequelize.Op.iLike]: `%${req.query.q}%` }}
            ]
        }})
        if (locations.length > 0) {
            res.status(200).json(locations)
        }  else {
            res.status(400).json({locMessage: "No locations found from this search"})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
})


// Location Get Route 4 single location?
router.get('/:locationID', async function (req, res) {
    const { locationID } = req.params;

    try {
        const location = await Location.findOne({ where: { id: locationID }, include: [ { model: User, attributes: ["id", "username", "displayName", "icon"] }]});
        console.log(location, 'queried location');
        res.status(200).json(location);

    } catch (error) {
        console.log(error, "location GET error");
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
})

// Locations POST Route
router.post('/create', async function (req, res) {
    const { content, coordinates, name, displayName, userID } = req.body
    // GET USERID and username FROM REQ.USER IN AUTH MIDDLEWARE and remove from req.body. remove hardcoded name and replace with displayname or username
    const header = `${displayName} was at ${name}`
    try {
        const location = await Location.create({ header, content, coordinates, name, userID: userID })

        const hash_tags = routeHelpers.checkForHashtag(location.content);

        if (hash_tags) {
            const hashtags = routeHelpers.extractHashtags(location.content);
            const storedHashtagsPromise  = hashtags.map(async (ht) => {
                const [hashtag, created] = await Hashtag.findOrCreate({ where: { name: ht }})
    
                if (hashtag) {
                    return await Location_Hashtag.create({ locationID: location.id, hashtagID: hashtag.id})
                } else {
                    return await Post_Hashtag.create({ locationID: location.id, hashtagID: created.id})
                }
            });
            
            const storedHashtags = await Promise.all(storedHashtagsPromise);
            const locationObj = {
                location: location,
                hashtags: storedHashtags
            }
            console.log(locationObj, "location obj");
            res.status(200).json(locationObj);
        } else {
            console.log(location, 'created location');
            res.status(200).json(location);
        }

    } catch (error) {
        console.log(error, "create location error")
        res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
})

module.exports = router;