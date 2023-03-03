const express = require("express");
const bcrypt = require('bcryptjs');
const session = require("express-session");
const { body, validationResult } = require('express-validator');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user');

const app = express();
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passswords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      })


    });
  })
)

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// Display log in page on GET
exports.log_in_get = (req, res, next) => {
  res.render('log-in-form', {
    title: 'Log In'
  })
};

// Display user enrollment form on POST
exports.log_in_post = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Log in POST")
};

