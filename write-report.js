var fs = require('fs');
var path = require('path');

module.exports = {
	writeReport: function(resourcesExposed, reportingDirectory, mockDirectory) {
		// used to write the report in a specific file

		var generatedDataFileName = "GeneratedData.js";
		var angularFactorytemplate = "apiReport.factory('GeneratedData', function(){return {getData: function(){return $$$$;},getReadme: function(){return &&&&;}}});";

		var globalReadmeContent = getGlobalReadme();

		var fileContent = angularFactorytemplate.replace("$$$$", JSON.stringify(resourcesExposed));
		var fileContent = fileContent.replace("&&&&", JSON.stringify(globalReadmeContent));

		fs.writeFileSync(
			path.join(__dirname,reportingDirectory) + "\\app\\services\\" + generatedDataFileName,
			fileContent,
		"utf8");

		function getGlobalReadme(){
			// try to fetch README.md
			try {
				return readmeContent = fs.readFileSync(path.join(mockDirectory, "README.md"), "utf8");
				//catch exceptions
			} catch (e) {
				// README.md not found
				console.error("Global README.md not found");
			}
		}
	}
};

