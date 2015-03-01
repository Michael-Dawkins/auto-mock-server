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
  }

});
