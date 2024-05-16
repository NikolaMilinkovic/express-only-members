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


// ===============[ MongoDB connection ]=============== //
const conn_string = process.env.DB_CONN;
mongoose.connect(conn_string);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));
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


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use('/', indexRouter);
app.use('/sign-up', signUpRouter);
app.use('/sign-in', signInRouter);


// NOTE, STALNO FEJLUJE LOGIN
app.post(
  "/sign-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
  })
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
