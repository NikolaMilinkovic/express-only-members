const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasswordsSchema = new Schema({
  member_password: { type: String, required: true },
  admin_password: { type: String, required: true }
});

module.exports = mongoose.model("Passwords", PasswordsSchema);