var chokidar = require('chokidar');
var writeReport = require("./write-report.js");
var scanForMocks = require("./scan-for-mocks.js");
var _ = require('underscore');

var triggerScanDebounced = _.debounce(triggerScan, 600);

module.exports = {
  setUpWatcher: function(mockDirectory, mockDirectory, app, resourcesExposed, reportingDirectory) {
  	triggerScan(mockDirectory, mockDirectory, app, resourcesExposed, reportingDirectory);
  	var watcher = chokidar.watch(mockDirectory, {
	  ignored: /[\/\\]\./, 
	  persistent: true, 
	  ignoreInitial : true, 
	  followSymlinks : true
	});
  	watcher.on('all', function(path) {
		triggerScanDebounced(mockDirectory, mockDirectory, app, resourcesExposed, reportingDirectory);
	})
  }
};

function triggerScan(mockDirectory, mockDirectory, app, resourcesExposed, reportingDirectory) {
	resourcesExposed = [];
	scanForMocks.scanForMocks(mockDirectory, mockDirectory, app, resourcesExposed, reportingDirectory);
	writeReport.writeReport(resourcesExposed, reportingDirectory);
}