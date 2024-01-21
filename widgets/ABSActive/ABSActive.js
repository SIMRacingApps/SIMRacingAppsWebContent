'use strict';
/**
 * This widget is a generic implementation of an ABS Active light. 
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-a-b-s-active&gt;&lt;/sra-a-b-s-active&gt;<br />
 * </b>
 * <img src="../widgets/ABSActive/icon.png" />
 * @ngdoc directive
 * @name sra-a-b-s-active
 * @author Jeffrey Gilliam
 * @since 1.20
 * @copyright Copyright (C) 2015 - 2024 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/ABSActive/ABSActive'],
function(SIMRacingApps) {

    var self = {
        name:            "sraABSActive",
        url:             'ABSActive',
        template:        'ABSActive.html',
        defaultWidth:    480,
        defaultHeight:   480,
        defaultInterval: 30   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$location', '$interval', '$rootScope',
    function(sraDispatcher,  $filter,   $location,    $interval,   $rootScope) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                $scope.offColor        = 'SIMRacingApps-Widget-ABSActive-off';
                $scope.onColor         = 'SIMRacingApps-Widget-ABSActive-on';
                
                $scope.updateColors = function() {
                    var value             = $scope.data.Car.REFERENCE.Gauge.ABSActive.ValueCurrent.Value         || "OFF";
                    
                    if (value == "ON") {
                        $scope.className = $scope.onColor;
                    }
                    else {
                        $scope.className = $scope.offColor;
                    }
                };
            }]
            , link: function($scope,$element,$attrs) {

                $attrs.sraArgsData =   "Car/REFERENCE/Gauge/ABSActive/ValueCurrent";

                $scope.$watch("data.Car.REFERENCE.Gauge.ABSActive.ValueCurrent.Value",         $scope.updateColors);

                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

           /**standard code that should be in every directive **/
                $scope.names        = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

            }
        };
    }]);

    return self;
});
