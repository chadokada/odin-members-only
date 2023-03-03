const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: {type: String, required: true, maxLength: 100},
  timestamp: {type: Date, required: true},
  user: {type: Schema.Types.ObjectId, ref: "User", required: true},
  message_body: {type: String, required: true, maxLength: 500}
});

// Virtual for Message's URL
MessageSchema.virtual("url").get(function() {
  return `/messages/${this._id}`;
});

module.exports = mongoose.model("Message", MessageSchema)