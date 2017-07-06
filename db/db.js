const mongoose = require('mongoose');

const connectionString = "mongodb://localhost/polldb";
mongoose.connect(connectionString, {useMongoClient: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.info('connection established successfully with mongodb')
});

module.exports.mongoose = mongoose;