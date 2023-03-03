const express = require("express");
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const errorMsg = require('../utilities/errorMessages');
const User = require('../models/user');

// Display Sign Up form on GET.
exports.user_sign_up_get = (req, res) => {
  res.render('sign-up-form', {
    title: 'Sign Up'
  })
};

// Handle Sign Up form on POST.
exports.user_sign_up_post = [
  body("first_name", "Please enter your first name")
    .trim()
    .isLength({min: 1})
    .escape(),
  body("last_name", "Please enter your last name")
    .trim()
    .isLength({min: 1})
    .escape(),
  body("username", "Please enter a username")
    .trim()
    .isLength({min: 3})
    .withMessage('Username must be at least 3 characters.')
    .escape(),
  body("password", "Please enter a password")
    .trim()
    .isLength({min: 5})
    .withMessage('Your password must be at least 5 characters')
    .escape(),
  body("confirm_password", 'Passwords must match.')
    .trim()
    .custom((value, { req }) => value === req.body.password),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.render('sign-up-form', {
        title: 'Sign Up',
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        errors: errorMsg.getErrorMessages(errors.array()),
      })
      return;
    }

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPassword,
        membership_status: false, // False by default, user has to register as member later
        admin: false // False by default, admin status must be granted later
      })
      user.save((err) => {
        if (err) {
          return next(err)
        }
        res.redirect('/');
      });
    });
  }
]

// Display user enrollment form on GET
exports.user_member_enroll_get = (req, res, next) => {
  res.send("NOT IMPLEMENTED: User enrollment GET")
}

// Display user enrollment form on POST
exports.user_member_enroll_post = (req, res, next) => {
  res.send("NOT IMPLEMENTED: User enrollment POST")
}


