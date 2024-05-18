const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
  full_name: { type: String, required: [true, 'Please enter a valid full name'] },
  email: { type: String, required: [true, 'Please enter a valid email adress'], unique: [true, 'Email already registered'] },
  password: { type: String, required: [true, 'Please enter a valid password'] },
  access: { type: String, required: true, default: "Guest" },
  messages_liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
  created_at: { type: Date, required: true, default: Date.now() },
})

module.exports = mongoose.model("User", UserSchema);