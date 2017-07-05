var mongoose = require('mongoose');

var connectionString = "mongodb://localhost/polldb";
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
  response: { type: mongoose.Schema.Types.Mixed, default: {'1':'YES','2':'NO'} }
});
var Poll = mongoose.model('Poll', pollSchema);

var responseSchema = mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  username: String,
  poll_id: mongoose.Schema.Types.ObjectId,
  question: String,
  response: String,
  time: { type: Date, default: Date.now }
});
var Response = mongoose.model('Response', responseSchema);

module.exports.db = db;
module.exports.User = User;
module.exports.Poll = Poll;
module.exports.Response = Response;