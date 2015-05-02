angular.module('fila',['serviceModule', 'toaster', 'ngAnimate'])

.controller('mainController', ['$scope', 'service', 'toaster', function($scope, service, toaster) {
	$scope.timeForRefresh = localStorage.getItem("timeForRefresh") == null ? 10 : localStorage.getItem("timeForRefresh");
	$scope.timeForPageRefresh = localStorage.getItem("timeForPageRefresh") == null ? 5 : localStorage.getItem("timeForPageRefresh");
	$scope.currentPass = {"senha" : ""};
	$scope.confPopup = false;
	$scope.newTimer = $scope.timeForRefresh;
	$scope.calledPass = [];
	$scope.showingData = [];
	$scope.maxPerPage = 6;
	$scope.page = 1;
	$scope.audio = new Audio('sound/alert-song.mp3');
	$scope.setVars = function(){
		service.getCurrentPass().then(function(data){
			if($scope.currentPass.senha != ""){
				$scope.calledPass.unshift({"senha" : $scope.currentPass.senha});
				$scope.paginate();
			}
			$scope.currentPass = data;
			$scope.audio.play();

		});
		setTimeout(function(){ $scope.setVars(); }, $scope.timeForRefresh * 1000);
	}

	$scope.refreshPage = function(){
		$scope.paginate();
		console.log("refreshed");
		setTimeout(function(){ $scope.refreshPage(); }, $scope.timeForPageRefresh * 1000);
	}

	$scope.paginate = function(){
		if($scope.maxPerPage * ($scope.page - 1) > $scope.calledPass.length){
			$scope.page = 1;
			$scope.reset = true;
		}
		$scope.showingData = [];
		for (var i = $scope.maxPerPage * ($scope.page - 1); i < $scope.maxPerPage * $scope.page; i++) {
			if(typeof $scope.calledPass[i] != "undefined"){
				$scope.showingData.push($scope.calledPass[i]);
			}
		};
		//$scope.page ++;
		
	}


	$scope.setVars();
	$scope.refreshPage();

	$scope.toggleConfiguration = function(b){
		if(b === true ||  b === false){
			$scope.confPopup = b;
		}else{
			$scope.confPopup = !$scope.confPopup;
		}
	}

	$scope.saveInfo = function(){
		if($scope.newTimer === null || $scope.newTimer == '' || $scope.newTimer == 0){
			toaster.pop('error', "Campo Invalido", "Favor completar o campo");
			return;
		}
		if($scope.newTimer < 1){
			toaster.pop('error', "Campo Invalido", "O numero inserido é inválido");
			return;
		}

		$scope.timeForRefresh = $scope.newTimer;
		localStorage.setItem("timeForRefresh", $scope.timeForRefresh)
		toaster.pop('success', "Sucesso!", "Infornação(ões) alterada(s)");
		$scope.confPopup = false;
	}
}])
.directive("configurationPopup", function() {
  return {
    restrict: 'E',
    templateUrl: "template/configurationPopup.tpl.html"
  };
})
.directive('stopEvent', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			element.bind(attr.stopEvent, function (e) {
				e.stopPropagation();
			});
		}
	};
})
.directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits,10);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
});