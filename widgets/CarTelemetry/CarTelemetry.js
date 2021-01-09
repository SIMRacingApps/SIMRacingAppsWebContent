'use strict';
/**
 * This widget displays a TV style Car Telemetry to match the LapsBanner and StandingsBanner.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-car-telemetry sra-data-car-telemetry="REFERENCE"&gt;&lt;/sra-car-telemetry&gt;<br />
 * </b>
 * <img src="../widgets/CarTelemetry/icon.png" alt="Image goes here"/>
 * @ngdoc directive
 * @name sra-car-telemetry
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 50.
 * @author Jeffrey Gilliam
 * @since 1.3
 * @copyright Copyright (C) 2015 - 2021 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps'
       ,'css!widgets/CarTelemetry/CarTelemetry'
       ,'widgets/CarNumber/CarNumber'
],function(SIMRacingApps) {

    var self = {
        name:            "sraCarTelemetry",
        url:             'CarTelemetry',
        template:        'CarTelemetry.html',
        defaultWidth:    200,
        defaultHeight:   100,
        defaultInterval: 50    //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$rootScope', '$timeout', '$http',
    function(sraDispatcher,   $filter,   $rootScope,   $timeout,   $http) {
        return {
            restrict:    'EA',
            scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                $scope.brakePercentage = 0;
                
                //load translations, if you have any comment out if you do not so it will not look for them
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });

                /** your code goes here **/

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name]     = sraDispatcher.getTruthy($scope.sraArgsCAR, $attrs.sraArgsCar, $scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "REFERENCE");

                /** your code goes here **/
                $attrs.sraArgsData += ";Car/"+$scope.value+"/DriverName";
                $attrs.sraArgsData += ";Car/"+$scope.value+"/Gauge/Speedometer/ValueCurrent";
                $attrs.sraArgsData += ";Car/"+$scope.value+"/Gauge/Tachometer/ValueCurrent";
                $attrs.sraArgsData += ";Car/"+$scope.value+"/Gauge/Brake/ValueCurrent";
                $attrs.sraArgsData += ";Car/"+$scope.value+"/Gauge/Throttle/ValueCurrent";

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                /**watches go here **/
            }
        };
    }]);

    return self;
});
