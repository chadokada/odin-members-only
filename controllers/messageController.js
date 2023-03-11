const { body, validationResult } = require('express-validator');
const errorMsg = require('../utilities/errorMessages');
const User = require('../models/user');
const Message = require('../models/message');
const { DateTime } = require('luxon');
const mongoose = require('mongoose');

exports.add_message_get= (req, res, next) => {
  if(!res.locals.currentUser) {
    res.redirect('/log-in');
  }
  res.render('add-message', {
    title: 'Add Message'
  })
}

exports.add_message_post = [
  body('message_title', 'Message must have a title')
    .trim()
    .isLength({min: 10})
    .withMessage('Title must be at least 10 characters.')
    .escape(),
  body('message_body', 'Message is blank')
    .trim()
    .isLength({min: 10})
    .withMessage('Message must be at least 10 characters.')
    .escape(), 
  
  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.render('add-message', {
        title: 'Add Message',
        message_title: req.body.message_title,
        message_body: req.body.message_body,
        errors: errorMsg.getErrorMessages(errors.array())
      });
      return;
    }

    User.findById(res.locals.currentUser.id)
      .exec((err, user) => {
        if(err) {
          return next(err)
        }
        if (user == null) {
          const err = new Error('Cannot find user');
          err.status = 404;
          return next(err)
        }
        const timestamp = DateTime.now().toISO();

        const message = new Message({
          title: req.body.message_title,
          timestamp: timestamp,
          user: user,
          message_body: req.body.message_body
        })
        message.save((err) => {
          if(err) {
            return next(err);
          }
          res.redirect('/');
        })
      })
  }
]

//DateTime.now().toISO()