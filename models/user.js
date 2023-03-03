const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {type: String, required: true, maxLength: 100},
  last_name: {type: String, required: true, maxLength: 100},
  username: {type: String, required: true, maxLength: 40},
  password: {type: String, required: true},
  membership_status: {type: Boolean},
  admin: {type: Boolean}
})

// Virtual for User's URL
UserSchema.virtual("url").get(function() {
  return `/users/${this.username}`;
});

module.exports = mongoose.model("User", UserSchema);