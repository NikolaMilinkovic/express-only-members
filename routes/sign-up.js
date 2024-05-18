const express = require('express');
const asyncHandler = require("express-async-handler");
const User = require('../models/user')
const router = express.Router();
const bcryptjs = require('bcryptjs');
const { body, validationResult } = require("express-validator");


/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  res.render('sign-up');
}));

router.post("/",[
  body("full_name")
    .trim()
    .isLength({ min:2 })
    .withMessage('Name must be at least 2 characters long')
    .escape(),
  body("email")
    .trim()
    .isLength({ min:5 })
    .withMessage('Please enter your email address')
    .normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min:4 })
    .withMessage('Password must be at least 4 characters long'),

], async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Use this to see the returned data
    // return res.status(422).json({ errors: errors.array() });

    // Pass down errors and data
    return res.render('sign-up', {
      errors: errors.array(),
      data: req.body
    })
  } else {
  bcryptjs.hash(req.body.password, 10, async(err, hashedPassword) => {
    try{
      const user = new User({
        full_name: req.body.full_name,
        email: req.body.email,
        password: hashedPassword,
        access: "Guest",
        created_at: new Date(),
      })
  
      const result = await user.save();
      res.redirect('/sign-in')
    } catch(err){
      return next(err);
    }
  });
}});

module.exports = router;
