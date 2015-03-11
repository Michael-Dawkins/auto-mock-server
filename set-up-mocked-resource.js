var express = require('express')
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var checkJSONSchema = require("./check-json-schema.js");
var imageTypes = [".png", ".jpeg", ".jpg", ".gif"];

module.exports = {
	setUpMockedResource: function(dirPath, mockDirectory, app, resourcesExposed, reportingDirectory, httpCodes) {

		// declare and get resource variables
		var resourcePathWithAPIVersion;
		var methodName;
		getResourceParameters();

		// get mocked content
		var mockedContent = getMockedContent();
		if(mockedContent) {
			mockedContent = JSON.parse(mockedContent);
		}
		var mockedPayloadContent = getMockedPayloadContent();
		if(mockedPayloadContent) {
			mockedPayloadContent = JSON.parse(mockedPayloadContent);
		}
		var options = getOptions();

		// get readme
		var readmeContent = getReadme();

		// get schemas
		var schemas = {mock:"",payload:""};
		var mockedSchema;
		var payloadSchema;
		getSchemas();

		// get images
		getImages();

		// get http codes
		var resourceHttpCodes = getResourceHttpCodes();
		if (resourceHttpCodes) {
			var matchedHttpCodes = getHttpCodes(resourceHttpCodes);
		}

		// expose resources
		exposeWS();

		console.log("setting up " + (isJSONValid ? 'valid' : 'invalid') + " resource on path : " + resourcePathWithAPIVersion + ", method : " + methodName + ", version " + versionApi);

		// fill array with mocks
		resourcesExposed.push({
			resourcePath: "/" + versionApi + resourcePath,
			content: mockedContent,
			contentPayload : mockedPayloadContent,
			readme: readmeContent,
			method: methodName,
			version: versionApi,
			valid: isJSONValid,
			validPayload : isJSONPayloadValid,
			images: imageFiles,
			schemas: schemas,
			options: options,
			httpCodes : matchedHttpCodes
		});
		return resourcesExposed;

		function getResourceParameters() {
	    // remove base path
	    //  resourcePath = 1.0\articles\GET
			if (path.sep === '\\') {
				resourcePath = dirPath.replace(mockDirectory + "\\", '');
			} else {
				resourcePath = dirPath.replace(mockDirectory + path.sep, '');
			}
			// get first param : 1.0, 1.1 ...
			// pathArray = ["1.0", "articles", "GET"]
			if (path.sep === '\\') {
				pathArray = resourcePath.split( '\\' );
			} else {
				pathArray = resourcePath.split( path.sep );
			}
			versionApi = pathArray[0];
			// replace '\' with '/'
			// resourcePath = 1.0/articles/GET
			fullResourcePath = resourcePath.replace(new RegExp('\\' + path.sep, 'g'), '/');
			// remove API version from path
			// resourcePath = articles/GET
			resourcePath = fullResourcePath.replace(versionApi + '/', '');
			// get directory name : articles/user ...
			// dirName =  articles
			dirName = path.dirname(resourcePath);
			// get method name : GET, POST...
			methodName = path.basename(dirPath);
			// resourcePath = /articles/GET
			resourcePath = "/" + dirName;
			// resourcePathWithAPIVersion = /1.0/articles
			resourcePathWithAPIVersion = "/" + versionApi + resourcePath;
		}

		function getMockedContent(){
			try {
			  return mockedContent = fs.readFileSync(path.join(dirPath, "mock.json"), "utf8");
			  //catch exceptions
			} catch (e) {
			}
		}

		function getMockedPayloadContent(){
			try {
			  return mockedPayloadContent = fs.readFileSync(path.join(dirPath, "mock-payload.json"), "utf8");
			  //catch exceptions
			} catch (e) {
			}
		}

		function getOptions(){
			try {
			  return options = JSON.parse(fs.readFileSync(path.join(dirPath, "config.json"), "utf8"));
			  //catch exceptions
			} catch (e) {
				// config.json not found
			}
		}

		function getReadme(){
			// try to fetch README.md
			try {
			  return readmeContent = fs.readFileSync(path.join(dirPath, "README.md"), "utf8");
			  //catch exceptions
			} catch (e) {
				// README.md not found
			}
		}

		function getSchemas() {
			try {
				mockedSchema = fs.readFileSync(path.join(dirPath, "schema-mock.json"), "utf8");
			  //catch exceptions
			} catch (e) {
				// schema-mock.json not found
			}
			try {
				payloadSchema = fs.readFileSync(path.join(dirPath, "schema-payload.json"), "utf8");
			  //catch exceptions
			} catch (e) {
				// schema-payload.json not found
			}
			if (mockedSchema) {
				mockedSchema = JSON.parse(mockedSchema);
				schemas.mock = mockedSchema;
				exposeMockedSchema(mockedSchema);
			}
			if (payloadSchema) {
				payloadSchema = JSON.parse(payloadSchema);
				schemas.payload = payloadSchema;
				exposePayloadSchema(payloadSchema);
			}
			if (mockedContent && mockedSchema) {
				isJSONValid = checkJSONSchema.checkJSONSchema(mockedContent, mockedSchema).valid;
			}
			if (mockedPayloadContent && payloadSchema) {
				isJSONPayloadValid = checkJSONSchema.checkJSONSchema(mockedPayloadContent, payloadSchema).valid;
			}
		}

		function exposeMockedSchema(mockedSchema) {
			// expose our WS, using the appropriate method
			app[methodName.toLowerCase()]("/schema-mock"+resourcePathWithAPIVersion, function(req, res) {
				// send response
				res.send(mockedSchema);
			});
		}

		function exposePayloadSchema(payloadSchema) {
			// expose our WS, using the appropriate method
			app[methodName.toLowerCase()]("/schema-payload"+resourcePathWithAPIVersion, function(req, res) {
				// send response
				res.send(payloadSchema);
			});
		}

		function getImages() {
			// get images in folder
			imageFiles = [];
			var listImageFiles = fs.readdirSync(dirPath);
			for (var file in listImageFiles) {
				if (_.contains(imageTypes, path.extname(listImageFiles[file]))) {
					imageFiles.push(path.join("/", "reporting", "mocks", fullResourcePath, listImageFiles[file]));
				}
			}
			if (imageFiles) {
				app.use('/reporting/mocks/' + fullResourcePath, express.static(path.join(mockDirectory, fullResourcePath)));
			}
		}

		function getResourceHttpCodes() {
			// try to fetch http-codes.json
			try {
			  return JSON.parse(fs.readFileSync(path.join(dirPath, "http-codes.json"), "utf8"));
			  //catch exceptions
			} catch (e) {
				// README.md not found
			}
		}

		function getHttpCodes(resourceHttpCodes) {
			return _.map(resourceHttpCodes, function(httpCode){
				return _.findWhere(httpCodes, {code: httpCode});
			})
		}

		function exposeWS() {

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
		}
	}
};
