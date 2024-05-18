const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: [true, 'Please enter a title'] },
  message: { type: String, required: [true, 'Please enter a message'] },
  timestamp: { type: Date, required: true, default: new Date() },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  numOfLikes: { type: Number, default: 0 },
})

module.exports = mongoose.model("Message", MessageSchema);