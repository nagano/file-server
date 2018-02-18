// Load required modules
const fs = require('fs');
const formidable = require('formidable');

// Load models
const file = require('../models/file');

module.exports = function(app){

  // List files of a specific folder
  app.post('/api/files', function listFiles(request, response){
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

  // write files to files/ folder
  app.post('/api/upload', function uploadFiles(request, response){

    // create an incoming form object
    let form = formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files at once
    form.multiples = true;

    // upload files to specified directory
    const directory = request.body.directory;
    form.uploadDir = directory;

    // every time a file has been uploaded successfully,
    // rename it to its' orignal name
    form.on('file', function(field, file) {
      fs.rename(file.path, directory + '/' + file.name);
    });

    form.on('error', function(error){
      response
        .status(500)
        .json({
          content: error
          ,message: 'error uploading file(s)'
          ,origin: 'data-serve'
          ,success: true
        })
    });

    form.on('end', function(){
      response
        .status(200)
        .json({
          content: ''
          ,message: 'file(s) uploaded successfully'
          ,origin: 'data-serve'
          ,success: true
        })
    });

    // parse the incoming request containing the form data
    form.parse(request);

  });
};
