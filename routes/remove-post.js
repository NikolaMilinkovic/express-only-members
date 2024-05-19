const express = require('express');
const asyncHandler = require("express-async-handler");
const Message = require('../models/message');
const Comment = require('../models/comment');
const User = require('../models/user');
const { findOneAndDelete } = require('../models/user');
const router = express.Router();

router.get('/', asyncHandler(async (req, res, next) => {
  try{
    const user = req.user;
    const messageId = req.query.messageId;
    const message = await Message.findOne({ _id: messageId });

    // REMOVE ALL COMMENTS []
    for (const commentId of message.comments) {
      try {
        const result = await Comment.findOneAndDelete({ _id: commentId });
      } catch (err) {
        console.error(`Failed removing ${commentId} from comments array.`);
        next(err);
      }
    }

    for(const userId of message.likedBy) {
      try{
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $pull: { messages_liked: messageId } },
          { new: true }
        )
        console.log(updatedUser);
      } catch(err){
        console.error('Failed removing like from user ' + err);
        next(err);
      }
    }

    const result = await Message.findOneAndDelete({ _id: messageId })
    console.log(result)
      
    res.redirect('/');
    } catch(err){
    console.error('Error while removing the post ' + err);
    next(err);
  }
}));

module.exports = router;
