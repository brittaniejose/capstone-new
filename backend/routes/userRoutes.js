var express = require('express');
const bcrypt = require("bcrypt");
var router = express.Router();
const { User } = require("../models");
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

router.get('/signup', function(req, res, next) {
  console.log('signup GET fired')
  res.json({message: "signup page"});
});


function signupErrors(message) {
  let errors = { username: '', email: '', password: '', nullVal: '' }
  
  if (message === "username must be unique") {
    errors.username = "This username is already taken"
  } 

  if (message === "Validation len on username failed") {
    errors.username = "Username must be between 4 and 25 characters"
  }
  
  if (message === "email must be unique") {
    errors.email = "This email is already registered"
  } 
  
  if (message === "Validation isEmail on email failed") {
    errors.email = "Must be a valid email"
  }

  if (message === "Validation len on password failed") {
    errors.password = "Password must be at least 6 characters"
  }
  
  if (message.includes("null")) {
    errors.nullVal = "Username, Email, and Password fields must be entered"
  }
  return errors;
}

router.post('/signup', async function(req, res) {
  const { displayName, username, email, password } = req.body;
  console.log('signup POST fired')

  try {
    const user = await User.build({ displayName, username, email, password: password });
    await user.validate();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const newUser = await User.create({ displayName, username, email, password: hashedPassword });
    console.log(newUser, 'newUser created');


    const userObj = {
      user: newUser,
      message: "Thank you for joining. Redirecting you to the homepage."
    };

    res.status(200).json(userObj);
  } catch (error) {
    if(error instanceof Sequelize.ValidationError){
      let message = error.errors.map(e => e.message).join(', ');

      const errors = signupErrors(message);
      res.status(400).json({errors});
    } else {
      res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
    }
  }
});

router.get('/login', function (req, res) {
  console.log('login GET fired')
  res.json({message: "login page"})
});

router.post('/login', async function (req, res) {
  console.log('login POST fired')

  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail) {
    return res.status(400).json({ nullMessage: "Username or Email is required" });
  }
  
  try {
    const existingUser = await User.findOne({ where: { [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }] } });
    console.log(existingUser, "user from query")
    if(existingUser) {
      const auth = await bcrypt.compare(password, existingUser.password);
      if (auth) {
        const authUser = {
          user: existingUser,
          message: "Login Successful"
        }
        res.status(200).json(authUser)
      } else {
        res.status(400).json({passMessage: "Password Incorrect"})
      }
    } else {
      res.status(400).json({noUserMessage: "No user found with these credentials"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
  }
});

module.exports = router;
