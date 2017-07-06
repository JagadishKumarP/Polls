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

/*user.post('/new', function (req, res) {

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

});*/

user.createNewUser = function (newuser) {
  var query = User.where({ username: newuser.username });
  var checkusername = new Promise(function (resolve, reject) {
    query.findOne(function (err, doc) {
      if (err) {
        console.log(err);
        reject({ 'success': false, 'message': 'Server Internal Error' });
      }
      if (doc == null) {
        resolve(newuser);
      } else {
        reject({ 'success': false, 'message': 'Sorry, "' + newuser.username + '" is already taken. Please, try another one.' });
      }
    });
  });
  var saveuser = function (newuser) {
    var newuserdata = new User({
      username: newuser.username,
      password: newuser.password,
      is_admin: newuser.is_admin,
      email_id: newuser.email_id
    });

    var savedata = new Promise(function (resolve, reject) {
      newuserdata.save(function (err) {
        if (err) {
          console.log(err);
          reject({ 'success': false, 'message': 'Server Internal Error' });
        }
        resolve({ 'success': true, 'message': 'Sign Up successful. Please, Sign In to continue.' });
      });
    });
    return savedata;
  };
  return checkusername.then(saveuser);
}

/* user.checkUser = function (user, callback) {
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
} */


user.checkUser = function (user) {
  var query = User.where({ username: user.username });
  var result = new Promise(function (resolve, reject) {
    query.findOne(function (err, doc) {
      var result = null;
      if (err) {
        console.log(err);
        reject(err);
      }
      if (doc == null) {
        resolve({ 'success': false, 'message': 'No user found with the username: "' + user.username + '"' });
      } else {
        if (doc.password == user.password) {
          result = {
            'success': true,
            'message': 'Welcome, ' + doc.username,
            'user': {
              _id: doc._id,
              username: doc.username,
              is_admin: doc.is_admin,
              email_id: doc.email_id
            }
          };
          resolve(result);
        } else {
          resolve({ 'success': false, 'message': 'Wrong Password, enter the correct password.' });
        }
      }
    });
  });
  return result;
}

module.exports = user;
