const express = require('express');
const asyncHandler = require("express-async-handler");
const Passwords = require('../models/access-passwords');
const User = require('../models/user');
const router = express.Router();

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  if(req.isAuthenticated()){
    return res.render('become-member', { errors: [], data: {} });
  } else {
    return res.redirect('sign-in');
  }
}));

router.post('/', asyncHandler(async(req, res, next) => {
  if(req.isAuthenticated()){
    try{
      const passwords = await Passwords.find()
      // console.log("Fetched documents from DB:", passwords);
      console.log(`Current user object: ${req.user}`);
      if(passwords.length > 0 && req.body.password === passwords[0].member_password){
        // console.log(`User id is: ${req.user}`);
        const updateUser = await User.findOneAndUpdate(
          { _id: req.user._id },
          { $set: { access: 'Member' } },
          { new: true }
        );
        console.log(updateUser);

        return res.redirect('/')
      } else {
        return res.render('become-member', { error: {
          message: 'Incorrect passwords, its right there.. <br>How did you manage to mess that up?',
        }})
      }
    } catch(err){
      console.error("Error, something went wrong..:", err);
      next(err);
    }
  } else {
    return res.redirect('sign-in');
  }
}))


module.exports = router;