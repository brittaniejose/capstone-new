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
  let errors = { msg: '' }
  
  if (message === "username must be unique") {
    errors.msg = "This username is already taken"
  } 

  if (message === "Validation len on username failed") {
    errors.msg = "Username must be between 4 and 25 characters"
  }
  
  if (message === "email must be unique") {
    errors.msg = "This email is already registered"
  } 
  
  if (message === "Validation isEmail on email failed") {
    errors.msg = "Must be a valid email"
  }

  if (message === "Validation len on password failed") {
    errors.msg = "Password must be at least 6 characters"
  }
  
  if (message.includes("null")) {
    errors.msg = "Username, Email, and Password fields must be entered"
  }
  return errors;
}
//Token Creation
const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({id}, process.env.SESSION_SECRET, {expiresIn: maxAge})
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
    const token = createToken(newUser.id);

    const authUser = {
      user: newUser,
      token: token,
      message: "Thank you for joining. Redirecting you to the homepage."
    };

    res.status(200).json(authUser);
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
    return res.status(400).json({ errorMsg: "Username or Email is required" });
  }
  
  try {
    const existingUser = await User.findOne({ where: { [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }] } });
    console.log(existingUser, "user from query")
    if(existingUser) {
      const auth = await bcrypt.compare(password, existingUser.password);
      if (auth) {
        const token = createToken(existingUser.id);
        const authUser = {
          user: existingUser,
          token: token,
          message: "Login Successful"
        }
        res.status(200).json(authUser)
      } else {
        res.status(400).json({errorMsg: "Password Incorrect"})
      }
    } else {
      res.status(400).json({errorMsg: "No user found with these credentials"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({serverMessage: "Our server is experiencing some issues. Please try again later"})
  }
});

module.exports = router;
