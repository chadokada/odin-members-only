const passport = require("passport");

// Display log in page on GET
exports.log_in_get = (req, res, next) => {
  res.render('log-in-form', {
    title: 'Log In'
  })
};

/*
// Handle user log in on POST
exports.log_in_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in-failed'
});
*/

exports.log_in_post = [
  passport.authenticate('local', {failureRedirect: '/log-in-failed', failureMessage: 'Incorrect password or username'}),
  (req, res) => {
    res.redirect('/')
  }
]

// Handle user log out on POST
exports.log_out = (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/')
  });
};

exports.log_in_failed = (req, res, next) => {
  res.render('log-in-form', {
    title: 'Log In',
    errors: {password: req.session.messages[0]}
  })
}