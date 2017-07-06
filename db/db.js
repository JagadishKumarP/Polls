const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const connectionString = "mongodb://localhost/polldb";
mongoose.connect(connectionString, { useMongoClient: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: Please, check the mongodb server is running in localhost port 27017. Otherwise, please change the connection string accordingly in the file db/db.js'));
db.once('open', function () {
  console.info('Connection established successfully with mongodb');
  console.info("The mongodb port is 27017");
  console.info("The new database name would be 'polldb' ");
});

module.exports.mongoose = mongoose;