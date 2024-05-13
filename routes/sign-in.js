const express = require('express');
const asyncHandler = require("express-async-handler");
const User = require('../models/user')
const router = express.Router();

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  res.render('sign-in');
}));


module.exports = router;
