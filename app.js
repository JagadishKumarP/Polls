const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db');
//const cors = require('cors');

const app = express();
const port = 3333;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
//app.use(cors());

const user = require('./routes/user');
app.use('/user', user);
const poll = require('./routes/poll');
app.use('/poll', poll);
const response = require('./routes/response');
app.use('/response', response);

app.get('/',function(req,res){
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/signin',function(req,res){
    var data = req.body;
    console.log(data);
    var check = user.checkUser(data,function(err, result){
        if(err){
            console.log(err);
            res.json({'success':false, 'message':'Server Internal Error'});
        }else{
            res.json(result);
        }        
    });
});

app.listen(port, function () {
    console.log('Poll Application running on http://localhost:3333/ ');
});