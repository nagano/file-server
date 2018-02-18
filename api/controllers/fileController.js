const fs = require('fs');
const file = require('../models/file');

module.exports = function(app){

  // List files of a specific folder
  app.post('/files', function listFiles(request, response){
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
            content: file.getFilesInfo(directory, files)
            ,message: ''
            ,origin: 'data-server'
            ,success: true
          });
      }
    });
  });
};
