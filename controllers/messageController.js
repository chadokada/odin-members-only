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
    .withMessage('Title must be at least 10 characters.'),
    //.escape(),
  body('message_body', 'Message is blank')
    .trim()
    .isLength({min: 10})
    .withMessage('Message must be at least 10 characters.'),
    //.escape(), 
  
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
];

exports.delete_message_get = (req, res, next) => {
  if(!res.locals.currentUser || !res.locals.currentUser.moderator) {
    res.redirect('/');
  };

  Message.findById(req.params.id)
    .populate('user')
    .exec((err, message) => {
      if(err) {
        return next(err);
      };
      if(message == null) {
        const err = new Error('Inventory not found');
        err.status = 404;
        return next(err);
      };
      res.render('delete-message', {
        title: 'Delete Message:',
        message
      })
    })
}

exports.delete_message_post = (req, res, next) => {
  if(!res.locals.currentUser || !res.locals.currentUser.moderator) {
    res.redirect('/');
  };
  
  Message.findById(req.body.messageid)
    .exec((err, message) => {
      if(err) {
        return next(err);
      };
      if(message == null) {
        const err = new Error('Message not found');
        err.status = 404;
        return next(err);
      };
      Message.findByIdAndRemove(req.body.messageid, (err) => {
        if (err) {
          return next(err);
        };
        res.redirect('/');
      })
    })
}