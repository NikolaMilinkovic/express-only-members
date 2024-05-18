const express = require('express');
const asyncHandler = require("express-async-handler");
// const User = require('../models/user')
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
  if(req.body.password === 'test'){
    return res.redirect('/')
  } else {
    return res.render('become-member')
  }
}))


module.exports = router;