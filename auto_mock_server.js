var express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs');
var path = require('path');
var app;
var resourcesExposed = [];

// global config
var configFileContents;
var mockDirectory;
var httpCodes;
var reportingDirectory;

var setUpWatcher = require("./set-up-watcher.js");

init();

function init(){
	app = express()
	var port = process.argv[2] || 8000;

	app.all('*', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	});

	app.listen(port);

	// try to fetch config.json
	try {
	  configFileContents = JSON.parse(fs.readFileSync("config.json", "utf8"));
	  mockDirectory = configFileContents.mockDirectory;
	  reportingDirectory = configFileContents.reportingDirectory;
	  httpCodes = configFileContents.httpCodes;
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
	app.use('/reporting', express.static(path.join(__dirname, reportingDirectory)));
	//expose images folder
	app.use(bodyParser.json())
	console.log("\nvisit http://localhost:"+ port 
		+ "/" + reportingDirectory +" to access the reporting app\n");

	setUpWatcher.setUpWatcher(mockDirectory, mockDirectory, app, resourcesExposed, reportingDirectory, httpCodes);
}