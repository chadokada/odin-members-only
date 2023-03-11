const Message = require('../models/message');

exports.home = (req, res, next) => {
  Message.find({}, 'title timestamp user message_body')
    .sort({ timestamp: 1 })
    .populate('user')
    .exec(function(err, messages) {
      if(err) {
        return next(err);
      }
      res.render("home", {
        title: "Members Only",
        messages: messages
      })
    })

}