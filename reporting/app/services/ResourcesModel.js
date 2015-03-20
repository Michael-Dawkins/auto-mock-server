apiReport.factory("ResourcesModel", function(GeneratedData){

	var model = {};

	init();

	function init(){
		model.generatedData = GeneratedData.getData();
		model.generatedDataGlobalReadme = GeneratedData.getReadme();
		model.hasToShowLatestVersionsOnly = false;
		model.unFoldMode = false;
		model.search = {
	      searchText: ""
	    }
	    initCheckboxModels();
	}

	function initCheckboxModels() {
		model.apiArray = _.chain(model.generatedData)
			.map(function(resource){return resource.version})
			.uniq()
			.value();
		model.methodsArray = _.chain(model.generatedData)
			.map(function(resource){return resource.method})
			.uniq()
			.value();
		model.checkboxModelsApi = {};
		model.apiArray.forEach(function(api){
			model.checkboxModelsApi[api] = true;
		});
		model.checkboxModelsMethod = {};
		model.methodsArray.forEach(function(method){
			model.checkboxModelsMethod[method] = true;
		});
	}

	function getModel(){
		return model;
	}

	return {
		getModel: getModel
	}
});