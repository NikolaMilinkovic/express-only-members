const express = require('express');
const asyncHandler = require("express-async-handler");
const Message = require('../models/message');
const router = express.Router();

/* GET home page and fetch messages. */
router.post('/', asyncHandler(async (req, res, next) => {
  try{
    res.redirect('/');
  } catch(err){
    next(err);
  }
}));

module.exports = router;
