const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String, required: true, minLength: 1 },
    timestamp: { type: Date, default: Date.now() }
})

module.exports = mongoose.model("Comment", CommentSchema);