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
  }

});
