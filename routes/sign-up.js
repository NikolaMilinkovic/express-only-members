const express = require('express');
const asyncHandler = require("express-async-handler");
const User = require('../models/user')
const router = express.Router();

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  res.render('sign-up');
}));

router.post("/", async(req, res, next) => {
  try{
    const user = new User({
      full_name: req.body.full_name,
      email: req.body.email,
      password: req.body.password,
      access: "Guest",
      created_at: new Date(),
    })

    const result = await user.save();
    res.redirect('/sign-in')
  } catch(err){
    return next(err);
  }
})

module.exports = router;
