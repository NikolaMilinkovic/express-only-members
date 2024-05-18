const express = require('express');
const asyncHandler = require("express-async-handler");
const Message = require('../models/message');
const router = express.Router();

/* GET home page and fetch messages. */
router.get('/', asyncHandler(async (req, res, next) => {
  try{
    const messages = await Message.find()
      .populate('user', 'full_name')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          model: 'User',
          select: 'full_name'
        }
      })
      .sort({ timestamp: 1 })
      .exec();

    // With Chatgipity help cus i suck at programming and dates :)
    messages.forEach(message => {
      message.formattedTimestamp = message.timestamp.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format
        timeZone: 'UTC' // Display time without timezone offset
      })
    });

    res.render('index', {messages, currentUser: req.user});
  } catch(err){
    next(err);
  }
}));

module.exports = router;
