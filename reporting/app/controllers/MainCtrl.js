apiReport.controller("MainCtrl", function($scope, ResourceFilter, ResourcesModel, Lightbox){

  init();

  function init(){
    $scope.headerTitle = "Auto mock server";
    $scope.model = ResourcesModel.getModel();
    $scope.filterResourcesBasedOnVersion = ResourceFilter.filterResourcesBasedOnVersion;
    $scope.isThereImages = isThereImages;
    $scope.openLightBox = openLightBox;
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
  }

  function isThereImages(resource) {
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
