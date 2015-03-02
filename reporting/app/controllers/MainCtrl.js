apiReport.controller("MainCtrl", function($scope, GeneratedData){

  init();

  function init(){
    $scope.title = "Rest API Report";
    $scope.generatedData = GeneratedData.getData();
    $scope.search = {
    	searchText: ""
    }
    $scope.searchSuccess = function(){
      return _.some($scope.generatedData, function(data){
        return data.resourcePath.indexOf($scope.search.searchText) !== -1;
      })
    }

    $scope.apiArray = _.chain($scope.generatedData)
      .map(function(resource){return resource.version})
      .uniq()
      .value();
    $scope.checkboxModels = {};
    $scope.apiArray.forEach(function(api){
        $scope.checkboxModels[api] = true;
    });

    $scope.filterResourcesBasedOnVersion = function(resource){
      var activatedVersionNames = [];
      _.forEach($scope.checkboxModels, function(checkboxModel, versionName){
        if (checkboxModel){
            activatedVersionNames.push(versionName);
        }
      })

      var resourcePathFilter = $scope.search.searchText;

      return (_.contains(activatedVersionNames, resource.version) && resource.resourcePath.indexOf(resourcePathFilter) !== -1)

    }
  }

});
