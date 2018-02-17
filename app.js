// Load required modules
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Set API port
const PORT = 8080;

// Set body-parser as middleware to express app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Connect all our routes to our application
app.use('/', routes);

// Add header
app.use(function addAccessHeaders(request, response, next){
  // website you wish to allow outside connection
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');

  // request methos you wish to allow
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  // request headers you wish to allow
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

  // pass to next layer of middleware
  next();
});

app.post('/files', function listFiles(request, response){

  /**
   * Get specific information from each file in a directory
   *
   * @param  {String} directory Directory
   * @param  {Array} files      Files inside a directory
   * @return {Array}            Detailed files
   */
  function getFilesInfo(directory, files){
    const detailedFiles = [];

    for(let file of files){
      const extension = path.extname(file);
      const detailedFile = fs.statSync(directory + '/' + file);
      detailedFiles.push({
        name: file
        ,extension: extension
        ,size: detailedFile.size
        ,createdAt: convertDate(detailedFile.birthtimeMs)
        ,lastModified: convertDate(detailedFile.mtimeMs)
      })
    }

    return detailedFiles;
  };

  function convertDate(date){
    let d = new Date(date);
    let fileDate = d.toISOString();
    return fileDate.substring(0, 10) + ' ' + fileDate.substring(11, 19);
  };

  // get directory to list files
  const directory = request.body.directory;

  // read directory contents
  fs.readdir(directory, function readDirectoryContents(error, files){
    if(error){
      response
        .status(401)
        .json({
          content: error
          ,message: 'Directory not found'
          ,origin: 'data-server'
          ,success: true
        });
    } else {
      response
        .status(200)
        .json({
          content: getFilesInfo(directory, files)
          ,message: ''
          ,origin: 'data-server'
          ,success: true
        });
    }
  });
});

// Setup port where API will run
app.listen(PORT, function initApi(){
  console.log('Listening on port ' + PORT);
});
