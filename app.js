const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const cors = require('cors');
const { body, validationResult } = require("express-validator");


// ===============[ MongoDB connection ]=============== //
const conn_string = process.env.DB_CONN;
mongoose.connect(conn_string);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

// Runs once to add a new document
// db.once('open', async () => {
//   console.log('MongoDB connected...');
//   const Passwords = require('./models/access-passwords');
//   try {
//     const newPasswords = new Passwords({
//       member_password: 'member_me!',
//       admin_password: 'admin_me!'
//     });
//     await newPasswords.save();
//     console.log('Password document inserted');
//   } catch (err) {
//     console.error('Error inserting password document:', err);
//   }
// });
// ===============[ \MongoDB connection ]=============== //


const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.options('*', cors());

// =====================[ PASSPORT AUTHENTICATION ]=====================
// Imports Passport Auth methods from passport.js
const passportAuth = require('./passport');
// =====================[ \PASSPORT AUTHENTICATION ]=====================

// =====================[ ROUTES ]=====================
const indexRouter = require('./routes/index');
const signUpRouter = require('./routes/sign-up');
const signInRouter = require('./routes/sign-in');
const newMessageRouter = require('./routes/new-message');
const becomeMemberRouter = require('./routes/become-member');
const becomeGuestRouter = require('./routes/become-guest');
const likeRouter = require('./routes/like');
const postCommentRouter = require('./routes/post-comment');


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use('/', indexRouter);
app.use('/sign-up', signUpRouter);
app.use('/sign-in', signInRouter);
app.use('/new-message', newMessageRouter);
app.use('/become-member', becomeMemberRouter);
app.use('/become-guest', becomeGuestRouter);
app.use('/like', likeRouter);
app.use('/post-comment', postCommentRouter);

// NOTE, STALNO FEJLUJE LOGIN
app.post(
  "/sign-in",[
    body("email")
      .trim()
      .isLength({ min:5 })
      .withMessage('Incorrect email address')
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min:4 })
      .withMessage('Password must be at least 4 characters long'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, 
      // re-render the sign-in page with error messages
      return res.render('sign-in', {
        errors: errors.array(),
        data: req.body
      });
    }
    next();
  },
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        // If authentication failed, render the sign-in page with the error message
        if(info.userErrorMessage){
          return res.render('sign-in', { noUser: {
            userError: info.userErrorMessage
          }, data: req.body });
        }
        if(info.passwordErrorMessage){
          return res.render('sign-in', { noUser: {
            passwordError: info.passwordErrorMessage
          }, data: req.body });
        }
      }
      if (!user) {
        // If authentication failed, render the sign-in page with the error message
        return res.render('sign-in', { noUser: {
          userError: info.message
        }, data: req.body });
      }
      // If authentication succeeded, redirect to the home page or another page
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    })(req, res, next);
  }
);
app.get("/sign-out", (req, res, next) => {
  req.logout((err) => {
    if(err){
      return next(err)
    }
    res.redirect("/");
  })
})
// =====================[ \ROUTES ]=====================




// =====================[ ERROR HANDLERS ]=====================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// =====================[ \ERROR HANDLERS ]=====================


module.exports = app;
