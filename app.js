require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcryptjs');


///
/// PASSPORT **********************************************************************
///
const session = require("express-session");
const passport = require("passport");
require('./config/passport-config')(passport);
///
/// *******************************************************************************
///

var app = express();

///
/// PASSPORT ********************************************************************
///
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
})
///
/// *******************************************************************************
///


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const appRouter = require('./routes/routes');



// Set up mongoose connection
const mongoose = require('mongoose');
const { mainModule } = require('process');
mongoose.set('strictQuery', false);
const mongoDb = process.env.DB_URL;

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDb);
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/', appRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
