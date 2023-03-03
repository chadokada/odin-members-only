#! /usr/bin/env node

console.log('This script populates some test categories, items, locations, and inventory items to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/?retryWrites=true&w=majority');

require('dotenv').config();
const async = require('async');
const User = require('./models/user');
const Message = require('./models/message');
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');
const mongoDB = process.env.DB_URL;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const users = [];
const messages = [];

function userCreate(first_name, last_name, username, password, membership_status = false, admin = false, cb){
  
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    const userDetail = {
      first_name: first_name,
      last_name: last_name,
      username: username,
      password: hashedPassword,
      membership_status: membership_status,
      admin: admin
    };  
    const user = new User(userDetail);

    user.save(function (err) {
      if (err) {
        cb(err, null);
        return;
      }
      console.log('New User: ' + username)
      users.push(user);
      cb(null, user)
    })
  })
};

function messageCreate(title, timestamp, user, message_body, cb){
  const messageDetail = {
    title: title,
    timestamp: timestamp,
    user: user,
    message_body: message_body
  }

  const message = new Message(messageDetail);

  message.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Message: ' + message_body);
    cb(null, user);
  })
}

function createUsers(cb) {
  async.series([
    function(callback) {
      userCreate('Amelia', 'Johnson', 'ajohnson', '123456', true, false, callback)
    },
    function(callback) {
      userCreate('Marcus', 'Lee', 'mlee', '123456', true, false, callback)
    },
    function(callback) {
      userCreate('Isabella', 'Hernandez', 'ihernandez', '123456', true, false, callback)
    },
    function(callback) {
      userCreate('Nathan', 'Patel', 'npatel', '123456', true, false, callback)
    },
    function(callback) {
      userCreate('Sophia', 'Nguyen', 'snguyen', '123456', true, false, callback)
    },
  ], 
  cb);
};

function createMessages(cb) {
  async.series([
    function(callback) {
      messageCreate('The Future of Renewable Energy', '2023-01-04', users[0],
      `
      Hello everyone, I'm interested in hearing your thoughts on the future of 
      renewable energy. Do you think we'll be able to transition away from 
      fossil fuels completely? What are some of 
      the challenges we'll need to overcome to make this happen? Let's discuss!
      `, callback)
    },
    function(callback) {
      messageCreate('Favorite Books of All Time', '2023-01-05', users[1],
      `
      Hi everyone, I'm an avid reader and always looking for new books to read. 
      I thought it would be fun to hear everyone's favorite books of all time. 
      What book(s) have had the biggest impact on you? Why do you love it? Let's
       share our favorite books and maybe discover some new ones!
      `, callback)
    },
    function(callback) {
      messageCreate('Tips for Staying Productive While Working from Home', '2023-01-06', users[2],
      `
      Hi all, with many of us working from home these days, I thought it would 
      be helpful to share some tips and tricks for staying productive. What are 
      some strategies you use to stay focused and avoid distractions? Let's 
      share our best practices for getting work done from home.
      `, callback)
    },
    function(callback) {
      messageCreate('Travel Destinations Bucket List', '2023-01-07', users[3],
      `
      Hey everyone, I love traveling and exploring new places. I'm curious to 
      know what destinations are on your bucket list. Where do you dream of 
      going? Why does this place appeal to you? Let's inspire each other and 
      share our travel aspirations!
      `, callback)
    },
    function(callback) {
      messageCreate('Coping with Stress and Anxiety', '2023-01-08', users[4],
      `
      Hi all, life can be stressful at times, and it's important to have 
      strategies for coping with anxiety and stress. What are some things you do
       to manage stress in your life? What techniques have worked well for you? 
       Let's share our tips for staying mentally healthy and resilient.
      `, callback)
    },
  ], 
  cb);
};

async.series([
  createUsers,
  createMessages,  
  ],
  // Optional callback
  function(err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    }
    else {
      console.log("Error bullshit.");
    }
    // All done. disconnect from database
    mongoose.connection.close();
})