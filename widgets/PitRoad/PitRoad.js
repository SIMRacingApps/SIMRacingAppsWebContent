'use strict';
/**
 * This widget displays pit road information, like current speed, speed limit, and time to the stall.
 * It also displays yellow as you are approaching pit road speed, green when you are near it and red when you are over.
 * It will blink if you exceed the speed limit by more than 15 mph (25 kph).
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-pit-road&gt;&lt;/sra-pit-road&gt;<br />
 * </b>
 * <img src="../widgets/PitRoad/icon.png" />
 * @ngdoc directive
 * @name sra-pit-road
 * @param {integer} data-sra-args-pit-countdown The amount of time you must be from your pit before showing the count down timer. Default is -10.
 * @param {integer} PITCOUNTDOWN Can be set as a URL parameter, &PITCOUNTDOWN=-10.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 50.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2017 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/PitRoad/PitRoad','widgets/DataTable/DataTable'],
function(SIMRacingApps) {

    var self = {
        name:            "sraPitRoad",
        url:             'PitRoad',
        template:        'PitRoad.html',
        defaultWidth:    800,
        defaultHeight:   480,
        defaultInterval: 50   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$rootScope', '$interval',
    function(sraDispatcher,   $filter,   $rootScope,   $interval) {
        return {
            restrict:    'EA',
            scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                //load translations, if you have any un-comment this
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });

                /** your code goes here **/
                $scope.sraPitCountDown = 10;
                $scope.blinkState = "OFF";
                $scope._blink     = null;
                $scope.countDownClass = "SIMRacingApps-Widget-PitRoad-countdown-OFF";
                $scope.countDown_blink = null;
                

                $scope.updateBlink = function() {
                    if ($scope.data.Car.REFERENCE.Status.Value.match(/PIT/)) {
                        //var speedlimit = $scope.data.Car.REFERENCE.PitSpeedLimit.Value;
                        //var speed      = $scope.data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.Value;
                        //var overlimit  = $scope.data.Car.REFERENCE.PitSpeedLimit.UOM == "mph" ? 15.0 : 25.0;

                        //if (speed > speedlimit + overlimit) {
                        if ($scope.data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.State == "WAYOVERLIMIT") {
                            if (!$scope._blink) {
                                $scope._blink = $interval(function() {
                                    if ($scope.blinkState == "ON") {
                                        $scope.blinkState = "OFF";
                                    }
                                    else {
                                        $scope.blinkState = "ON";
                                    }
                                }, 200);
                            }
                        }
                        else {
                            if ($scope._blink) {
                                $interval.cancel($scope._blink);
                                $scope._blink = null;
                                $scope.blinkState = "OFF";
                            }
                        }
                    }
                    else {
                        if ($scope._blink) {
                            $interval.cancel($scope._blink);
                            $scope._blink = null;
                            $scope.blinkState = "OFF";
                        }
                    }
                };

                $scope.updateCountDown = function() {
                    var timeToPitStall = Math.round($scope.data.Session.DiffCars.REFERENCE.PITSTALL.Value);
                    
                    if (timeToPitStall <= $scope.sraPitCountDown && timeToPitStall > 0) {
                        if (!$scope.countDown_blink) {
                            $scope.countDown_blink = $interval(function() {
                                if ($scope.countDownClass == "SIMRacingApps-Widget-PitRoad-countdown-ON") {
                                    $scope.countDownClass = "SIMRacingApps-Widget-PitRoad-countdown-OFF";
                                }
                                else {
                                    $scope.countDownClass = "SIMRacingApps-Widget-PitRoad-countdown-ON";
                                }
                            }, 500);
                        }
                    }
                    else {
                        if ($scope.countDown_blink) {
                            $interval.cancel($scope.countDown_blink);
                            $scope.countDown_blink = null;
                            $scope.countDownClass = "SIMRacingApps-Widget-PitRoad-countdown-OFF";
                        }
                    }
                };
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");

                /** your code goes here **/
                $scope.sraPitCountdown = Math.abs(sraDispatcher.getTruthy($scope.sraPITCOUNTDOWN, $attrs.sraPITCOUNTDOWN, $attrs.sraArgsPitCountdown, $scope.sraPitCountDown) * 1);

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                $scope.$watch("data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.Value",$scope.updateBlink);
                
                $scope.$watch("data.Session.DiffCars.REFERENCE.PITSTALL.Value", $scope.updateCountDown);
            }
        };
    }]);

    return self;
});
