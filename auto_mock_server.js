var express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs');
var path = require('path');
var app;
var resourcesExposed = [];
// global config
var configFileContents;
var mockDirectory;

var writeReport = require("./write-report.js");
var scanForMocks = require("./scan-for-mocks.js");

init();

function init(){
	app = express()
	var port = process.argv[2] || 8000;
	app.listen(port);

	// try to fetch config.json
	try {
	  configFileContents = JSON.parse(fs.readFileSync("config.json", "utf8"));
	  mockDirectory = configFileContents.mockDirectory;
	  var reportingDirectory = configFileContents.reportingDirectory;
	  //catch exceptions
	} catch (e) {
		//config.json not found
		if (e.code === 'ENOENT') {
		  console.log('Config file not found!');
		} else {
		  throw e;
		}
		//exit process with failure code
		process.exit(1);
	}

	//expose angular.js reporting app
	app.use('/reporting', express.static(__dirname + '/' + reportingDirectory));
	app.use(bodyParser.json())
	console.log("\nvisit http://localhost:"+ port 
		+ "/" + reportingDirectory +" to access the reporting app\n");

	scanForMocks.scanForMocks(path.join(__dirname, mockDirectory), mockDirectory, app, resourcesExposed);

	writeReport.writeReport(resourcesExposed, reportingDirectory);
}