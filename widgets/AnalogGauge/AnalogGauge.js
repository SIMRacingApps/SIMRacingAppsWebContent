'use strict';
/**
 * This widget is a generic implementation of an Analog Gauge. 
 * All of the Spek Gauges simply use this widget by passing in the different parameters.
 * It is configured using the avaiLabel arguments.
 * All arguments that take degrees, considers zero degrees at 3 o'clock.
 * All sizes are in pixels relative to 480x480. 
 * If a gauge is resized, it will automatically adjust these values.
 * <p>
 * Other values, the gauge needs, are sent by the SIM to control, minimum, maximum, states, and intervals for the major,minor.
 * <p>
 * Example of how the Tachometer uses this:
 * <p><b>
 * <pre>
 *  &lt;sra-analog-gauge
 *       class                          = "SIMRacingApps-Widget-AnalogGauge-Spek-Tachometer"
 *       data-sra-args-analog-gauge     = "Tachometer"
 *       data-sra-args-start-angle      = "60"
 *       data-sra-args-end-angle        = "10"
 *       data-sra-args-x-label1         = "400"
 *       data-sra-args-y-label1         = "325"
 *       data-sra-args-font-size-label1 = "25"
 *       data-sra-args-anchor-label1    = "end"
 *       data-sra-args-x-label2         = "400"
 *       data-sra-args-y-label2         = "350"
 *       data-sra-args-font-size-label2 = "20"
 *       data-sra-args-anchor-label2    = "end"
 *       data-sra-args-round-to         = "{{sraRoundTo}}"
 *       data-sra-args-show-value       = "{{sraShowValue}}"
 *       data-sra-args-interval         = "{{sraArgsInterval||sraInterval}}"
 *  &gt;&lt;/sra-analog-gauge&gt;
 * </pre></b>
 * <img src="../widgets/AnalogGauge/Spek/Tachometer/icon.png" />
 * @ngdoc directive
 * @name sra-analog-gauge
 * @param {string} data-sra-args-analog-gauge The name of the gauge that the SIM will use to send the values from. 
 *                 See, <a href="../JavaDoc/com/SIMRacingApps/Gauge.Type.html">Gauges</a>, for avaiLabel values. Defaults to "Generic".
 * @param {milliseconds} data-sra-args-interval The interval that this widget will update from the server. Default is 300.
 * @param {degrees}  data-sra-args-start-angle The starting angle where the first major tick mark is displayed. Defaults to 120.
 * @param {degrees}  data-sra-args-end-angle The ending angle where the last major tick mark is displayed. Defaults to 420.
 * @param {pixels} data-sra-args-ring-size The width of the outer ring. Defaults to 20.
 * @param {pixels} data-sra-args-button-size The width of the middle button. Defaults to 50.
 * @param {pixels} data-sra-args-major-size The length of the major tick mark. Defaults to 30.
 * @param {pixels} data-sra-args-major-buffer This distance from the outer ring where the major tick mark starts. Defaults to 3.
 * @param {pixels} data-sra-args-text-buffer The distance from the outer ring where the major text starts. Defaults to 30.
 * @param {pixels} data-sra-args-major-font-size The size of the major text's font. Defaults to 30.
 * @param {pixels} data-sra-args-minor-size The length of the minor tick mark. Defaults to 15.
 * @param {pixels} data-sra-args-minor-buffer The distance from the outer rung where the minor tick mark starts. Defaults to 7.
 * @param {pixels} data-sra-args-needle-buffer The distance where the end of the needle is from the outer ring. Defaults to 25.
 * @param {double} data-sra-args-round-to The value to round the digital display to before displaying it. Defaults to 1.
 *                 For example: 100 rounds the value 1234 to 1200, .01 rounds the value 1234.5678 to 1234.57.
 * @param {integer} data-sra-args-decimals The number of decimal places to show after the decimal point regardless of rounding. Defaults to 0.
 * @param {string} data-sra-args-label1 The text for the main label. Defaults to blank.
 * @param {pixels} data-sra-args-x-label1 The X coordinate of where to put the main label. Defaults to 240.
 * @param {pixels} data-sra-args-y-label1 The Y coordinate of where to put the main label. Defaults to 150.
 * @param {pixels} data-sra-args-font-size-label1 The font size of the main label. Defaults to 40.
 * @param {string} data-sra-args-anchor-label1 The anchor defines where the X/Y coordinates are in relation to the entire text. Values are "middle", "left", "right". Defaults to "middle".
 * @param {string} data-sra-args-label2 The text for the second label. Defaults to blank.
 * @param {pixels} data-sra-args-x-label2 The X coordinate of where to put the second label. Defaults to 240.
 * @param {pixels} data-sra-args-y-label2 The Y coordinate of where to put the second label. Defaults to 185.
 * @param {pixels} data-sra-args-font-size-label2 The font size of the second label. Defaults to 30.
 * @param {string} data-sra-args-anchor-label2 The anchor defines where the X/Y coordinates are in relation to the entire text. Values are "middle", "left", "right". Defaults to "middle".
 * @param {pixels} data-sra-args-x-value The X coordinate of where to put the digital value. Defaults to 240.
 * @param {pixels} data-sra-args-y-value The Y coordinate of where to put the digital value. Defaults to 330.
 * @param {pixels} data-sra-args-font-size-value The font size of the second label. Defaults to 50.
 * @param {pixels} data-sra-args-anchor-value The anchor defines where the X/Y coordinates are in relation to the entire text. Values are "middle", "left", "right". Defaults to "middle".
 * @param {pixels} data-sra-args-x-value2 The X coordinate of where to put the digital value. Defaults to 240.
 * @param {pixels} data-sra-args-y-value2 The Y coordinate of where to put the digital value. Defaults to 440.
 * @param {pixels} data-sra-args-font-size-value2 The font size of the second label. Defaults to 50.
 * @param {pixels} data-sra-args-anchor-value2 The anchor defines where the X/Y coordinates are in relation to the entire text. Values are "middle", "left", "right". Defaults to "middle".
 * @param {string} data-sra-args-uom The unit of measure to display. Overrides what comes from the SIM. Defaults to blank, let the SIM decide.
 * @param {pixels} data-sra-args-x-uom The X coordinate of where to put the UOM. Defaults to 240.
 * @param {pixels} data-sra-args-y-uom The Y coordinate of where to put the UOM. Defaults to 370.
 * @param {pixels} data-sra-args-font-size-uom The font size of the UOM. Defaults to 30.
 * @param {string} data-sra-args-anchor-uom The anchor defines where the X/Y coordinates are in relation to the entire text. Values are "middle", "left", "right". Defaults to "middle".
 * @param {milliseconds} data-sra-args-flash-rate The rate that the gauge will flash when it reaches the CRITICAL State. Defaults to 300.
 * @param {boolean} data-sra-args-flash-on-critical The condition, true or false, to determine if the gauge should flash. Defaults to true.
 *                  This value can be overridden for all gauges in the URL using "FLASHONCRITICAL=false".
 * @param {boolean} data-sra-args-show-digital-value The condition, true or false, to turn the digital value on and off. The default is true.
 *                  This value can be override for all gauge in the URL using "SHOWDIGITALVALUE=false".
 * @param {boolean} data-sra-args-use-speedometer The condition, true or false, to get the Tachometer to use the speed to determine the states relating to pit road speed.
 *          Defaults to true. If set to false, it uses the RPMs while in 2nd Gear that the SIM returns. 
 *          if your app or widget implements a way for the user to set it (like in the real stock cars), 
 *          then calling "/SIMRacingApps/Data/Car/REFERENCE/setRPMPitRoadSpeed/{RPM}" will set it for that session. 
 *          Otherwise, it will use the default from Car.json or the car specific json files for each SIM where it can be defined by track. 
 *          (NOTE: As of version 1.0, the json files have not been updated and the default is 3950.)
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2017 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/AnalogGauge/AnalogGauge'],
function(SIMRacingApps) {

    var self = {
        name:            "sraAnalogGauge",
        url:             'AnalogGauge',
        template:        'AnalogGauge.html',
        defaultWidth:    480,
        defaultHeight:   480,
        defaultInterval: 300   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$location', '$interval', '$rootScope',
    function(sraDispatcher,   $filter,   $location,   $interval,   $rootScope) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                $scope.startAngle     = 120;
                $scope.endAngle       = 420;
                $scope.ringSize       = 20;
                $scope.buttonSize     = 50;
                $scope.majorSize      = 30;
                $scope.majorBuffer    = 3;
                $scope.majorTextBuffer= 30;
                $scope.majorFontSize  = 30;
                $scope.minorSize      = 15;
                $scope.minorBuffer    = 7;
                $scope.needleBuffer   = 25;
                $scope.roundTo        = 1;
                $scope.decimals       = 0;
                $scope.thousandsSeparator = $filter('number')(1000.1,1).toString().substr(1,1);

                $scope.sraArgsLabel1  = "";
                $scope.xLabel1        = 240;
                $scope.yLabel1        = 150;
                $scope.fontSizeLabel1 = 40;
                $scope.anchorLabel1   = 'middle';

                $scope.sraArgsLabel2  = "";
                $scope.xLabel2        = 240;
                $scope.yLabel2        = 185;
                $scope.fontSizeLabel2 = 30;
                $scope.anchorLabel2   = 'middle';

                $scope.xValue         = 240;
                $scope.yValue         = 330;
                $scope.fontSizeValue  = 50;
                $scope.anchorValue    = 'middle';

                $scope.argsUOM        = "";
                $scope.xUom           = 240;
                $scope.yUom           = 370;
                $scope.fontSizeUom    = 30;
                $scope.anchorUom      = 'middle';

                $scope.xValue2        = 240;
                $scope.yValue2        = 440;
                $scope.fontSizeValue2 = 50;
                $scope.anchorValue2   = 'middle';
                
                $scope.flashRate      = 500;
                $scope.flashOnCritical= true;

                $scope.showValue      = true;
                $scope.useSpeedometer = false;

                $scope.majorMaxText = 3;
                $scope.majorScale  = [
                        { angle: 120, text: '0' },
                        { angle: 150, text: '10' },
                        { angle: 180, text: '20' },
                        { angle: 210, text: '30' },
                        { angle: 240, text: '40' },
                        { angle: 270, text: '50' },
                        { angle: 300, text: '60' },
                        { angle: 330, text: '70' },
                        { angle: 360, text: '80' },
                        { angle: 390, text: '90' },
                        { angle: 420, text: '100' }
                ];
                $scope.minorScale     = [];
                $scope.stateClass     = 'SIMRacingApps-Widget-AnalogGauge-state-NOTAVAILABLE';
                $scope.revLights      = [];
                $scope.revLightBlinkState  = false;
                $scope.revLightAngles = [];
                $scope.revLightClasses= [];
                $scope.needleAngle    = 0;
                $scope.shiftFlashRate = 100;
                $scope.limiterFlashRate = 500;

                $scope.buildScales = function() {
                    var Minimum        = $scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].Minimum[$scope.argsUOM].Value        || 0;
                    var Maximum        = $scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].Maximum[$scope.argsUOM].Value        || 100;
                    var MajorIncrement = $scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].MajorIncrement[$scope.argsUOM].Value || 10;
                    var MinorIncrement = $scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].MinorIncrement[$scope.argsUOM].Value || 10;
                    var range          = ($scope.endAngle - $scope.startAngle);

                    //changed on 7/11/2018 to track the floored min and only create it once
                    if (Minimum !== "" && Maximum !== "" && MajorIncrement !== "") {
                        //console.log($scope.sraAnalogGauge + ': AnalogGauge.buildScales.major('+Minimum+','+Maximum+','+MajorIncrement+')');
                        $scope.majorScale  = [];

                        var angle          = $scope.startAngle;
                        var inc   = range / ((Maximum - Minimum) / MajorIncrement);
                        var minFloored = -1;
                        for (var min = Minimum; MajorIncrement > 0 && min <= Maximum; min += MajorIncrement) {
                            if (minFloored != Math.floor(min)) {
                                minFloored = Math.floor(min);
                                
                                //calculate the angle based on the floored value, else needle will not be accurate.
                                var v = minFloored;
            
                                if (v <= Minimum)
                                    angle = $scope.startAngle;
                                else
                                if (v >= Maximum)
                                    angle = $scope.endAngle;
                                else {
                                    var percentage = (v - Minimum) / (Maximum - Minimum);
                                    angle = $scope.startAngle + (percentage * range);
                                }
                                $scope.majorScale.push({angle: angle, text: minFloored});
                            }
                            //angle += inc;
                        }
                    }

                    if (Minimum !== "" && Maximum !== "" && MinorIncrement !== "") {
                        //console.log($scope.sraAnalogGauge + ': AnalogGauge.buildScales.minor('+Minimum+','+Maximum+','+MinorIncrement+')');
                        $scope.minorScale  = [];

                        //recalculate this, so when the UOM changes, it still the same number of marks between the majors
                        MinorIncrement = 1 / (((Maximum - Minimum) / MinorIncrement) / (Math.floor(Maximum) - Math.floor(Minimum)));
                        var inc   = range / ((Maximum - Minimum) / MinorIncrement);
                        //now only draw between the floors.
                        Minimum = Math.floor(Minimum);
                        Maximum = Math.floor(Maximum);
                        
                        var angle          = $scope.startAngle;
                        for (var min = Minimum; MinorIncrement > 0 && min <= Maximum; min += MinorIncrement) {
                            $scope.minorScale.push(angle);
                            angle += inc;
                        }
                    }
                };

                $scope.moveNeedle = function() {
                    var Minimum        = $scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].Minimum[$scope.argsUOM].Value         || 0;
                    var Maximum        = $scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].Maximum[$scope.argsUOM].Value         || 100;
                    var value          = $scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].ValueCurrent[$scope.argsUOM].Value    || 0;
                    var uom            = $scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].ValueCurrent[$scope.argsUOM].UOMAbbr  || "";

                    if (value !== "" && Minimum !== "" && Maximum !== "") {
                        //console.log($scope.sraAnalogGauge + ': AnalogGauge.buildScales.major('+Minimum+','+Maximum+','+value+' '+uom+')');
                        var range          = ($scope.endAngle - $scope.startAngle);
    
                        var v = value * ($scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].Multiplier.Value || 1.0);
    
                        if (v <= Minimum)
                            $scope.needleAngle = $scope.startAngle;
                        else
                        if (v >= Maximum)
                            $scope.needleAngle = $scope.endAngle;
                        else {
                            var percentage = (v - Minimum) / (Maximum - Minimum);
                            $scope.needleAngle = $scope.startAngle + (percentage * range);
                        }
    
                        $scope.value = $filter('number')(Math.floor((value+($scope.roundTo/2))/$scope.roundTo) * $scope.roundTo,$scope.decimals);
                        $scope.value = $scope.value.toString().replace($scope.thousandsSeparator,'');
                        $scope.uom   = uom.toUpperCase();
                    }
                };

                $scope.updateLabels = function() {
                    $scope.Label1 = $scope.sraArgsLabel1 || $scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].Name.ValueFormatted;
                    $scope.Label2 = $scope.sraArgsLabel2 || $scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].TypeName.ValueFormatted;
                };

                $scope.updateColor = function() {
                    var state = $scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].ValueCurrent[$scope.argsUOM].State || "NOTAVAILABLE";

                    var speedstate = $scope.useSpeedometer ? $scope.data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.State || "NOTAVAILABLE" : "NOTAVAILABLE";
                    
//state = "CRITICAL";
                    //stop the blinking if we are not in the critical state.
                    if (!sraDispatcher.State.isCRITICAL(state) && $scope._blink) {
                        $interval.cancel($scope._blink);
                        $scope._blink = null;
                    }

                    if (sraDispatcher.State.isCRITICAL(state) && $scope.flashOnCritical) {
                        if ($scope._blink == null) {
                            $scope._blink = $interval(function() {
                                if ($scope.stateClass != 'SIMRacingApps-Widget-AnalogGauge-state-CRITICAL') {
                                    $scope.stateClass = 'SIMRacingApps-Widget-AnalogGauge-state-CRITICAL';
                                }
                                else {
                                    $scope.stateClass = 'SIMRacingApps-Widget-AnalogGauge-state-NORMAL';
                                }
                            }, $scope.flashRate);
                        }
                        else {
                            $scope.stateClass  = 'SIMRacingApps-Widget-AnalogGauge-state-'+state;
                        }
                    }
                    else
                    if (  $scope.useSpeedometer
                    && (  sraDispatcher.State.isLIMIT(speedstate)
                       || sraDispatcher.State.isAPPROACHINGLIMIT(speedstate)
                       || sraDispatcher.State.isOVERLIMIT(speedstate)
                       || sraDispatcher.State.isWAYOVERLIMIT(speedstate)
                       )
                    && !(  sraDispatcher.State.isSHIFT(state)
                        || sraDispatcher.State.isSHIFTBLINK(state)
                        || sraDispatcher.State.isCRITICAL(state)
                        )
                    ) {
                        $scope.stateClass  = 'SIMRacingApps-Widget-AnalogGauge-state-'+speedstate;
                    }
                    else
                    if (  $scope.useSpeedometer
                    && (  sraDispatcher.State.isLIMIT(state)
                       || sraDispatcher.State.isAPPROACHINGLIMIT(state)
                       || sraDispatcher.State.isOVERLIMIT(state)
                       || sraDispatcher.State.isWAYOVERLIMIT(state)
                       )
                    ) {
                        $scope.stateClass  = 'SIMRacingApps-Widget-AnalogGauge-state-NORMAL';
                    }
                    else {
                        $scope.stateClass  = 'SIMRacingApps-Widget-AnalogGauge-state-'+state;
                    }
                };

                $scope.updateRevLights = function () {
                    $scope.updateColor();
                    
                    if ($scope.revLights.length > 0) {
                        var state      = $scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].ValueCurrent[$scope.argsUOM].State || "NOTAVAILABLE";
                        var percent    = ($scope.data.Car.REFERENCE.Gauge[$scope.sraAnalogGauge].ValueCurrent[$scope.argsUOM].StatePercent || 0) / 100.0;
                        var pitLimiter = $scope.data.Car.REFERENCE.Messages.Value.indexOf(";PITSPEEDLIMITER;") >= 0;
                        var cutoff;

                        if ($scope._revLightsBlink 
                        && !(sraDispatcher.State.isSHIFTBLINK(state) || sraDispatcher.State.isCRITICAL(state))
                        && !pitLimiter
                        ) {
                            $interval.cancel($scope._revLightsBlink);
                            $scope._revLightsBlink = null;
                        }
                        
                        if ($scope.useSpeedometer 
                        && !sraDispatcher.State.isSHIFTLIGHTS(state)
                        && !sraDispatcher.State.isSHIFT(state)
                        && !sraDispatcher.State.isSHIFTBLINK(state)
                        && !sraDispatcher.State.isCRITICAL(state)
                        ) {
                            state   = $scope.data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.State || "NOTAVAILABLE";
                            percent = ($scope.data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.StatePercent || 0) / 100.0;
                        }
                        
                        for (var revLight=0; revLight < 7; revLight++) {
                            $scope.revLightClasses[revLight] = 'SIMRacingApps-Widget-AnalogGauge-state-OFF';

                            if (pitLimiter) {
                                $scope.revLightClasses[revLight] = 'SIMRacingApps-Widget-AnalogGauge-state-OVERLIMIT';
                            }
                            else
                            if (sraDispatcher.State.isAPPROACHINGLIMIT(state)) {
                                if (percent <= (2/3)) {
                                    cutoff = ((1/8) * (2/3)) * (revLight+1);
                                    if (percent > cutoff) {
                                        $scope.revLightClasses[revLight] = 'SIMRacingApps-Widget-AnalogGauge-state-APPROACHINGLIMIT';
                                    }
                                }
                                else {
                                    cutoff = (2/3) + (((1/7) * (1/3)) * (revLight));
                                    if (percent > cutoff) {
                                        $scope.revLightClasses[revLight] = 'SIMRacingApps-Widget-AnalogGauge-state-LIMIT';
                                    }
                                }
                            }
                            else
                            if (sraDispatcher.State.isLIMIT(state) ) {
                                cutoff = (1/8) * (revLight+1);  //don't turn on the last light. Let it fall to the over limit state
                                if (percent >= cutoff) {
                                    $scope.revLightClasses[revLight] = 'SIMRacingApps-Widget-AnalogGauge-state-OVERLIMIT';
                                }
                            }
                            else
                            if (sraDispatcher.State.isOVERLIMIT(state)) {
                                $scope.revLightClasses[revLight] = 'SIMRacingApps-Widget-AnalogGauge-state-OVERLIMIT';
                            }
                            else
                            if (sraDispatcher.State.isSHIFTLIGHTS(state)) { 
                                if (percent >= (revLight/7)) {
                                    if (revLight >= 0 && revLight <= 2)
                                        $scope.revLightClasses[revLight] = 'SIMRacingApps-Widget-AnalogGauge-ShiftLights-start';
                                    else
                                    if (revLight >= 3 && revLight <= 4)
                                        $scope.revLightClasses[revLight] = 'SIMRacingApps-Widget-AnalogGauge-ShiftLights-middle';
                                    else
                                        $scope.revLightClasses[revLight] = 'SIMRacingApps-Widget-AnalogGauge-ShiftLights-end';
                                }
                            }
                            else
                            if (sraDispatcher.State.isSHIFT(state) 
                            ||  sraDispatcher.State.isSHIFTBLINK(state) 
                            ||  sraDispatcher.State.isCRITICAL(state)
                            ) {
                                $scope.revLightClasses[revLight] = 'SIMRacingApps-Widget-AnalogGauge-ShiftLights-end';
                            }
                        }
                        
                        if (pitLimiter || sraDispatcher.State.isSHIFTBLINK(state) || sraDispatcher.State.isCRITICAL(state)) {
                            if ($scope._revLightsBlink == null) {
                                $scope.revLightBlinkState = false;
                                
                                $scope._revLightsBlink = $interval(function() {
                                    
                                    for (var revLight=0; revLight < 7; revLight++) {
                                        if ($scope.revLightBlinkState) {
                                            $scope.revLightClasses[revLight]  = 'SIMRacingApps-Widget-AnalogGauge-state-OFF';
                                        }
                                        else {
                                            $scope.revLightClasses[revLight] = 'SIMRacingApps-Widget-AnalogGauge-ShiftLights-end';
                                        }
                                    }
                                    $scope.revLightBlinkState = !$scope.revLightBlinkState;
                                    
                                }, pitLimiter ? $scope.limiterFlashRate : $scope.shiftFlashRate);
                            }
                        }

                    }
                };

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope
                $scope.value = 
                $scope[self.name]     = sraDispatcher.getTruthy($scope.sraArgsVALUE            ,$attrs[self.name]             ,$attrs.sraArgsValue, "Generic");
                $scope.startAngle     = sraDispatcher.getTruthy($scope.sraArgsSTARTANGLE       ,$attrs.sraArgsStartAngle      ,$scope.startAngle)      * 1;
                $scope.endAngle       = sraDispatcher.getTruthy($scope.sraArgsENDANGLE         ,$attrs.sraArgsEndAngle        ,$scope.endAngle)        * 1;
                $scope.ringSize       = sraDispatcher.getTruthy($scope.sraArgsRINGSIZE         ,$attrs.sraArgsRingSize        ,$scope.ringSize)        * 1;
                $scope.buttonSize     = sraDispatcher.getTruthy($scope.sraArgsBUTTONSIZE       ,$attrs.sraArgsButtonSize      ,$scope.buttonSize)      * 1;
                $scope.majorSize      = sraDispatcher.getTruthy($scope.sraArgsMAJORSIZE        ,$attrs.sraArgsMajorSize       ,$scope.majorSize)       * 1;
                $scope.majorBuffer    = sraDispatcher.getTruthy($scope.sraArgsMAJORBUFFER      ,$attrs.sraArgsMajorBuffer     ,$scope.majorBuffer)     * 1;
                $scope.majorTextBuffer= sraDispatcher.getTruthy($scope.sraArgsMAJORTEXTBUFFER  ,$attrs.sraArgsMajorTextBuffer ,$scope.majorTextBuffer) * 1;
                $scope.majorFontSize  = sraDispatcher.getTruthy($scope.sraArgsMAJORFONTSIZE    ,$attrs.sraArgsMajorFontSize   ,$scope.majorFontSize)   * 1;
                $scope.minorSize      = sraDispatcher.getTruthy($scope.sraArgsMINORSIZE        ,$attrs.sraArgsMinorSize       ,$scope.minorSize)       * 1;
                $scope.minorBuffer    = sraDispatcher.getTruthy($scope.sraArgsMINORBUFFER      ,$attrs.sraArgsMinorBuffer     ,$scope.minorBuffer)     * 1;
                $scope.needleBuffer   = sraDispatcher.getTruthy($scope.sraArgsNEEDLEBUFFER     ,$attrs.sraArgsNeedleBuffer    ,$scope.needleBuffer)    * 1;
                $scope.roundTo        = sraDispatcher.getTruthy($scope.sraArgsROUNDTO          ,$attrs.sraArgsRoundTo         ,$scope.roundTo)         * 1;
                $scope.decimals       = sraDispatcher.getTruthy($scope.sraArgsDECIMALS         ,$attrs.sraArgsDecimals        ,$scope.decimals)        * 1;

                $scope.sraArgsLabel1  = sraDispatcher.getTruthy($scope.sraArgsLABLE1           ,$attrs.sraArgsLabel1          ,$scope.sraArgsLabel1);
                $scope.xLabel1        = sraDispatcher.getTruthy($scope.sraArgsXLABLE1          ,$attrs.sraArgsXLabel1         ,$scope.xLabel1)         * 1;
                $scope.yLabel1        = sraDispatcher.getTruthy($scope.sraArgsYLABLE1          ,$attrs.sraArgsYLabel1         ,$scope.yLabel1)         * 1;
                $scope.fontSizeLabel1 = sraDispatcher.getTruthy($scope.sraArgsFONTSIZELABLE1   ,$attrs.sraArgsFontSizeLabel1  ,$scope.fontSizeLabel1)  * 1;
                $scope.anchorLabel1   = sraDispatcher.getTruthy($scope.sraArgsANCHORLABLE1     ,$attrs.sraArgsAnchorLabel1    ,$scope.anchorLabel1);

                $scope.sraArgsLabel2  = sraDispatcher.getTruthy($scope.sraArgsLABLE2           ,$attrs.sraArgsLabel2          ,$scope.sraArgsLabel2);
                $scope.xLabel2        = sraDispatcher.getTruthy($scope.sraArgsXLABLE2          ,$attrs.sraArgsXLabel2         ,$scope.xLabel2)         * 1;
                $scope.yLabel2        = sraDispatcher.getTruthy($scope.sraArgsYLABLE2          ,$attrs.sraArgsYLabel2         ,$scope.yLabel2)         * 1;
                $scope.fontSizeLabel2 = sraDispatcher.getTruthy($scope.sraArgsFONTSIZELABLE2   ,$attrs.sraArgsFontSizeLabel2  ,$scope.fontSizeLabel2)  * 1;
                $scope.anchorLabel2   = sraDispatcher.getTruthy($scope.sraArgsANCHORLABLE2     ,$attrs.sraArgsAnchorLabel2    ,$scope.anchorLabel2);

                $scope.xValue         = sraDispatcher.getTruthy($scope.sraArgsXVALUE           ,$attrs.sraArgsXValue          ,$scope.xValue)          * 1;
                $scope.yValue         = sraDispatcher.getTruthy($scope.sraArgsYVALUE           ,$attrs.sraArgsYValue          ,$scope.yValue)          * 1;
                $scope.fontSizeValue  = sraDispatcher.getTruthy($scope.sraArgsFONTSIZEVALUE    ,$attrs.sraArgsFontSizeValue   ,$scope.fontSizeValue)   * 1;
                $scope.anchorValue    = sraDispatcher.getTruthy($scope.sraArgsANCHORVALUE      ,$attrs.sraArgsAnchorValue     ,$scope.anchorValue);

                $scope.xValue2        = sraDispatcher.getTruthy($scope.sraArgsXVALUE2          ,$attrs.sraArgsXValue2         ,$scope.xValue2)         * 1;
                $scope.yValue2        = sraDispatcher.getTruthy($scope.sraArgsYVALUE2          ,$attrs.sraArgsYValue2         ,$scope.yValue2)         * 1;
                $scope.fontSizeValue2 = sraDispatcher.getTruthy($scope.sraArgsFONTSIZEVALUE2   ,$attrs.sraArgsFontSizeValue2  ,$scope.fontSizeValue2)  * 1;
                $scope.anchorValue2   = sraDispatcher.getTruthy($scope.sraArgsANCHORVALUE2     ,$attrs.sraArgsAnchorValue2    ,$scope.anchorValue2);
                
                $scope.argsUOM        = sraDispatcher.getTruthy($scope.sraArgsUOM              ,$attrs.sraArgsUom             ,$scope.argsUOM);
                $scope.xUom           = sraDispatcher.getTruthy($scope.sraArgsXUOM             ,$attrs.sraArgsXUom            ,$scope.xUom)            * 1;
                $scope.yUom           = sraDispatcher.getTruthy($scope.sraArgsYUOM             ,$attrs.sraArgsYUom            ,$scope.yUom)            * 1;
                $scope.fontSizeUom    = sraDispatcher.getTruthy($scope.sraArgsFONTSIZEUOM      ,$attrs.sraArgsFontSizeUom     ,$scope.fontSizeUom)     * 1;
                $scope.anchorUom      = sraDispatcher.getTruthy($scope.sraArgsANCHORUOM        ,$attrs.sraArgsAnchorUom       ,$scope.anchorUom);

                $scope.flashRate      = sraDispatcher.getTruthy($scope.sraArgsFLASHRATE        ,$attrs.sraArgsFlashRate       ,$scope.flashRate)       * 1;
                $scope.flashOnCritical= sraDispatcher.getBoolean($scope.sraArgsFLASHONCRITICAL ,$attrs.sraArgsFlashOnCritical ,$scope.flashOnCritical);

                //these arguments can be overridden from the url
                $scope.showValue      = sraDispatcher.getBoolean($scope.sraArgsSHOWDIGITALVALUE, $attrs.sraArgsShowDigitalValue, $attrs.sraArgsShowValue, $scope.showValue);
                $scope.useSpeedometer = $scope.sraAnalogGauge.toUpperCase() == "TACHOMETER"
                                      ? sraDispatcher.getBoolean($scope.sraArgsTACHUSESPEEDOMETER, $attrs.sraArgsUseSpeedometer, true)
                                      : false;

                while ($scope.endAngle < $scope.startAngle)
                    $scope.endAngle += 360;

                $attrs.sraArgsData =
                              ($attrs.sraArgsData ? $attrs.sraArgsData + ";" : "")
                              + "Car/REFERENCE/Gauge/"+$scope.sraAnalogGauge+"/ValueCurrent/"+$scope.argsUOM
                              + ";Car/REFERENCE/Gauge/"+$scope.sraAnalogGauge+"/Minimum/"+$scope.argsUOM
                              + ";Car/REFERENCE/Gauge/"+$scope.sraAnalogGauge+"/Maximum/"+$scope.argsUOM
                              + ";Car/REFERENCE/Gauge/"+$scope.sraAnalogGauge+"/Multiplier"
                              + ";Car/REFERENCE/Gauge/"+$scope.sraAnalogGauge+"/MajorIncrement/"+$scope.argsUOM
                              + ";Car/REFERENCE/Gauge/"+$scope.sraAnalogGauge+"/MinorIncrement/"+$scope.argsUOM
                              + ";Car/REFERENCE/Gauge/"+$scope.sraAnalogGauge+"/Name"
                              + ";Car/REFERENCE/Gauge/"+$scope.sraAnalogGauge+"/TypeName";
                
                if ($scope.useSpeedometer)
                    $attrs.sraArgsData += ";Car/REFERENCE/Gauge/Speedometer/ValueCurrent";

                $attrs.sraUOM    = $scope.uom;

                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].Minimum['"+$scope.argsUOM+"'].Value",             $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].Minimum['"+$scope.argsUOM+"'].UOM",               $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].Maximum['"+$scope.argsUOM+"'].Value",             $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].Maximum['"+$scope.argsUOM+"'].UOM",               $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].Multiplier.Value",                                $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].MajorIncrement['"+$scope.argsUOM+"'].Value",      $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].MajorIncrement['"+$scope.argsUOM+"'].UOM",        $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].MinorIncrement['"+$scope.argsUOM+"'].Value",      $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].MinorIncrement['"+$scope.argsUOM+"'].UOM",        $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].ValueCurrent['"+$scope.argsUOM+"'].Value",        $scope.moveNeedle);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].ValueCurrent['"+$scope.argsUOM+"'].UOM",          $scope.moveNeedle);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].Name.Value",                                      $scope.updateLabels);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].TypeName.Value",                                  $scope.updateLabels);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].ValueCurrent['"+$scope.argsUOM+"'].State",        $scope.updateColor);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].ValueCurrent['"+$scope.argsUOM+"'].State",        $scope.updateRevLights);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].ValueCurrent['"+$scope.argsUOM+"'].StatePercent", $scope.updateRevLights);

                if ($scope.useSpeedometer) {
                    $scope.$watch("data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.State",                                           $scope.updateColor);
                    $scope.$watch("data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.State",                                           $scope.updateRevLights);
                    $scope.$watch("data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.StatePercent",                                    $scope.updateRevLights);
                }
                
                //if it's the brake pressure gauge, show the bias value if it has one
                if ($scope.sraAnalogGauge.toUpperCase() == "BRAKEPRESSURE") {
                    $attrs.sraArgsData += ";Car/REFERENCE/Gauge/BrakeBiasAdjustment/ValueCurrent";
                    $scope.$watch("data.Car.REFERENCE.Gauge.BrakeBiasAdjustment.ValueCurrent.Value", function(oldValue,newValue) {
                        var bias = $scope.data.Car.REFERENCE.Gauge.BrakeBiasAdjustment.ValueCurrent;
                        if (bias.State == 'NORMAL') {
                            //if just the delta, show only 2 decimals, else none
                            if ((bias.Value > 0 && bias.Value < 10.0) || (bias.Value < 0 && bias.Value > -10.0))
                                $scope.value2 = $filter('sraNumber')(bias.Value,2,false);
                            else
                                $scope.value2 = $filter('sraNumber')(bias.Value,1,false);
                            
                            $scope.uom2   = bias.UOMAbbr;
                        }                        
                        else {
                            $scope.value2 = $scope.uom2 = "";
                        }
//$scope.value2 = -2.25; $scope.uom2 = '%';

                    });
                }
                
                if ($scope.sraAnalogGauge.toUpperCase() == "TACHOMETER"
                ||  $scope.sraAnalogGauge.toUpperCase() == "SPEEDOMETER"
                ) {
                    $attrs.sraArgsData += ";Car/REFERENCE/Messages";
                    $scope.$watch("data.Car.REFERENCE.Messages.Value", $scope.updateRevLights);
                    
                    for (var revLight=0; revLight < 7; revLight++) {
                        $scope.revLights.push(revLight);
                        $scope.revLightClasses.push('SIMRacingApps-Widget-AnalogGauge-state-OFF');
                        $scope.revLightAngles.push((revLight*25)+195);  //make 270 is in the middle
                    }
                }

//for testing anytime the value changes, update the color                
$scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraAnalogGauge+"'].ValueCurrent['"+$scope.argsUOM+"'].Value",        $scope.updateColor);

                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

           /**standard code that should be in every directive **/
                $scope.names        = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

            }
        };
    }]);

    return self;
});
