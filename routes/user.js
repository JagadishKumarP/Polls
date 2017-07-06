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
        reject({ 'success': false, 'message': 'Username is already taken. Try another one.' });
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
        console.log('New User Created');
        resolve({ 'success': true, 'message': 'Signed Up successfully' });
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
        reject(err);
      }
      if (doc == null) {
        result = {
          'success': false,
          'message': 'No user with username found.'
        };
        resolve(result);
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
          resolve(result);
        } else {
          result = {
            'success': false,
            'message': 'Wrong Password'
          };
          resolve(result);
        }
      }
    });
  });
  return result;
}

module.exports = user;
