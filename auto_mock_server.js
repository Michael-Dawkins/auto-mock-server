var express = require('express')
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var tv4 = require('tv4');
var app;
var resourcesExposed = [];

// global config
var configFileContents;
// try to fetch config.json
try {
  configFileContents = JSON.parse(fs.readFileSync("config.json", "utf8"));
  var mockDirectory = configFileContents.mockDirectory;
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

	// we look for config.json
	if (_.contains(dirContents, "config.json")){
		setUpMockedResource(dirPath);
	}
	var directories = _.filter(dirContents, function(dirContent){
		return fs.statSync(path.join(dirPath, dirContent)).isDirectory();
	});

	// recursive scan through folders
	directories.forEach(function(directory){
		scanForMocks(path.join(dirPath, directory));
	});
}

function setUpMockedResource(dirPath){
	// remove base path
	var resourcePath = dirPath.replace(__dirname + "\\" + mockDirectory + "\\", '');

	// get first param : 1.0, 1.1 ...
	var pathArray = resourcePath.split( '\\' );
	var versionApi = pathArray[0];

	// replace '\' with '/'
	resourcePath = resourcePath.replace(new RegExp('\\' + path.sep, 'g'), '/');
	// remove API version from path
	resourcePath = resourcePath.replace(versionApi + '/', '');
	// get directory name : articles/user ...
	var dirName = path.dirname(resourcePath);

	// get method name : GET, POST...
	var methodName = path.basename(dirPath);
	resourcePath = "/" + dirName;
	resourcePathWithAPIVersion = "/" + versionApi + resourcePath;

	// get mock.json and config.json contents
	var mockedContent = fs.readFileSync(path.join(dirPath, "mock.json"), "utf8");
	var options = JSON.parse(fs.readFileSync(path.join(dirPath, "config.json"), "utf8"));

	var readmeContent;
	// try to fetch config.json
	try {
	  readmeContent = fs.readFileSync(path.join(dirPath, "README.md"), "utf8");
	  //catch exceptions
	} catch (e) {
		//config.json not found
		if (e.code === 'ENOENT') {
		  console.log('README file not found!');
		}
	}
	// get schema.json content and compare mock.json to check JSON validity
	var mockedSchema = fs.readFileSync(path.join(dirPath, "schema.json"), "utf8");
	var isJSONValid = checkJSONSchema(mockedContent, mockedSchema);

	console.log("setting up " + (isJSONValid ? 'valid' : 'invalid') + " resource on path : " + resourcePathWithAPIVersion + ", method : " + methodName + ", version " + versionApi);
	
	// expose our WS, using the appropriate method
	app[methodName.toLowerCase()](resourcePathWithAPIVersion, function(req, res) {
	  res.send(mockedContent);
	});
	// fill our array with our mocks
	resourcesExposed.push({
		resourcePath: resourcePath,
		content: JSON.parse(mockedContent),
		readme: readmeContent,
		method: methodName,
		version: versionApi,
		valid: isJSONValid,
		options: options
	});
}

function writeReport(){
	// used to write the report in a specific file
	var generatedDataFileName = "GeneratedData.js";
	var angularFactorytemplate = "apiReport.factory('GeneratedData', function(){return {getData: function(){return $$$$;}}});"

	var fileContent = angularFactorytemplate.replace("$$$$", JSON.stringify(resourcesExposed));
	
	fs.writeFileSync(
		path.join(__dirname,reportingDirectory) + "\\app\\services\\" + generatedDataFileName,
		fileContent,
		"utf8");
}

function checkJSONSchema(data, schema) {
	// JSON validation by comparing to its own schema
	return tv4.validate(JSON.parse(data), JSON.parse(schema));
}