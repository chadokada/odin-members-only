require('dotenv').config();
const async = require('async');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const errorMsg = require('../utilities/errorMessages');
const User = require('../models/user');
const Message = require('../models/message');

// Display Sign Up form on GET.
exports.user_sign_up_get = (req, res) => {
  res.render('sign-up-form', {
    title: 'Sign Up'
  });
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
    .isLength({min: 5})
    .withMessage('Your password must be at least 5 characters')
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
    
    User.find({username: req.body.username})
      .exec(function(err, found_user) {
        if(err) {
          console.log(err)
          return next(err)
        } else {
          if (found_user.length === 0) {
            // Username does not exist, so allow user to sign up
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
          } else {
            const errors = {username: "Username already exists. Please choose a new one"}
            res.render('sign-up-form', {
              title: 'Sign Up',
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              username: req.body.username,
              errors: errors,
            })
            return;
          };
        };
      });
  }
]

// Display user enrollment form on GET
exports.user_member_enroll_get = (req, res, next) => {
  if(!res.locals.currentUser) {
    res.redirect('/log-in');
  }
  if(res.locals.currentUser.membership_status){
    res.redirect('/settings');
  }
  res.render('become-a-member')
};

// Display user enrollment form on POST
exports.user_member_enroll_post = [
  body('membership_code', 'Membership code is blank')
    .trim()
    .isLength( {min: 1} )
    .custom((value, { req }) => value === process.env.MEMBERSHIP_CODE)
    .withMessage('Incorrect membership code.')
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const currentUser = res.locals.currentUser;

    if(!errors.isEmpty()) {
      res.render('become-a-member', {
        errors:errors.array()
      });
      return;
    };

    const user = new User({
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      username: currentUser.username,
      password: currentUser.password,
      membership_status: true,
      admin: currentUser.admin,
      _id: currentUser._id
    });

    User.findByIdAndUpdate(currentUser._id, user, {}, (err, theuser) => {
      if(err) {
        return next(err);
      };
      res.redirect('/settings');
    });
  },
];

exports.user_profile_page = (req, res, next) => {
  // need to look up user in DB
  res.render('user-profile', {
    user: req.params.username
  });
};

// Display user setting page on GET
exports.user_setting_page = (req, res, next) => {
  if(!res.locals.currentUser) {
    res.redirect('/log-in');
    next();
  };
  res.render('user-settings');
};

// Display moderator verification page on GET
exports.moderator_verification_get = (req, res, next) => {
  // User needs to log in first
  if(!res.locals.currentUser) {
    res.redirect('/log-in');
  }
  // User needs to be a member in order to be a moderator
  if(!res.locals.currentUser.membership_status){
    res.redirect('/become-a-member');
  }
  res.render('moderator-verification-form')
};

// Display moderator verification page on POST
exports.moderator_verification_post = [
  body('moderator_code', 'Moderator code is blank')
    .trim()
    .isLength( {min: 1} )
    .custom((value, { req }) => value === process.env.MODERATOR_CODE)
    .withMessage('Incorrect moderator code.')
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const currentUser = res.locals.currentUser;

    if(!errors.isEmpty()) {
      res.render('mod-verification', {
        errors:errors.array()
      });
      return;
    };

    const user = new User({
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      username: currentUser.username,
      password: currentUser.password,
      membership_status: currentUser.membership_status,
      moderator: true,
      _id: currentUser._id
    });

    User.findByIdAndUpdate(currentUser._id, user, {}, (err, theuser) => {
      if(err) {
        return next(err);
      };
      res.redirect('/settings');
    });
  },  
];