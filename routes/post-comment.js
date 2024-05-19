const express = require('express');
const asyncHandler = require("express-async-handler");
const Message = require('../models/message');
const Comment = require('../models/comment');
const router = express.Router();

router.post('/', asyncHandler(async (req, res, next) => {
  try{
    const user = req.user;
    const messageId = req.query.messageId;
    const textAreaComment = req.body.message;

    if(textAreaComment.trim() !== ''){

      // Create new comment
      const newComment = new Comment({
        messageId: messageId,
        userId: user._id,
        comment: textAreaComment.trim(),
        timestamp: Date.now(),
      })
      const savedComment = await newComment.save();

      // Update corresponding message
      const updateMessage = await Message.findOneAndUpdate(
        { _id: messageId },
        { $push: { comments: savedComment._id }},
        { new: true }
      )
    res.redirect('/');
    }
  } catch(err){
    next(err);
  }
}));

module.exports = router;
