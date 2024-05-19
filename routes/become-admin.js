const express = require('express');
const asyncHandler = require("express-async-handler");
const User = require('../models/user');
const Password = require('../models/access-passwords')
const router = express.Router();

router.get('/', asyncHandler(async (req, res, next) => {
  if(req.isAuthenticated()){
    return res.render('become-admin', { errors: [], data: {} });
  } else {
    return res.redirect('sign-in');
  }
}));

router.post('/', asyncHandler(async(req, res, next) => {
  if(req.isAuthenticated()){
    try{
      const passwords = await Password.find();

      if(passwords.length > 0 && req.body.password === passwords[0].admin_password){

        console.log(`User id is: ${req.user}`);
        const updateUser = await User.findOneAndUpdate(
          { _id: req.user._id },
          { $set: { access: 'Admin' } },
          { new: true }
        );
        console.log(updateUser);

        return res.redirect('/')
      } else {
        return res.render('become-admin', { error: {
          message: 'Incorrect password, its right there.. <br>How did you manage to mess that up?',
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