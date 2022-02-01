'use strict';
/**
 * This widget displays a wind gauge showing north, south, east and west.
 * It shows the wind speed and direction.
 * It can be rotated so that north points in the same direction as the {@link sra-track-map TrackMap} widget.
 * It can also be rotated so the bearing of the reference car is at the top, like a compass. 
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-wind-gauge data-sra-args-rotate="false"&gt;&lt;/sra-wind-gauge&gt;<br />
 * </b>
 * <img src="../widgets/WindGauge/icon.png" atl="Image goes here"/>
 * @ngdoc directive
 * @name sra-wind-gauge
 * @param {boolean} data-sra-args-rotate true will rotate the gauge so that north points in the same direction as the {@link sra-track-map TrackMap} widget. Defaults to false.
 * @param {string} data-sra-args-perspective The perspective can be a car identifier or 'TRACK' and rotation will be based on that. Default is 'TRACK'.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 100.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2022 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/WindGauge/WindGauge'],
function(SIMRacingApps) {

    var self = {
        name:            "sraWindGauge",
        url:             'WindGauge',
        template:        'WindGauge.html',
        defaultWidth:    480,
        defaultHeight:   480,
        defaultInterval: 100   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$rootScope',
    function(sraDispatcher,   $filter,   $rootScope) {
        return {
            restrict:    'EA',
            scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                $scope.north = 'rotate(0 240,240)';
                
                //load translations
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });
                /** your code goes here **/
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData    = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");

                /** your code goes here **/
                $scope.rotate      = sraDispatcher.getBoolean($scope.sraArgsROTATE, $attrs.sraRotate, $attrs.sraArgsRotate, false);
                $scope.perspective = sraDispatcher.getTruthy($scope.sraArgsPERSPECTIVE, $attrs.sraPerspective, $attrs.sraArgsPerspective, 'TRACK'); 

                $attrs.sraArgsData  += ";Track/WeatherWindSpeed;Track/WeatherWindDirection";

                if ($scope.rotate) {
                    if ($scope.perspective == 'TRACK') {
                        $attrs.sraArgsData += ";Track/North/deg";
                        $scope.$watch("data.Track.North.deg.Value", function(newValue,oldValue,my$scope) {
                            if (angular.isDefined(newValue) && newValue != "")
                                $scope.north = 'rotate('+(newValue - 270.0)+' 240,240)';
                        });
                    }
                    else {
                        $attrs.sraArgsData += ";Car/"+$scope.perspective+"/Bearing/deg";
                        $scope.$watch("data.Car['"+$scope.perspective+"'].Bearing.deg.Value", function(newValue,oldValue,my$scope) {
                            if (angular.isDefined(newValue) && newValue != "")
                                //bearing is the heading for which you are going relative to north
                                //my guage has east at 90 degrees to the right. If the bearing is 90
                                //then I want east at the top, so I rotate the gauge counter clockwise to the bearing.
                                $scope.north = 'rotate('+(-newValue)+' 240,240)';
                        });
                    }
                }

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));
                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
