const express = require('express');
const asyncHandler = require("express-async-handler");
const Message = require('../models/message');
const Comment = require('../models/comment');
const router = express.Router();

// COMMENT
// messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
// userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// message: { type: String, required: true, minLength: 1 },
// timestamp: { type: Date, default: Date.now() }

// MESSAGE
// user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// title: { type: String, required: [true, 'Please enter a title'] },
// message: { type: String, required: [true, 'Please enter a message'] },
// timestamp: { type: Date, required: true, default: new Date() },
// likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
// comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
// numOfLikes: { type: Number, default: 0 },
/* GET home page and fetch messages. */
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
