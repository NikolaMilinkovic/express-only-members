const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');
const User = require('./models/user');
const passport = require('passport');


passport.use(
  new LocalStrategy({ usernameField: 'email' }, async(email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      const match = await bcryptjs.compare(password, user.password);

      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  const serializedUser = {
    id: user.id,
    access: user.access
  };

  done(null, serializedUser);
})
passport.deserializeUser(async (serializedUser, done) => {
  try {
    const user = await User.findById(serializedUser.id);
    done(null, user);
  } catch(err) {
    done(err);
  }
});


module.exports = passport;