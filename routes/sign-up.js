const express = require('express');
const asyncHandler = require("express-async-handler");
const User = require('../models/user')
const router = express.Router();
const bcryptjs = require('bcryptjs');

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  res.render('sign-up');
}));

router.post("/", async(req, res, next) => {
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
});

module.exports = router;
