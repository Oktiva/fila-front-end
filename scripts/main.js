angular.module('fila',['serviceModule', 'toaster', 'ngAnimate'])

.controller('mainController', ['$scope', 'service', 'toaster', function($scope, service, toaster) {
	$scope.calledPass = [];
	$scope.currentPass = {"senha" : ""};
	$scope.confPopup = false;
	$scope.timeForRefresh = localStorage.getItem("timeForRefresh") == null ? 10 : localStorage.getItem("timeForRefresh");
	$scope.newTimer = $scope.timeForRefresh;

	$scope.setVars = function(){
		service.getCalledPass().then(function(data){
			$scope.calledPass = data;
		});
		service.getCurrentPass().then(function(data){
			$scope.currentPass = data;
		});
		setTimeout(function(){ $scope.setVars(); }, $scope.timeForRefresh * 1000);
	}

	$scope.setVars();

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