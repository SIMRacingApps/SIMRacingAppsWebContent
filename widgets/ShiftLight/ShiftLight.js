'use strict';
/**
 * This widget is a generic implementation of a shift light. 
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-shift-light&gt;&lt;/sra-shift-light&gt;<br />
 * </b>
 * <img src="../widgets/ShiftLight/icon.png" />
 * @ngdoc directive
 * @name sra-shift-light
 * @param {boolean} sra-pit-speeding If false, does not use the lights for pit road speed. Default is true.
 * @param {milliseconds} data-sra-args-flash-rate The rate to flash when CRITICAL state is reached.
 * @param {boolean} data-sra-args-flash-on-critical Enable or disable the flash on critical. Defaults to true.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2022 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/ShiftLight/ShiftLight'],
function(SIMRacingApps) {

    var self = {
        name:            "sraShiftLight",
        url:             'ShiftLight',
        template:        'ShiftLight.html',
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

                $scope.offColor        = 'SIMRacingApps-Widget-ShiftLight-off';
                $scope.onColor         = 'SIMRacingApps-Widget-ShiftLight-on';
                $scope.flashRate       = 300;
                $scope.flashRateCritical = 100;
                $scope.flashRateLimiter= 500;
                $scope.pitSpeeding        = true;
                $scope.lightOn         = false;
                $scope.className       = $scope.offColor;
                
                $scope.updateColors = function() {
                    var value             = $scope.data.Car.REFERENCE.Gauge.Tachometer.ValueCurrent.Value         || 0.0;
                    var state             = $scope.data.Car.REFERENCE.Gauge.Tachometer.ValueCurrent.State         || 'OFF';
                    var speedValue        = $scope.data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.Value        || 0.0;
                    var speedState        = $scope.data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.State        || 'OFF';
                    var excessiveSpeeding = sraDispatcher.State.isWAYOVERLIMIT(speedState); //speedValue > ($scope.data.Car.REFERENCE.PitSpeedLimit.Value + ($scope.data.Car.REFERENCE.PitSpeedLimit.UOM == "mph" ? 15.0 : 25.0));
                    var pitRoadActive     = $scope.data.Car.REFERENCE.Status.Value.indexOf("PIT") >= 0 && $scope.data.Car.REFERENCE.Status.Value != "LEAVINGPITS";
                    var pitLimiter        = $scope.data.Car.REFERENCE.Messages.Value.indexOf(";PITSPEEDLIMITER;") >= 0;
                    
                    if (pitLimiter) {
                        $scope.lightOn = true;
                    }
                    else
                    if (sraDispatcher.State.isSHIFT(state) 
                    ||  sraDispatcher.State.isSHIFTBLINK(state)
                    ||  sraDispatcher.State.isCRITICAL(state)) {
                        $scope.lightOn = true;
                        if (!$scope._blink)
                            $scope.className = $scope.onColor;
                    } 
                    else
                    if ($scope.pitSpeeding && pitRoadActive 
                    && (sraDispatcher.State.isOVERLIMIT(speedState) || sraDispatcher.State.isWAYOVERLIMIT(speedState))
                    ) {
                        $scope.lightOn = true;
                        if (!$scope._blink)
                            $scope.className = $scope.onColor;
                    }
                    else {
                        $scope.lightOn = false;
                        if (!$scope._blink)
                            $scope.className = $scope.offColor;
                    }
                    
                    if (($scope.pitSpeeding && pitRoadActive && excessiveSpeeding)
                    ||  sraDispatcher.State.isSHIFTBLINK(state) 
                    ||  sraDispatcher.State.isCRITICAL(state)
                    ||  pitLimiter
                    ) {
                        //TODO: Make it blink between critical and warning, self.blinkRate
                        if ($scope._blink == null) {
                            console.log("ShiftLight - Blink Start");
                            $scope._blink = $interval(function() {
                                    
                                if ($scope.className != $scope.offColor) {
                                    $scope.className  = $scope.offColor;
                                }
                                else {
                                    $scope.className = $scope.lightOn 
                                                     ? $scope.onColor 
                                                     : $scope.offColor;
                                }
                            }, pitLimiter ? $scope.flashRateLimiter : sraDispatcher.State.isSHIFTBLINK(state) ? $scope.flashRate : $scope.flashRateCritical);
                        }
                    }
                    else {
                        if ($scope._blink) {
                            console.log("ShiftLight - Blink Stop");
                            $interval.cancel($scope._blink);
                            $scope._blink = null;
                        }
                    }
                };
            }]
            , link: function($scope,$element,$attrs) {
                $scope.flashRate         = sraDispatcher.getTruthy($scope.sraArgsFLASHRATE, $attrs.sraArgsFlashRate, $scope.flashRate) * 1;
                $scope.flashRateCritical = sraDispatcher.getTruthy($scope.sraArgsFLASHRATECRITICAL, $attrs.sraArgsFlashRateCritical, $scope.flashRateCritical) * 1;
                $scope.pitSpeeding       = sraDispatcher.getBoolean($scope.sraArgsPITSPEEDING, $attrs.sraArgsPitSpeeding, $scope.pitSpeeding);

                $attrs.sraArgsData =   "Car/REFERENCE/Gauge/Tachometer/ValueCurrent";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/Speedometer/ValueCurrent";
                $attrs.sraArgsData += ";Car/REFERENCE/Status";
                $attrs.sraArgsData += ";Car/REFERENCE/PitSpeedLimit";
                $attrs.sraArgsData += ";Car/REFERENCE/Messages";

                $scope.$watch("data.Car.REFERENCE.Gauge.Tachometer.ValueCurrent.Value",         $scope.updateColors);
                $scope.$watch("data.Car.REFERENCE.Gauge.Tachometer.ValueCurrent.State",         $scope.updateColors);
                $scope.$watch("data.Car.REFERENCE.Gauge.Tachometer.ValueCurrent.StatePercent",  $scope.updateColors);
                $scope.$watch("data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.Value",        $scope.updateColors);
                $scope.$watch("data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.State",        $scope.updateColors);
                $scope.$watch("data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.StatePercent", $scope.updateColors);
                $scope.$watch("data.Car.REFERENCE.Messages.Value",                              $scope.updateColors);

                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

           /**standard code that should be in every directive **/
                $scope.names        = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

            }
        };
    }]);

    return self;
});
