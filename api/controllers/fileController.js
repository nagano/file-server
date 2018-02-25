// Load required modules
const fs = require('fs');
const multer = require('multer');

// Load models
const file = require('../models/file');

// Multer settings
  // sets the storage directory the file name
let storage;
  // sets the function that will save the files
let upload;
  // root directory for saving files
let directory = 'files/';

// Export module
module.exports = function(app){

  /**
   * List the files in a directory
   */
  app.post('/api/files', function listFiles(request, response){

    // read directory contents
    fs.readdir(directory + request.body.directory, function readDirectoryContents(error, files){
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
            content: file.getFilesInfo(directory + request.body.directory, files)
            ,message: ''
            ,origin: 'data-server'
            ,success: true
          });
      }
    });
  });

  /**
   * Sets the configurations for multer package
   */
  app.post('/api/uploadDirectory', function updateDirectory(request, response){

    storage = multer.diskStorage({
      destination: directory + request.body.directory
      ,filename: function(request, file, callback){
        callback(null, file.originalname);
      }
    });

    upload = multer({ storage: storage }).single('file');

    response
      .status(200)
      .json({message: '', origin: 'data-server', success: true})
  });

  /**
   * Save files to files/ directory
   */
  app.post('/api/upload', function uploadFiles(request, response){
    upload(request, response, function(error){
      if(error){
        response.status(500).json({message: 'error uploading file', origin: 'data-server', success: true});
      }

      response.status(200).json({message: 'file uploaded successfully', origin: 'data-server', success: true});
    })
  });
};
