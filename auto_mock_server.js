var express = require('express')
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var app;
var resourcesExposed = [];

var configFileContents;
try {
  configFileContents = JSON.parse(fs.readFileSync("config.json", "utf8"));
  var mockDirectory = configFileContents.mockDirectory;
  var reportingDirectory = configFileContents.reportingDirectory;
} catch (e) {
	if (e.code === 'ENOENT') {
	  console.log('Config file not found!');
	} else {
	  throw e;
	}
	process.exit(1);
}

//var configFileContents = JSON.parse(fs.readFileSync("config.json", "utf8"));

//config


init();

function init(){
	app = express()
	var port = process.argv[2] || 8000;
	app.listen(port);


	//expose angular.js reporting app
	app.use('/reporting', express.static(__dirname + '/' + reportingDirectory));
	console.log("\nvisit http://localhost:"+ port 
		+ "/" + reportingDirectory +" to access the reporting app\n");

	scanForMocks(path.join(__dirname, mockDirectory));

	writeReport();
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
	});
	resourcesExposed.push({
		resourcePath: resourcePath,
		content: JSON.parse(mockedContent),
		options: options
	});
}

function writeReport(){
	var generatedDataFileName = "GeneratedData.js";
	var angularFactorytemplate = "apiReport.factory('GeneratedData', function(){return {getData: function(){return $$$$;}}});"
	var fileContent = angularFactorytemplate.replace("$$$$", JSON.stringify(resourcesExposed));
	
	fs.writeFileSync(
		path.join(__dirname,reportingDirectory) + "\\app\\services\\" + generatedDataFileName,
		fileContent,
		"utf8");
}