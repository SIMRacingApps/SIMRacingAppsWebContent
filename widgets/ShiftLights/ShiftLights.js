'use strict';
/**
 * This widget is a generic implementation of the shift light bar.
 * It shows progressive lights, green, yellow, red as approaching the shift point.
 * It also shows the same lights as you are approaching pit road speed.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-shift-lights&gt;&lt;/sra-shift-lights&gt;<br />
 * </b>
 * <img src="../widgets/ShiftLights/icon.png" />
 * @ngdoc directive
 * @name sra-shift-lights
 * @param {boolean} sra-pit-speeding If false, does not use the lights for pit road speed. Default is true.
 * @param {milliseconds} data-sra-args-flash-rate The rate to flash when CRITICAL state is reached.
 * @param {boolean} data-sra-args-flash-on-critical Enable or disable the flash on critical. Defaults to true.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2022 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/ShiftLights/ShiftLights'],
function(SIMRacingApps) {

    var self = {
        name:            "sraShiftLights",
        url:             'ShiftLights',
        template:        'ShiftLights.html',
        defaultWidth:    800,
        defaultHeight:   100,
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

                $scope.percentages= [
                                          //These should be from lowest to highest
                                          { value: 0.00, color: 'SIMRacingApps-Widget-ShiftLights-start'  },
                                          { value: 0.10, color: 'SIMRacingApps-Widget-ShiftLights-start'  },
                                          { value: 0.20, color: 'SIMRacingApps-Widget-ShiftLights-start'  },
                                          { value: 0.30, color: 'SIMRacingApps-Widget-ShiftLights-start'  },
                                          { value: 0.40, color: 'SIMRacingApps-Widget-ShiftLights-middle' },
                                          { value: 0.50, color: 'SIMRacingApps-Widget-ShiftLights-middle' },
                                          { value: 0.60, color: 'SIMRacingApps-Widget-ShiftLights-middle' },
                                          { value: 0.70, color: 'SIMRacingApps-Widget-ShiftLights-end'    },
                                          { value: 0.80, color: 'SIMRacingApps-Widget-ShiftLights-end'    },
                                          { value: 0.90, color: 'SIMRacingApps-Widget-ShiftLights-end'    }
                                         ];
                
                $scope.maxSizePercent  = 0.8; //controls the spacing/size of the lights. 1.0 means no spacing.
                $scope.offColor        = 'SIMRacingApps-Widget-ShiftLights-off';
                $scope.lights          = [];
                $scope.flashRate       = 100;
                $scope.limitRate       = 500;
                $scope.flashOnCritical = true;
                $scope.pitSpeeding     = true;
                
                $scope.calculateLights = function() {
                    $scope.lights = [];
                    var numberOfLights = $scope.percentages.length;
                    
                    for (var i=0; i < numberOfLights; i++) {
                        var r = Math.min(self.defaultHeight,self.defaultWidth / numberOfLights) / 2;
                        var light = {
                            x:             ((self.defaultWidth / numberOfLights) * i) + ((self.defaultWidth / numberOfLights) / 2),
                            y:             self.defaultHeight / 2,
                            r:             (r * $scope.maxSizePercent),
                            percentage:    $scope.percentages[i],
                            on:            false,
                            className:     $scope.offColor
                        };
                        $scope.lights.push(light);
                    }
                };
                $scope.calculateLights(); //execute this now, just so the array is populated when the SVG element gets added to the DOM.

                $scope.updateColors = function() {
                    var value             = $scope.data.Car.REFERENCE.Gauge.Tachometer.ValueCurrent.Value          || 0.0;
                    var state             = $scope.data.Car.REFERENCE.Gauge.Tachometer.ValueCurrent.State          || 'OFF';
                    var percent           = ($scope.data.Car.REFERENCE.Gauge.Tachometer.ValueCurrent.StatePercent  || 0.0) / 100.0;
                    var speedState        = $scope.data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.State         || 'OFF';
                    var speedPercent      = ($scope.data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.StatePercent || 0.0) / 100.0;
                    var excessiveSpeeding = sraDispatcher.State.isWAYOVERLIMIT(speedState);
                    var pitRoadActive     = $scope.data.Car.REFERENCE.Status.Value.indexOf("PIT") >= 0 && $scope.data.Car.REFERENCE.Status.Value != "LEAVINGPITS";
                    var pitLimiter        = $scope.data.Car.REFERENCE.Messages.Value.indexOf(";PITSPEEDLIMITER;") >= 0;
                    
                    //first turn the light on and off based on where the actual value falls
                    for (var i=0; i < $scope.lights.length; i++) {

                        if (pitLimiter) {
                            $scope.lights[i].on = true;
                        }
                        else
                        if ($scope.pitSpeeding
                        &&  pitRoadActive
                        &&  sraDispatcher.State.isAPPROACHINGLIMIT(speedState)
                        &&  speedPercent >= $scope.lights[i].percentage.value
                        ) {
                            $scope.lights[i].on = true;
                            if (!$scope._blink)
                                $scope.lights[i].className = $scope.lights[i].percentage.color;
                        }
                        else
                        if ($scope.pitSpeeding
                        &&  pitRoadActive
                        &&  sraDispatcher.State.isLIMIT(speedState)
                        ) {
                            $scope.lights[i].on = true;
                            if (!$scope._blink) {
                                //do not turn on the last light, shift the percentages up and don't use the first range
                                if (i < ($scope.lights.length-1) && speedPercent >= $scope.lights[i+1].percentage.value)
                                    $scope.lights[i].className = 'SIMRacingApps-Widget-ShiftLights-overlimit';
                                else
                                    $scope.lights[i].className = 'SIMRacingApps-Widget-ShiftLights-limit';
                            }
                        }
                        else
                        if ($scope.pitSpeeding
                        &&  pitRoadActive
                        &&  sraDispatcher.State.isOVERLIMIT(speedState)
                        ) {
                            $scope.lights[i].on = true;
                            if (!$scope._blink)
                                $scope.lights[i].className = 'SIMRacingApps-Widget-ShiftLights-overlimit';
                        }
                        else
                        if ($scope.pitSpeeding
                        &&  pitRoadActive
                        &&  sraDispatcher.State.isWAYOVERLIMIT(speedState)
                        ) {
                            $scope.lights[i].on = true;
                            if (!$scope._blink)
                                $scope.lights[i].className = 'SIMRacingApps-Widget-ShiftLights-overlimit';
                        }
                        else
                        if (sraDispatcher.State.isSHIFTLIGHTS(state) 
                        && percent >= $scope.lights[i].percentage.value
                        ) {
                            $scope.lights[i].on = true;
                            if (!$scope._blink)
                                $scope.lights[i].className = $scope.lights[i].percentage.color;
                        }
                        else
                        if (sraDispatcher.State.isSHIFT(state) 
                        ||  sraDispatcher.State.isSHIFTBLINK(state)
                        ||  sraDispatcher.State.isCRITICAL(state)) {
                            $scope.lights[i].on = true;
                            if (!$scope._blink)
                                $scope.lights[i].className = 'SIMRacingApps-Widget-ShiftLights-end';
                        } 
                        else {
                            $scope.lights[i].on = false;
                            if (!$scope._blink)
                                $scope.lights[i].className = $scope.offColor;
                        }
                    }
                    
                    if ($scope.flashOnCritical
                    && (
                          sraDispatcher.State.isSHIFTBLINK(state) 
                       || sraDispatcher.State.isCRITICAL(state)
                       || ($scope.pitSpeeding && pitRoadActive &&  sraDispatcher.State.isWAYOVERLIMIT(speedState))
                       || pitLimiter
                       )
                    ) {
                        //TODO: Make it blink between critical and warning, self.blinkRate
                        if ($scope._blink == null) {
                            console.log("ShiftLights - Blink Start");
                            $scope._blink = $interval(function() {
                                    
                                var currentColor = $scope.lights[0].className;
                                
                                for (var j=0; j < $scope.lights.length; j++) {
                                    if (currentColor != $scope.offColor) {
                                        $scope.lights[j].className  = $scope.offColor;
                                    }
                                    else {
                                        $scope.lights[j].className = $scope.lights[j].on 
                                                                   ? 'SIMRacingApps-Widget-ShiftLights-end' 
                                                                   : $scope.offColor;
                                    }
                                }
                            }, pitLimiter ? $scope.limitRate : $scope.flashRate);
                        }
                    }
                    else {
                        //stop the blinking if we are not in the critical state.
                        if ($scope._blink) {
                            console.log("ShiftLights - Blink Stop");
                            $interval.cancel($scope._blink);
                            $scope._blink = null;
                        }

                    }
                };
            }]
            , link: function($scope,$element,$attrs) {
                $scope.maxSizePercent = sraDispatcher.getTruthy($scope.sraArgsMAXSIZEPERCENT, $attrs.sraArgsMaxSizePercent, $scope.maxSizePercent)  * 1.0;
                $scope.flashRate      = sraDispatcher.getTruthy($scope.sraArgsFLASHRATE, $attrs.sraArgsFlashRate, $scope.flashRate) * 1;
                $scope.flashOnCritical= sraDispatcher.getBoolean($scope.sraArgsFLASHONCRITICAL,$attrs.sraArgsFlashOnCritical,$scope.flashOnCritical,true);
                $scope.pitSpeeding    = sraDispatcher.getBoolean($scope.sraArgsPITSPEEDING, $attrs.sraArgsPitSpeeding, $scope.pitSpeeding);

                $attrs.sraArgsData  = "Car/REFERENCE/Gauge/Tachometer/ValueCurrent"
                                    + ";Car/REFERENCE/Gauge/Speedometer/ValueCurrent"
                                    + ";Car/REFERENCE/Status"
                                    + ";Car/REFERENCE/Messages";

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
