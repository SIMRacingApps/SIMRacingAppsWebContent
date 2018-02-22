'use strict';

require(SIMRacingAppsRequireConfig,
['angular','angular-sanitize'],
function( angular,angularSanitize ) {
    angular.element(document).ready(function() {

        var module = angular.module('SIMRacingApps',['ngSanitize']);

        //call modules configuration function
        module.config(
               ['$locationProvider',
        function($locationProvider) {
            $locationProvider.html5Mode(true);  //this is for the $location service to work right.
        }]);
        
        module.controller("SIMRacingApps-Controller",
        ['$scope', '$http', '$window', '$location', 
        function($scope,$http,$window,$location) {

            $scope.headers = {};
            $scope.listings = {};
            $scope.version = {};
            $scope.versionString = "";

//            sraDispatcher.loadTranslations("/SIMRacingApps","text",function(path) {
//                $scope.translations = sraDispatcher.getTranslation(path,"auto");
//            });
            
            var request = {
                method:  'GET',
                url:     '/SIMRacingApps/listings',
                cache:   false,
                timeout: 5000
            };
            
            $http(request)
                .success(function(data, status, headers, config) {
                    $scope.version = data.version;
                    $scope.headers = data.headers;
                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("error - "+status);
                });

            $http({
                method:  'GET',
                url:     '/SIMRacingApps/useroverrides',
                cache:   false,
                timeout: 5000
            })
                .success(function(data, status, headers, config) {
                    console.log("SIMRacingApps.com/useroverrides: success");
                    $scope.useroverrides = data;
                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("SIMRacingApps.com/useroverrides: error - "+status);
                });
        }]);
        
        angular.bootstrap(document.body,['SIMRacingApps']);
    });
});
