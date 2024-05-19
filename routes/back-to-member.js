const express = require('express');
const asyncHandler = require("express-async-handler");
const User = require('../models/user');
const router = express.Router();

router.get('/', asyncHandler(async(req, res, next) => {
  if(req.isAuthenticated()){
    try{
      console.log(`User id is: ${req.user}`);
      const updateUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { access: 'Member' } },
        { new: true }
      );
      console.log(updateUser);

      return res.redirect('/')
    } catch(err){
      console.error("Error, something went wrong..:", err);
      next(err);
    }
  } else {
    return res.redirect('sign-in');
  }
}))


module.exports = router;