var express = require('express');
var path = require('path');
require('dotenv').config();
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { User } = require("./models");
const passport = require('passport')
require('./config/passport')(passport, User);
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pg = require('pg');
const bodyParser = require('body-parser');

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    'Access-Control-Allow-Origin': 'http://localhost:3001',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Credentials': 'true'
};

var indexRouter = require('./routes/index');
var userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const commentRouter = require('./routes/commentRoutes');
const locationRouter = require('./routes/locationRoutes');
const searchRouter = require('./routes/searchRoute');
const followRouter = require('./routes/followRoutes');
const likeRouter = require('./routes/likeRoutes');

var app = express();

app.use(logger('dev'));
app.use(cors(corsOptions));
// app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized:true}));

// const pgPool = new pg.Pool({
//     user: process.env.DBUSER,
//     host: process.env.DBHOST,
//     database: process.env.DBNAME,
//     password: process.env.DBPASS,
//     port: 5432,
//     max: 10000,
//     idleTimeoutMillis: 1 * 24 * 60 * 60 * 1000
// });

// app.use(session({
//     store: new pgSession({
//         pool: pgPool,
//         tableName : 'user_sessions'
//     }),
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 3 * 24 * 60 * 60 * 1000 } // 3 days
//   }));
app.use(bodyParser.json())
// app.use(passport.initialize())
// app.use(passport.session())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/locations', locationRouter);
app.use('/search', searchRouter);
app.use('/follow', followRouter);
app.use('/like', likeRouter);




module.exports = app;
