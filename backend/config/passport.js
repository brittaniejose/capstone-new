const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = function(passport, user) { 
    const User = user;
    passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
    }, async function (req, username, password, done) { 
        try {
            const existingUser = await User.findOne({where: { [Op.or]: [{ username: username }, { email: req.body.email }] }})
            if (existingUser) {
                return done(null, false, { message: "The email or username is already registered. Please login." })
            } else {
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(password, salt);
                const data = {displayName: req.body.displayName, username: req.body.username, email: req.body.email, password: hashedPassword};
                
                const user = await User.create({data});
                console.log(user, 'newUser created');

                return done(null, user);
            }
        } catch (error) {
            if(error instanceof Sequelize.ValidationError){
                let message = error.errors.map(e => e.message).join(', ');
                return done(null, false, {message});
            }else{
                console.log(error, 'other errors')
                return done(error);
            }
        }
    }));
}

// const generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
// };
// User.findOne({where: { [Sequelize.Op.or]: [{ username: username }, { email: req.body.email }] }
// }).then(function (user) {
//     if(!user) {
//         const userPassword = generateHash(password);
//         const data = {displayName: req.body.displayName, username: username, email: req.body.email, password: userPassword};
//         User.create(data).then(function(newUser) {
//             if (!newUser) {
//                 return done(null, false);
//             } else {
//                 return done(null, newUser);
//             }
//         })
//     } else if (user.username === username) {
//         return done(null, false, {
//             message: "This username is already taken"
//         })
//     } else {
//         return done(null, false, {
//             message: "This email is already registered"
//         })
//     }
// })

// async function (req, done) {
//     try {
//     // Hash the password
//     const salt =  await bcrypt.genSalt();
//     const hashedPassword =  await bcrypt.hash(req.body.password, salt);
//     // Create the new user
//     const data = {displayName: req.body.displayName, username: req.body.username, email: req.body.email, password: hashedPassword};
//     const user = await User.create(data);
//     return done(null, user);
// } catch (err) {
//     if(err instanceof Sequelize.ValidationError){
//         let message = err.errors.map(e => e.message).join(', ');
//         return done(null, false, {message});
//     }else{
//         console.log(err, 'custom error validation')
//         return done(err);
//     }
// }

// const generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
// };
// User.findOne({where: { [Sequelize.Op.or]: [{ username: username }, { email: email }] }
// }).then(function (user) {
//     if (user.email) {
//         return done(null, false, {
//             message: "This email is already registered"
//         })
//     } else if (user.username) {
//         return done(null, false, {
//             message: "This username is already taken"
//         })
//     } else {
//         const userPassword = generateHash(password);
//         const data = {displayName, username, email, password: userPassword};
//         User.create(data).then(function(newUser) {
//             if (!newUser) {
//                 return done(null, false);
//             } else {
//                 return done(null, newUser);
//             }
//         })
//     }
// })

// try {
//     // Hash the password
//     const salt =  bcrypt.genSalt();
//     const hashedPassword =  bcrypt.hash(password, salt);
//     // Create the new user
//     const user =  User.create({
//         displayName, 
//         username,
//         email,
//         password: hashedPassword
//     });
//     done(null, user);
// } catch (err) {
//     if(err instanceof Sequelize.ValidationError){
//         let message = err.errors.map(e => e.message).join(', ');
//         done(null, false, {message});
//     }else{
//         console.log(err, 'custom error validation')
//         done(err);
//     }
// }

// passport.use('local-signup', new LocalStrategy(
//     async function(username, email, password, done) {
//         try {
//             const existingUser = await User.findOne({ where: { username, email } })
//             if (!existingUser) {
//                 const salt = await bcrypt.genSalt();
//                 const hashedPassword = await bcrypt.hash(password, salt);
            
//                 const user = await User.create({ displayName, username, email, password: hashedPassword });
//                 console.log(user, 'newUser created');

//                 return done(null, user);
//             } else {
//                 return done(null, false, { message: "You are already registered. Please login." })
//             }
//         } catch (error) {
//             return done(error)
//         }
//     })
// )

passport.serializeUser(function(user, done) {
    done(null, { id: user.id, username: user.username, email: user.email });
  });

  passport.deserializeUser(function (id, done) {
    User.findByPk(id).then(function (user) {
        if (user) {
            done(null, user.get());
        } else {
            done(user.errors, null);
        }
    });
});