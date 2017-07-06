const express = require('express');
const user = express.Router();
const mongoose = require('../db/db').mongoose;
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  is_admin: Boolean,
  email_id: String
});
const User = mongoose.model('User', userSchema);

user.get('/', function (req, res) {
  res.json({ 'success': true, 'message': 'Users Home' });
});

user.post('/new', function (req, res) {

  var query = User.where({ username: req.body.username });
  query.findOne(function (err, doc) {
    if (err) {
      throw err;
    }
    if (doc == null) {
      var user = new User({
        username: req.body.username,
        password: req.body.password,
        is_admin: req.body.is_admin,
        email_id: req.body.email_id
      });

      user.save(function (error) {
        if (error) {
          console.log('Some Error Occured');
          throw error;
        }
        console.log('New User Created');
        res.json({ 'success': true });
      });
    } else {
      res.json({ 'success': false, 'message': 'Username is already taken. Try another one.' });
    }
  });

});

user.checkUser = function (user, callback) {
  var query = User.where({ username: user.username });
  query.findOne(function (err, doc) {
    var result = null;
    if (err) {
      return callback(err, result);
    }
    if (doc == null) {
      result = {
        'success': false,
        'message': 'No user with username found.'
      };
    } else {
      if (doc.password == user.password) {
        result = {
          'success': true,
          'message': 'User found',
          'user': {
            _id: doc._id,
            username: doc.username,
            is_admin: doc.is_admin,
            email_id: doc.email_id
          }
        };
      } else {
        result = {
          'success': false,
          'message': 'Wrong Password'
        };
      }
    }
    return callback(err, result);
  });
}

module.exports = user;
