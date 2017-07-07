const express = require('express');
const response = express.Router();
const mongoose = require('../db/db').mongoose;
const responseSchema = mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  username: String,
  poll_id: mongoose.Schema.Types.ObjectId,
  question: String,
  response: String,
  time: { type: Date, default: Date.now }
});
const Response = mongoose.model('Response', responseSchema);

response.get('/', function (req, res) {
  res.json({ 'success': true, 'message': 'Response Home' });
});

response.get('/all', function (req, res) {

  var query = Response.where({}).sort('username');
  query.find(function (err, docs) {
    if (err) {
      console.log(err);
      res.json({ 'success': false, 'message': 'Server Internal Error.' });
    }
    if (docs == null || docs.length == 0) {
      res.json({ 'success': false, 'message': 'There are no responses.' });
    } else {
      res.json({ 'success': true, 'message': 'Response(s) fetched for the poll.', 'responses': docs });
    }
  });

});

response.get('/:poll_id', function (req, res) {

  var query = Response.where({ poll_id: req.params.poll_id }).sort('username');
  query.find(function (err, docs) {
    if (err) {
      throw err;
    }
    if (docs == null || docs.length == 0) {
      res.json({ 'success': false, 'message': 'There are no responses.' });
    } else {
      res.json({ 'success': true, 'message': 'Response(s) fetched for the poll.', 'responses': docs });
    }
  });

});

response.post('/new', function (req, res) {
  var response = new Response({
    user_id: req.body.user_id,
    username: req.body.username,
    poll_id: req.body.poll_id,
    question: req.body.question,
    response: req.body.response,
  });

  response.save(function (err) {
    if (err) {
      console.log(err);
      res.json({ 'success': false, 'message': 'Server Internal Error.' });
    }
    res.json({ 'success': true, 'message': 'Recorded your response.' });
  });
});

module.exports = response;