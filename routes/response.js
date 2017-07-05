var express = require('express');
var response = express.Router();
var Response = require('../db/db').Response;

response.get('/', function (req, res) {
  res.json({ 'success': true, 'message': 'Response Home' });
});

response.get('/all', function (req, res) {
  
  var query = Response.where({}).sort('username');
  query.find(function (err, docs) {
    if (err) {
      throw err;
    }
    if (docs == null || docs.length == 0) {
      res.json({ 'success': false, 'message': 'There are no responses.' });
    } else {
      res.json({ 'success': true , 'responses': docs});
    }
  });

});

response.get('/:poll_id', function (req, res) {
  
  var query = Response.where({poll_id: req.params.poll_id}).sort('username');
  query.find(function (err, docs) {
    if (err) {
      throw err;
    }
    if (docs == null || docs.length == 0) {
      res.json({ 'success': false, 'message': 'There are no responses.' });
    } else {
      res.json({ 'success': true , 'responses': docs});
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

  response.save(function (error) {
    if (error) {
      console.log('Some Error Occured');
      throw error;
    }
    console.log('Response recorded');
    res.json({ 'success': true });
  });
});

module.exports = response;