const express = require('express');
const asyncHandler = require("express-async-handler");
const Message = require('../models/message');
const Comment = require('../models/comment');
const router = express.Router();

router.get('/', asyncHandler(async (req, res, next) => {
  try{
    const commentId = req.query.commentId;
    const messageId = req.query.messageId;
    const message = await Message.findOne({ _id: messageId });
    console.log(message)

    // Remove comment from message
    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId },
      { $pull: { comments: commentId } },
      { new: true }
    )
    console.log(updatedMessage)

    // Remove comment
    const removedComment = await Comment.findOneAndDelete({ _id:commentId });

    return res.redirect('/');
    } catch(err){
    console.error('Error while removing the post ' + err);
    next(err);
  }
}));

module.exports = router;
