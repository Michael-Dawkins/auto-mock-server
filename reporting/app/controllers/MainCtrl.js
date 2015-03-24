apiReport.controller("MainCtrl", function($scope, ResourceFilter, ResourcesModel, Lightbox){

  init();

  function init(){
    $scope.headerTitle = "Auto mock server";
    $scope.model = ResourcesModel.getModel();
    $scope.filterResourcesBasedOnVersion = ResourceFilter.filterResourcesBasedOnVersion;
    $scope.readMeCollapsed = true;
    $scope.areThereImages = areThereImages;
    $scope.openLightBox = openLightBox;
    $scope.displayReadme = displayReadme;
    exposeToggleMethods();
    exposeSearchMethods();
  }

  function openLightBox(resource, index) {
    Lightbox.openModal(resource.images, index);
  };

  function exposeToggleMethods() {
    $scope.showLatestVersionsOnly = function() {
      ResourcesModel.getModel().hasToShowLatestVersionsOnly = !ResourcesModel.getModel().hasToShowLatestVersionsOnly;
    };

    $scope.toggleUnFoldMode = function() {
      ResourcesModel.getModel().unFoldMode = !ResourcesModel.getModel().unFoldMode;
    };

    $scope.toggleReadmeMode = function() {
      $scope.readMeCollapsed = !$scope.readMeCollapsed;
    };
  }

  function displayReadme() {
    if (!$scope.readMeCollapsed || $scope.model.unFoldMode) {
      return true;
    }
    else {
      return false;
    }
  }

  function areThereImages(resource) {
      return resource.images.length > 0;
  }

  function exposeSearchMethods() {
    $scope.searchSuccess = function(){
      return _.some(ResourcesModel.getModel().generatedData, function(data){
        return data.resourcePath.indexOf(ResourcesModel.getModel().search.searchText) !== -1;
      })
    }
  }

});
