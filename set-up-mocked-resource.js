var express = require('express')
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var checkJSONSchema = require("./check-json-schema.js");

module.exports = {
  setUpMockedResource: function(dirPath, mockDirectory, app, resourcesExposed, reportingDirectory) {
    // remove base path
    //  resourcePath = 1.0\articles\GET
	var resourcePath = dirPath.replace(mockDirectory + "\\", '');
	// get first param : 1.0, 1.1 ...
	// pathArray = ["1.0", "articles", "GET"]
	var pathArray = resourcePath.split( '\\' );
	var versionApi = pathArray[0];

	// replace '\' with '/'
	// resourcePath = 1.0/articles/GET
	fullResourcePath = resourcePath.replace(new RegExp('\\' + path.sep, 'g'), '/');
	// remove API version from path
	// resourcePath = articles/GET
	resourcePath = fullResourcePath.replace(versionApi + '/', '');

	// get directory name : articles/user ...
	// dirName =  articles
	var dirName = path.dirname(resourcePath);

	// get method name : GET, POST...
	var methodName = path.basename(dirPath);
	// resourcePath = /articles/GET
	resourcePath = "/" + dirName;
	// resourcePathWithAPIVersion = /1.0/articles
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
		  // console.log('README file not found!');
		}
	}

	var schemas = {mock:"",payload:""};

	// get schema.json content and compare mock.json to check JSON validity
	var mockedSchema = fs.readFileSync(path.join(dirPath, "schema-mock.json"), "utf8");
	var payloadSchema = fs.readFileSync(path.join(dirPath, "schema-payload.json"), "utf8");
	var isJSONValid = checkJSONSchema.checkJSONSchema(JSON.parse(mockedContent), mockedSchema).valid;

	if (mockedSchema) {
		schemas.mock = mockedSchema;
	}
	if (payloadSchema) {
		schemas.payload = payloadSchema;
	}

	// get images in folder
	var imageTypes = [".png", ".jpeg", ".jpg", ".gif"];
	var imageFiles = [];
	var listImageFiles = fs.readdirSync(dirPath);
	for (var file in listImageFiles) {
		if (_.contains(imageTypes, path.extname(listImageFiles[file]))) {
			imageFiles.push(path.join("/", "reporting", "mocks", fullResourcePath, listImageFiles[file]));
		}
	}
	if (imageFiles) {
		app.use('/reporting/mocks/' + fullResourcePath, express.static(path.join(__dirname, "mocks", fullResourcePath)));
	}

	console.log("setting up " + (isJSONValid ? 'valid' : 'invalid') + " resource on path : " + resourcePathWithAPIVersion + ", method : " + methodName + ", version " + versionApi);
	
	// expose our WS, using the appropriate method
	app[methodName.toLowerCase()](resourcePathWithAPIVersion, function(req, res) {
		// send response
	  res.send(mockedContent);
	  if (methodName == "POST") {

	  	// compare POST payload to mock JSON schema
	  	console.log(resourcePathWithAPIVersion, " payload body : ",req.body);
	  	if (payloadSchema) {
			if (checkJSONSchema.checkJSONSchema(req.body, mockedSchema).valid) {
				console.log("Valid payload !");
			}
			else {
				console.log("Invalid payload !\n");
				console.log(checkJSONSchema.checkJSONSchema(req.body, mockedSchema).errorLog);
			}
	  	}
	  }
	});

	// fill our array with our mocks
	resourcesExposed.push({
		resourcePath: resourcePath,
		content: JSON.parse(mockedContent),
		readme: readmeContent,
		method: methodName,
		version: versionApi,
		valid: isJSONValid,
		images: imageFiles,
		schemas: schemas,
		options: options
	});
	return resourcesExposed;
  }
};