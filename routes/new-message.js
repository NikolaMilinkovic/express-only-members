const express = require('express');
const asyncHandler = require("express-async-handler");
const Message = require('../models/message');
const User = require('../models/user');
const router = express.Router();
const bcryptjs = require('bcryptjs');



// user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// title: { type: String, required: [true, 'Please enter a title'] },
// message: { type: String, required: [true, 'Please enter a message'] },
// timestamp: { type: Date, required: true, default: Date.now },
// likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
// comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
// numOfLikes: { type: Number, default: 0 },


router.post("/", async(req, res, next) => {
    try{
      const message = new Message({
        user: req.user.id,
        title: req.body.title,
        message: req.body.message,
        timestamp: new Date(),
        likedBy: [],
        comments: [],
        numOfLikes: 0,
      })
  
      const result = await message.save();
      res.redirect('/')
    } catch(err){
      return next(err);
    }
});

module.exports = router;
