var mongoose = require('mongoose');

var connectionString = "mongodb://localhost/polls";
mongoose.connect(connectionString, {useMongoClient: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.info('connection established successfully with mongodb')
});
//user_id username password is_admin email_id
//poll which has a Question and Response (YES|NO)
//response contains the poll_id, user_id, response

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  is_admin: Boolean,
  email_id: String
});
var User = mongoose.model('User', userSchema);

var pollSchema = mongoose.Schema({
  question: String,
  response: Array
});
var Poll = mongoose.model('Poll', pollSchema);


module.exports.db = db;
module.exports.User = User;