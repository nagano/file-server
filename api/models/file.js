const fs = require('fs');
const path = require('path');

module.exports = {
  // Get specific information from each file in a directory
  getFilesInfo: function(directory, files){
    const detailedFiles = [];
    for(let file of files){
      const extension = path.extname(file);
      const detailedFile = fs.statSync(directory + '/' + file);
      detailedFiles.push({
        name: file
        ,extension: extension
        ,size: this.convertSize(detailedFile.size)
        ,createdAt: this.convertDate(detailedFile.birthtimeMs)
        ,lastModified: this.convertDate(detailedFile.mtimeMs)
      })
    }
    return detailedFiles;
  },

  // Convert Date object to yyyy-mm-dd hh:mm format
  convertDate: function(date){
    let d = new Date(date);
    let fileDate = d.toISOString();
    return fileDate.substring(0, 10) + ' ' + fileDate.substring(11, 19);
  }

  // convert size in bytes
  ,convertSize: function(objSize){
        if(objSize.toString().length > 6){
            return (objSize/(1024*1024)).toFixed(2) + ' MB';
        } else if(objSize < 10) {
            return '< 0.01 kb';
        } else {
            return (objSize/1024).toFixed(2) + ' kb';
        }
    }
};
