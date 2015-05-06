angular.module('serviceModule',[])

.factory('service', function($http, $q) {
  return  {
    getCurrentPass : function(){
      var deferred = $q.defer();
      $http.get('http://picheli.com.br/senha/generate.php').success(function(data) { 
          deferred.resolve(data);
      }).error(function(msg, code) {
        deferred.reject(msg);
      });
      return deferred.promise;
    }
  }
});