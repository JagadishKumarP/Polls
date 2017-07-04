var express = require('express');
var poll = express.Router();
var Poll = require('../db/db').Poll;

poll.get('/', function (req, res) {
  res.json({ 'success': true, 'message': 'Poll Home' });
});

poll.get('/all', function (req, res) {
  
  var query = Poll.where({}).sort('question');
  query.find(function (err, docs) {
    if (err) {
      throw err;
    }
    if (docs == null) {
      res.json({ 'success': false, 'message': 'There are no polls' });
    } else {
      res.json({ 'success': true , 'polls': docs});
    }
  });

});

poll.post('/new', function (req, res) {

  var query = Poll.where({ question: req.body.question });
  query.findOne(function (err, doc) {
    if (err) {
      throw err;
    }
    if (doc == null) {
      var poll = new Poll({
        question: req.body.question,
        response: {
          'YES': true,
          'NO': false
        }
      });

      poll.save(function (error) {
        if (error) {
          console.log('Some Error Occured');
          throw error;
        }
        console.log('New Poll Added');
        res.json({ 'success': true });
      });
    } else {
      res.json({ 'success': false, 'message': 'Poll is already added. Try a new one.' });
    }
  });

});

module.exports = poll;