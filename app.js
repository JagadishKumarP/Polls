const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db');
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt');
const cors = require('cors');

const app = express();
const port = 3333;
app.set('hash', 'secret');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

const user = require('./routes/user');
app.use('/user', expressJwt({ secret: app.get('hash') }));
app.use('/user', user);
const poll = require('./routes/poll');
app.use('/poll', expressJwt({ secret: app.get('hash') }));
app.use('/poll', poll);
const response = require('./routes/response');
app.use('/response', expressJwt({ secret: app.get('hash') }));
app.use('/response', response);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        console.log('UnauthorizedError');
        res.status(401).json({ success: false, message: 'Unauthorized: Please login' });
    }
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/signin', function (req, res) {
    var data = req.body;
    //console.log(data);
    /*var check = user.checkUser(data,function(err, result){
        if(err){
            console.log(err);
            res.json({'success':false, 'message':'Server Internal Error'});
        }else{
            res.json(result);
        }        
    });*/
    user.checkUser(data)
        .then(function (result) {
            if (result.success) {
                result.token = jwt.sign(result.user, app.get('hash'), { expiresIn: '1h' });
            }
            res.json(result);
        }).catch(function (err) {
            console.log(err);
            res.json({ 'success': false, 'message': 'Server Internal Error' });
        });
});

app.post('/signup', function (req, res) {
    var data = req.body;
    user.createNewUser(data)
        .then(function (result) {
            res.json(result);
        }).catch(function (err) {
            res.json(err);
        });
});

app.listen(port, function () {
    console.log('Poll Application running on http://localhost:3333/ ');
});