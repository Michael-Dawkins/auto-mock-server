apiReport.controller("MainCtrl", function($scope, GeneratedData){

  init();

  function init(){
    $scope.title = "Rest API Report";
    $scope.generatedData = GeneratedData.getData();
    $scope.hasToShowLatestVersionsOnly = false;
    $scope.unFoldMode = false;
    $scope.search = {
      searchText: ""
    }
    $scope.searchSuccess = function(){
      return _.some($scope.generatedData, function(data){
        return data.resourcePath.indexOf($scope.search.searchText) !== -1;
      })
    }

    $scope.showLatestVersionsOnly = function() {
      $scope.hasToShowLatestVersionsOnly = !$scope.hasToShowLatestVersionsOnly;
    };

    $scope.toggleUnFoldMode = function() {
      $scope.unFoldMode = !$scope.unFoldMode;
    };

    $scope.apiArray = _.chain($scope.generatedData)
    .map(function(resource){return resource.version})
    .uniq()
    .value();
    $scope.methodsArray = _.chain($scope.generatedData)
    .map(function(resource){return resource.method})
    .uniq()
    .value();
    $scope.checkboxModelsApi = {};
    $scope.apiArray.forEach(function(api){
      $scope.checkboxModelsApi[api] = true;
    });
    $scope.checkboxModelsMethod = {};
    $scope.methodsArray.forEach(function(method){
      $scope.checkboxModelsMethod[method] = true;
    });

    $scope.filterResourcesBasedOnVersion = function(resource){
      if(!$scope.hasToShowLatestVersionsOnly) {
        var activatedVersionNames = [];
        _.forEach($scope.checkboxModelsApi, function(checkboxModelApi, versionName){
          if (checkboxModelApi){
            activatedVersionNames.push(versionName);
          }
        })

        var activatedMethodNames = [];
        _.forEach($scope.checkboxModelsMethod, function(checkboxModelMethod, methodName){
          if (checkboxModelMethod){
            activatedMethodNames.push(methodName);
          }
        })

        var resourcePathFilter = $scope.search.searchText;

        return (_.contains(activatedVersionNames, resource.version) && 
        _.contains(activatedMethodNames, resource.method) &&
        resource.resourcePath.indexOf(resourcePathFilter) !== -1)
      }
      else {
        $scope.resourcePathArray = _.chain($scope.generatedData)
        .map(function(resource){return resource.resourcePath})
        .uniq()
        .value();
        var latestVersions = [];

        var latestResources = [];
        $scope.resourcePathArray.forEach(function(resourcePath){
          var resources = _.where($scope.generatedData, {resourcePath: resourcePath});
          var resourceWithLatestVersion = _.max(resources, function(resource){
            return resource.version;
          });
          latestResources.push(resourceWithLatestVersion);
        });

        return _.findWhere(latestResources, {resourcePath: resource.resourcePath, version: resource.version});
      }
    }

  }

});
