apiReport.factory("ResourceFilter", function(ResourcesModel){

	function filterResourcesBasedOnVersion(resource){

		model = ResourcesModel.getModel();

		if(!model.hasToShowLatestVersionsOnly) {
			var activatedVersionNames = [];
			_.forEach(model.checkboxModelsApi, function(checkboxModelApi, versionName){
				if (checkboxModelApi){
					activatedVersionNames.push(versionName);
				}
			})

			var activatedMethodNames = [];
			_.forEach(model.checkboxModelsMethod, function(checkboxModelMethod, methodName){
				if (checkboxModelMethod){
					activatedMethodNames.push(methodName);
				}
			})

			var resourcePathFilter = model.search.searchText;

			return (_.contains(activatedVersionNames, resource.version) && 
			_.contains(activatedMethodNames, resource.method) &&
			resource.resourcePath.indexOf(resourcePathFilter) !== -1)
		}
		else {
			model.resourcePathArray = _.chain(model.generatedData)
				.map(function(resource){return resource.resourcePath})
				.uniq()
				.value();
			var latestVersions = [];

			var latestResources = [];
			model.resourcePathArray.forEach(function(resourcePath){
				var resources = _.where(model.generatedData, {resourcePath: resourcePath});
				var resourceWithLatestVersion = _.max(resources, function(resource){
					return resource.version;
				});
				latestResources.push(resourceWithLatestVersion);
			});

			return _.findWhere(latestResources, {resourcePath: resource.resourcePath, version: resource.version});
		}
	}

	return {
		filterResourcesBasedOnVersion: filterResourcesBasedOnVersion
	}
});