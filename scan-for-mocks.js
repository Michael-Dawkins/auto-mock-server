var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var setUpMockedResource = require("./set-up-mocked-resource.js");

module.exports = {
  scanForMocks: scanForMocks
};

function scanForMocks(dirPath, mockDirectory, app, resourcesExposed, reportingDirectory, httpCodes) {

	try {
	  var dirContents = fs.readdirSync(dirPath);
	  //catch exceptions
	} catch (e) {
		//config.json not found
		if (e.code === 'ENOENT') {
		  console.log("Empty mocks folder. Please configure it in config.js");
		} else {
		  throw e;
		}
	}

	// we look for config.json
	if (_.contains(dirContents, "config.json")){
		setUpMockedResource.setUpMockedResource(dirPath, mockDirectory, app, resourcesExposed, reportingDirectory, httpCodes);
	}
	var directories = _.filter(dirContents, function(dirContent){
		return fs.statSync(path.join(dirPath, dirContent)).isDirectory();
	});

	// recursive scan through folders
	directories.forEach(function(directory){
		scanForMocks(path.join(dirPath, directory), mockDirectory, app, resourcesExposed, reportingDirectory, httpCodes);
	});
  }