apiReport.controller("MainCtrl", function($scope, ResourceFilter, ResourcesModel){

  init();

  function init(){
    $scope.model = ResourcesModel.getModel();
    $scope.filterResourcesBasedOnVersion = ResourceFilter.filterResourcesBasedOnVersion;

    exposeToggleMethods();
    exposeSearchMethods();
  }

  function exposeToggleMethods() {
    $scope.showLatestVersionsOnly = function() {
      ResourcesModel.getModel().hasToShowLatestVersionsOnly = !ResourcesModel.getModel().hasToShowLatestVersionsOnly;
    };

    $scope.toggleUnFoldMode = function() {
      ResourcesModel.getModel().unFoldMode = !ResourcesModel.getModel().unFoldMode;
    };
  }

  function exposeSearchMethods() {
    $scope.searchSuccess = function(){
      return _.some(ResourcesModel.getModel().generatedData, function(data){
        return data.resourcePath.indexOf(ResourcesModel.getModel().search.searchText) !== -1;
      })
    }
  }

});
