angular.module('serviceModule',[])

.factory('service', function($http, $q) {
  return  {
    getCalledPass : function(){
      var deferred = $q.defer();
      $http.get('data/calledPass.json').success(function(data) { 
          deferred.resolve(data);
      }).error(function(msg, code) {
        deferred.reject(msg);
      });
      return deferred.promise;
    },
    getCurrentPass : function(){
      var deferred = $q.defer();
      $http.get('data/currentPass.json').success(function(data) { 
          deferred.resolve(data);
      }).error(function(msg, code) {
        deferred.reject(msg);
      });
      return deferred.promise;
    }
  }
});