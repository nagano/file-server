// Load required modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Load controllers
const fileController = require('./api/controllers/fileController');

// Set API port
const PORT = 8080;

// Set body-parser as middleware to express app
// app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add headers
app.use(function addAccessHeaders(request, response, next){
  // website you wish to allow outside connection
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
  // request methos you wish to allow
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // request headers you wish to allow
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  // pass to next layer of middleware
  next();
});

// Load routes
fileController(app);

// Setup port where API will run
app.listen(PORT, function initApi(){
  console.log('Listening on port ' + PORT);
});
