angular.module('fila',['serviceModule', 'toaster', 'ngAnimate'])

.controller('mainController', ['$scope', 'service', 'toaster', function($scope, service, toaster) {
	
	
	$scope.confPopup = false;
	
	$scope.currentPass = [];
	$scope.calledPass = [];
	$scope.calledData = [];
	$scope.showingData = [];
	$scope.peddingCalledPass = [];
	
	//Maximo registros por pagina no historico
	$scope.maxPerPage = 7;
	//Maximo registros por pagina no principal
	$scope.maxCall = 6;


	$scope.startCall = 0;
	$scope.page = 1;
	$scope.audio = new Audio('sound/alert-song.mp3');

	$scope.setLocalStorageVars = function(){
		$scope.timeForRefresh = localStorage.getItem("timeForRefresh") == null ? 10 : localStorage.getItem("timeForRefresh");
		$scope.timeForPageRefresh = localStorage.getItem("timeForPageRefresh") == null ? 5 : localStorage.getItem("timeForPageRefresh");
		$scope.cacheLimit = localStorage.getItem("cacheLimit") == null ? $scope.maxPerPage*10 : localStorage.getItem("cacheLimit"); 
		$scope.newTimer = $scope.timeForRefresh;
		$scope.newTimerForPageRefresh = $scope.timeForPageRefresh;
		$scope.cacheLimitCopy = $scope.cacheLimit;

		$scope.colors = {

			"boxColor" : localStorage.getItem("boxColor") == null ? "#0E2F44" : localStorage.getItem("boxColor"),
			"boxFont" : localStorage.getItem("boxFont") == null ? "#FFFFFF" : localStorage.getItem("boxFont"),
			"titleColor" : localStorage.getItem("titleColor") == null ? "#000000" : localStorage.getItem("titleColor"),
			"background" :  localStorage.getItem("background") == null ? "rgba(255, 255, 255, 0.4)" : localStorage.getItem("background"),
			"backgroundImage" :  localStorage.getItem("backgroundImage") == null ? "http://wallpaperscraft.com/image/50782/1920x1080.jpg" : localStorage.getItem("backgroundImage"),
		};

		$scope.colorsCopy = angular.copy($scope.colors);
	}

	$scope.setLocalStorageVars();

	$scope.getPass = function(){
		service.getCurrentPass().then(function(data){
			var hashCurrentData = {};

			for(var i = 0; i < $scope.calledData.length; i++){
				hashCurrentData[$scope.calledData[i].senha] = i;
			}

			for(var i = 0; i < $scope.calledData.length; i++){
				for(var y = 0; y < data.length; y++){
					if($scope.calledData[i].senha == data[y].senha) hashCurrentData[$scope.calledData[i].senha] = -1;
				}
			}

			for(k in hashCurrentData){
				if(hashCurrentData[k] != -1){
					$scope.calledData[hashCurrentData[k]]["data"] = new Date();
					$scope.peddingCalledPass.unshift(angular.copy($scope.calledData[hashCurrentData[k]]));
				}
			}
			$scope.calledData = data;
			$scope.startCall = 0;
			$scope.callerPass();

		}); 
	}

	$scope.callerPass = function(){
		if($scope.calledData.length == $scope.startCall){
			$scope.getPass();
			return;
		}

		var limit = $scope.maxCall + $scope.startCall;

		if(limit > $scope.calledData.length) 
			limit = $scope.calledData.length;

		$scope.currentPass = [];
		for(var i = $scope.startCall; i < limit; i++){
			$scope.currentPass.push($scope.calledData[i]);
		} 
		$scope.startCall = limit;
		$scope.$apply();
		$scope.audio.play();
		setTimeout(function(){ $scope.callerPass(); }, $scope.timeForRefresh * 1000);
	}

	$scope.refreshPage = function(){
		$scope.paginate();
		setTimeout(function(){ $scope.refreshPage(); }, $scope.timeForPageRefresh * 1000);
	}

	$scope.paginate = function(){
		if($scope.maxPerPage * ($scope.page - 1) > $scope.calledPass.length - 1){
			$scope.page = 1;
			$scope.reset = true;
			if(($scope.calledPass.length + $scope.peddingCalledPass.length) > $scope.cacheLimit){
				for(var i = $scope.calledPass.length - $scope.cacheLimit; i < $scope.calledPass.length; i++){
					$scope.calledPass.splice(i, 1);
				}
			}
			for(var i = 0; i < $scope.peddingCalledPass.length; i ++){
				$scope.calledPass.unshift($scope.peddingCalledPass[i]);
			}
			$scope.peddingCalledPass = [];
		}
		$scope.refreshHistorical();
		$scope.page ++;
	}

	$scope.refreshHistorical = function(){
		$scope.showingData = [];
		for (var i = $scope.maxPerPage * ($scope.page - 1); i < $scope.maxPerPage * $scope.page; i++) {
			if(typeof $scope.calledPass[i] != "undefined"){
				$scope.showingData.push($scope.calledPass[i]);
			}
		};
	};


	$scope.callerPass();
	$scope.refreshPage();

	$scope.toggleConfiguration = function(b){
		if(b === true ||  b === false){
			$scope.confPopup = b;
		}else{
			$scope.confPopup = !$scope.confPopup;
		}
	}

	$scope.saveInfo = function(){
		if($scope.newTimer === null || $scope.newTimer == '' || $scope.newTimer == 0 || 
			$scope.newTimerForPageRefresh === null || $scope.newTimerForPageRefresh == '' || $scope.newTimerForPageRefresh == 0|| 
			$scope.cacheLimitCopy === null || $scope.cacheLimitCopy == '' || $scope.cacheLimitCopy == 0 || $scope.colorsCopy.boxColor == "" || $scope.colorsCopy.boxFont == "" || $scope.colorsCopy.titleColor == "" || 
			$scope.colorsCopy.background == "" || $scope.colorsCopy.backgroundImage == ""){
			toaster.pop('error', "Campo Invalido", "Favor completar o campo");
			return;
		}
		
		if($scope.newTimer < 1 || $scope.newTimerForPageRefresh < 1 || $scope.cacheLimitCopy < 1){
			toaster.pop('error', "Campo Invalido", "O numero inserido é inválido");
			return;
		}


		$scope.colors = {
			"boxColor" : $scope.colorsCopy.boxColor,
			"boxFont" : $scope.colorsCopy.boxFont,
			"titleColor" : $scope.colorsCopy.titleColor,
			"background" :  $scope.colorsCopy.background,
			"backgroundImage" : $scope.colorsCopy.backgroundImage,
		};
		localStorage.setItem("boxColor", $scope.colors.boxColor);
		localStorage.setItem("boxFont", $scope.colors.boxFont);
		localStorage.setItem("titleColor", $scope.colors.titleColor);
		localStorage.setItem("background", $scope.colors.background);
		localStorage.setItem("backgroundImage", $scope.colors.backgroundImage);

		$scope.timeForPageRefresh = $scope.newTimerForPageRefresh;
		localStorage.setItem("timeForPageRefresh", $scope.timeForPageRefresh);

		$scope.cacheLimit = $scope.cacheLimitCopy;
		localStorage.setItem("cacheLimit", $scope.cacheLimit);

		$scope.timeForRefresh = $scope.newTimer;
		localStorage.setItem("timeForRefresh", $scope.timeForRefresh);

		toaster.pop('success', "Sucesso!", "Infornação(ões) alterada(s)");

		$scope.confPopup = false;
	}

	$scope.resetToDefault = function(){
		localStorage.clear();
		$scope.setLocalStorageVars();
		toaster.pop('success', "Sucesso!", "Configurações resetadas!");
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