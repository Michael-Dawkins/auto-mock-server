var express = require('express')
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var app;

//config
var mockDirectory = "mocks";

init();

function init(){
	app = express()
	var port = process.argv[2] || 8000;
	app.listen(port);

	scanForMocks(path.join(__dirname, mockDirectory));
}

//recursively scan folder to find mocked resources to expose
function scanForMocks(dirPath){
	var dirContents = fs.readdirSync(dirPath);
	if (_.contains(dirContents, "config.json")){
		setUpMockedResource(dirPath);
	}
	var directories = _.filter(dirContents, function(dirContent){
		return fs.statSync(path.join(dirPath, dirContent)).isDirectory();
	});
	directories.forEach(function(directory){
		scanForMocks(path.join(dirPath, directory));
	});
}

function setUpMockedResource(dirPath){
	var resourcePath = dirPath.replace(__dirname + "\\" + mockDirectory + "\\", '');
	resourcePath = "/" + resourcePath;
	var mockedContent = fs.readFileSync(path.join(dirPath, "mock.json"), "utf8");
	var options = JSON.parse(fs.readFileSync(path.join(dirPath, "config.json"), "utf8"));

	console.log("setting up resource on path : " + resourcePath + ", method : " + options.method);
	app[options.method](resourcePath, function(req, res) {
	  res.send(mockedContent);
	})
}
