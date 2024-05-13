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

// MongoDB connection
const conn_string = process.env.DB_CONN;
mongoose.connect(conn_string);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));



const app = express();

// view engine setup
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

// =====================[ PASSPORT AUTHENTICATION ]=====================
passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  // const serializedUser = {
  //   user_id: user.id,
  //   user_access: user.access
  // };
  done(null, user.id);
})
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  }
});
// NOTE, STALNO FEJLUJE LOGIN
app.post(
  "/sign-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-up"
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
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
// =====================[ \PASSPORT AUTHENTICATION ]=====================
const indexRouter = require('./routes/index');
const signUpRouter = require('./routes/sign-up');
const signInRouter = require('./routes/sign-in');

app.use('/', indexRouter);
app.use('/sign-up', signUpRouter);
app.use('/sign-in', signInRouter);

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

module.exports = app;
