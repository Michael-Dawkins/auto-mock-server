var fs = require('fs');
var path = require('path');

module.exports = {
  writeReport: function(resourcesExposed, reportingDirectory) {
    	// used to write the report in a specific file
	var generatedDataFileName = "GeneratedData.js";
	var angularFactorytemplate = "apiReport.factory('GeneratedData', function(){return {getData: function(){return $$$$;}}});"

	var fileContent = angularFactorytemplate.replace("$$$$", JSON.stringify(resourcesExposed));
	
	fs.writeFileSync(
		path.join(__dirname,reportingDirectory) + "\\app\\services\\" + generatedDataFileName,
		fileContent,
		"utf8");
  }
};