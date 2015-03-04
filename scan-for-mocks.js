var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var setUpMockedResource = require("./set-up-mocked-resource.js");

module.exports = {
  scanForMocks: scanForMocks
};

function scanForMocks(dirPath, mockDirectory, app, resourcesExposed, reportingDirectory) {
	var dirContents = fs.readdirSync(dirPath);

	// we look for config.json
	if (_.contains(dirContents, "config.json")){
		setUpMockedResource.setUpMockedResource(dirPath, mockDirectory, app, resourcesExposed, reportingDirectory);
	}
	var directories = _.filter(dirContents, function(dirContent){
		return fs.statSync(path.join(dirPath, dirContent)).isDirectory();
	});

	// recursive scan through folders
	directories.forEach(function(directory){
		scanForMocks(path.join(dirPath, directory), mockDirectory, app, resourcesExposed, reportingDirectory);
	});
  }