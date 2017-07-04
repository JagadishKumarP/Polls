var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db/db');
//var cors = require('cors');

var app = express();
var port = 3333;
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(cors());

var user = require('./routes/user');
app.use('/user', user);
var poll = require('./routes/poll');
app.use('/poll', poll);
var response = require('./routes/response');
app.use('/response', response);

app.get('/',function(req,res){
    res.json({'success': true ,'message':'success'});
});

app.listen(port, function () {
    console.log('Poll Application running on http://localhost:3333/ ');
});