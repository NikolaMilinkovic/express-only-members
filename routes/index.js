const express = require('express');
const asyncHandler = require("express-async-handler");
const Message = require('../models/message')
const router = express.Router();

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  const messages = await Message.find().sort({ timestamp: -1 })
  if(req.isAuthenticated()){
    res.render('index', { messages: messages });
  } else {
    res.render('index', { messages: messages });
  }
}));

module.exports = router;
