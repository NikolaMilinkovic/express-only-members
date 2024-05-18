const express = require('express');
const asyncHandler = require("express-async-handler");
const Message = require('../models/message');
const User = require('../models/user');
const router = express.Router();

router.get('/', asyncHandler(async (req, res, next) => {
  if(req.isAuthenticated()){
    try{
      const messageId = req.query.messageId;
      const message = await Message.findOne({ _id: messageId })
      console.log(message);
      if(message){
        let userLiked = false;

        // Check to see if user has already like the message
        for(let i = 0; i < message.likedBy.length; i++){
          if(message.likedBy[i].toString() === req.user.id){
            userLiked = true;
          }
        }

        if(userLiked){
          const updateMessage = await Message.findOneAndUpdate(
            { _id: messageId },
            { $pull: { likedBy: req.user.id }, $inc: { numOfLikes: -1 } },
            { new: true }
          )
          const updateUser = await User.findOneAndUpdate(
            { _id: req.user.id },
            { $pull: { messages_liked: messageId } },
            { new: true }
          )
        } else {
          const updateMessage = await Message.findOneAndUpdate(
            { _id: messageId },
            { $push: { likedBy: req.user.id }, $inc: { numOfLikes: +1 } },
            { new: true }
          )
          const updateUser = await User.findOneAndUpdate(
            { _id: req.user.id },
            { $push: { messages_liked: messageId } },
            { new: true }
          )
        }
        return res.redirect('/');
      }     
    } catch(err){
      console.error('Error while liking the message' + err);
      next(err)
    }
  } else {
    return res.redirect('sign-in');
  }
}));

module.exports = router;