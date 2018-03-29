'use strict';
/**
 * This widget displays when car(s) are to the left of you
 * <p>
 * Example(s):
 * <p><b>
 * &lt;sra-car-left &gt;&lt;/sra-car-left&gt;<br />
 * </b>
 * <img src="../widgets/CarLeft/icon.png" />
 * @ngdoc directive
 * @name sra-car-left
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 20.
 * @author Jeffrey Gilliam
 * @since 1.6
 * @copyright Copyright (C) 2015 - 2017 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/CarLeft/CarLeft'],
function(SIMRacingApps) {

    var self = {
        name:            "sraCarLeft",
        url:             'CarLeft',
        template:        'CarLeft.html',
        defaultWidth:    300,
        defaultHeight:   300,
        defaultInterval: 20   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter','$rootScope',
    function(sraDispatcher,   $filter,  $rootScope) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                $scope.arrow = "";
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope
                //$scope.value = $scope[self.name] = $attrs[self.name] || $attrs.sraArgsCar || $attrs.sraArgsCarNumber || "REFERENCE";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsCAR, $attrs.sraArgsCar, $attrs.sraArgsCarNumber, $scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "REFERENCE");


                //removed these attributes from the template because sraCar was not resolved at the time of compilation
                $attrs.sraArgsData =
                    ";Car/" + $scope.value + "/SpotterMessage";                

                $scope.$watch("data.Car['"+$scope.value+"'].SpotterMessage.Value", function() {
                    if ($scope.data.Car[$scope.value].SpotterMessage.Value == "CARLEFT"
                    ||  $scope.data.Car[$scope.value].SpotterMessage.Value == "CARLEFTRIGHT") {
                        $scope.arrow = "<";
                    }
                    else
                    if ($scope.data.Car[$scope.value].SpotterMessage.Value == "CARSLEFT") {
                        $scope.arrow = "<<";
                    }
                    else {
                        $scope.arrow = "";
                    }
                });

            /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

            }
        };
    }]);

    return self;
});
