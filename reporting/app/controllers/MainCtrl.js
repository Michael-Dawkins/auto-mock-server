apiReport.controller("MainCtrl", function($scope, GeneratedData){

  init();

  function init(){
    $scope.title = "Rest API Report";
    $scope.generatedData = GeneratedData.getData();
  }

});
