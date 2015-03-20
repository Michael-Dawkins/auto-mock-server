var chokidar = require('chokidar');
var writeReport = require("./write-report.js");
var scanForMocks = require("./scan-for-mocks.js");
var _ = require('underscore');

var triggerScanDebounced = _.debounce(triggerScan, 600);

module.exports = {
  setUpWatcher: function(mockDirectory, mockDirectory, app, resourcesExposed, reportingDirectory, httpCodes) {
  	triggerScan(mockDirectory, mockDirectory, app, resourcesExposed, reportingDirectory, httpCodes);
  	var watcher = chokidar.watch(mockDirectory, {
	  ignored: /[\/\\]\./, 
	  persistent: true, 
	  ignoreInitial : true, 
	  followSymlinks : true
	});
  	watcher.on('all', function(path) {
		triggerScanDebounced(mockDirectory, mockDirectory, app, resourcesExposed, reportingDirectory, httpCodes);
	})
  }
};

function triggerScan(mockDirectory, mockDirectory, app, resourcesExposed, reportingDirectory, httpCodes) {
	resourcesExposed = [];
	scanForMocks.scanForMocks(mockDirectory, mockDirectory, app, resourcesExposed, reportingDirectory, httpCodes);
	writeReport.writeReport(resourcesExposed, reportingDirectory, mockDirectory);
}