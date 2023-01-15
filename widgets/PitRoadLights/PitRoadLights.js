'use strict';
/**
 * This widget is a generic implementation of the Pit Road Lights. 
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-pit-road-lights&gt;&lt;/sra-pit-road-lights&gt;<br />
 * </b>
 * <img src="../widgets/PitRoadLights/icon.png" />
 * @ngdoc directive
 * @name sra-pit-road-lights
 * @author Jeffrey Gilliam
 * @since 19.0
 * @copyright Copyright (C) 2015 - 2023 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/PitRoadLights/PitRoadLights'],
function(SIMRacingApps) {

    var self = {
        name:            "sraPitRoadLights",
        url:             'PitRoadLights',
        template:        'PitRoadLights.html',
        defaultWidth:    960,
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

                $scope.openColor        = 'SIMRacingApps-Widget-PitRoadLights-open';
                $scope.closedColor      = 'SIMRacingApps-Widget-PitRoadLights-closed';
                $scope.className        = $scope.openColor;
                
                $scope.updateColors = function() {
                    var value             = $scope.data.Session.IsPitRoadOpen.Value;

                    if (value) {
                        $scope.className = $scope.openColor;
                    } 
                    else {
                        $scope.className = $scope.closedColor;
                    }
                };
            }]
            , link: function($scope,$element,$attrs) {
                $attrs.sraArgsData =   "Session/IsPitRoadOpen";

                $scope.$watch("data.Session.IsPitRoadOpen.Value",         $scope.updateColors);

                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

           /**standard code that should be in every directive **/
                $scope.names        = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

            }
        };
    }]);

    return self;
});
