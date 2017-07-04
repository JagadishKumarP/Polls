var express = require('express');
var user = express.Router();
var User = require('../db/db').User;

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

module.exports = user;
