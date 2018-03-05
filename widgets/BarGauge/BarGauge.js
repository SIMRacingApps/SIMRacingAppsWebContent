'use strict';
/**
 * This widget is a generic implementation of an Bar Gauge. 
 * All of the Bar Gauges simply use this widget by passing in the different parameters.
 * It is configured using the available arguments.
 * All arguments that take degrees, considers zero degrees at 3 o'clock.
 * All sizes are in pixels relative to 800x320. 
 * If a gauge is resized, it will automatically adjust these values.
 * <p>
 * Other values, the gauge needs, are sent by the SIM to control, minimum, maximum, states, and intervals for the major,minor.
 * <p>
 * Example of how the Tachometer uses this:
 * <p><b>
 * <pre>
 *  &lt;sra-bar-gauge
 *       class                          = "SIMRacingApps-Widget-BarGauge-Tachometer"
 *       data-sra-args-bar-gauge        = "Tachometer"
 *       data-sra-args-round-to         = "{{sraRoundTo}}"
 *       data-sra-args-show-value       = "{{sraShowValue}}"
 *       data-sra-args-interval         = "{{sraArgsInterval||sraInterval}}"
 *  &gt;&lt;/sra-bar-gauge&gt;
 * </pre></b>
 * <img src="../widgets/BarGauge/Tachometer/icon.png" />
 * @ngdoc directive
 * @name sra-bar-gauge
 * @param {string} data-sra-args-bar-gauge The name of the gauge that the SIM will use to send the values from. 
 *                 See, <a href="../JavaDoc/com/SIMRacingApps/Gauge.Type.html">Gauges</a>, for avaiLabel values. Defaults to "Generic".
 * @param {string} data-sra-args-gauge-value Either the "Current" or "Next" values. Defaults to "Current".
 * @param {boolean} data-sra-args-show-digital-value The condition, true or false, to turn the digital value on and off. The default is true.
 *                  This value can be override for all gauge in the URL using "SHOWDIGITALVALUE=false".
 * @param {boolean} data-sra-args-use-speedometer The condition, true or false, to get the Tachometer to use the speed to determine the states relating to pit road speed.
 *          Defaults to true. If set to false, it uses the RPMs while in 2nd Gear that the SIM returns. 
 *          if your app or widget implements a way for the user to set it (like in the real stock cars), 
 *          then calling "/SIMRacingApps/Data/Car/REFERENCE/setRPMPitRoadSpeed/{RPM}" will set it for that session. 
 *          Otherwise, it will use the default from Car.json or the car specific json files for each SIM where it can be defined by track. 
 *          (NOTE: As of version 1.0, the json files have not been updated and the default is 3950.)
 * @param {string} data-sra-args-label The title of the bar. Defaults to the gauge's label1 and lable2 values.
 * @param {pixels} data-sra-args-x-label The X position of the label.
 * @param {pixels} data-sra-args-y-label The Y position of the label.
 * @param {pixels} data-sra-args-font-size-label The font size of the label.
 * @param {string} data-sra-args-anchor-label The anchor of the label (start,middle,end). Defaults to middle.
 * @param {pixels} data-sra-args-start-bar The X position of where the bar will start.
 * @param {pixels} data-sra-args-end-bar The X position of where the bar will end.
 * @param {pixels} data-sra-args-major-top The Y position of the top of the major bars.
 * @param {pixels} data-sra-args-major-bottom The Y position of the bottom of the major bars.
 * @param {pixels} data-sra-args-minor-top The Y position of the top of the minor bars.
 * @param {pixels} data-sra-args-minor-bottom The Y position of the bottom of the minor bars.
 * @param {pixels} data-sra-args-border-size The size of the border width.
 * @param {pixels} data-sra-args-border-x The X position of the border.
 * @param {pixels} data-sra-args-border-y The Y position of the border.
 * @param {pixels} data-sra-args-border-width The width of the border.
 * @param {pixels} data-sra-args-border-height The height of the border.
 * @param {pixels} data-sra-args-major-text-y The Y position of the bottom of the major scale text font.
 * @param {pixels} data-sra-args-major-font-size The size of the major text font.
 * @param {pixels} data-sra-args-x-value The X position of where to put the digital value.
 * @param {pixels} data-sra-args-y-value The Y position of the bottom of the digital value's text.
 * @param {pixels} data-sra-args-font-size-value The font size of the digital value.
 * @param {string} data-sra-args-anchor-value The anchor of the digital value's text (left,right,middle). Defaults to middle.
 * @param {pixels} data-sra-args-x-value2 The X position of where to put the digital value.
 * @param {pixels} data-sra-args-y-value2 The Y position of the bottom of the digital value's text.
 * @param {pixels} data-sra-args-font-size-value2 The font size of the digital value.
 * @param {string} data-sra-args-anchor-value2 The anchor of the digital value's text (left,right,middle). Defaults to middle.
 * @param {double} data-sra-args-round-to The value to round the digital values to. Defaults to 1.0.
 * @param {integer} data-sra-args-decimals The number of decimals places to show the digital value.
 * @param {string} data-sra-args-uom The unit of measure to show the entire gauge in.
 * @param {milliseconds} data-sra-args-flash-rate The rate to flash when CRITICAL state is reached.
 * @param {boolean} data-sra-args-flash-on-critical Enable or disable the flash on critical. Defaults to true.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2017 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/BarGauge/BarGauge'],
function(SIMRacingApps) {

    var self = {
        name:            "sraBarGauge",
        url:             'BarGauge',
        template:        'BarGauge.html',
        defaultWidth:    800,
        defaultHeight:   280,
        defaultInterval: 300   //initialize with the default interval
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

                $scope.thousandsSeparator = $filter('number')(1000.1,1).toString().substr(1,1);

                $scope.gaugeValue      = 'Current'; //or Next
                
                $scope.majorScale  = [
                        { x: 20,  text: '0' },
                        { x: 95,  text: '10' },
                        { x: 170, text: '20' },
                        { x: 245, text: '30' },
                        { x: 320, text: '40' },
                        { x: 395, text: '50' },
                        { x: 470, text: '60' },
                        { x: 545, text: '70' },
                        { x: 620, text: '80' },
                        { x: 695, text: '90' },
                        { x: 770, text: '100' }
                ];
                $scope.minorScale     = [];
                $scope.barPercent     = 0;
                $scope.stateClass     = 'SIMRacingApps-Widget-BarGauge-state-NOTAVAILABLE';

                $scope.sraBarGauge    = "Generic";
                $scope.gaugeValue     = "Current";

                $scope.sraArgsLabel   = "";
                $scope.xLabel         = 400;
                $scope.yLabel         = 55;
                $scope.fontSizeLabel  = 60;
                $scope.anchorLabel    = 'middle';

                $scope.startBar       = 20;
                $scope.endBar         = 780;
                $scope.majorTop       = 70;
                $scope.majorBottom    = 220;
                $scope.minorTop       = 80;
                $scope.minorBottom    = 210;
                
                $scope.majorFontSize  = 30;
                $scope.majorTextY     = 250;
                $scope.roundTo        = 1;
                $scope.decimals       = 0;

                $scope.borderSize     = 15;
                $scope.borderX        = 0;
                $scope.borderY        = 0;
                $scope.borderWidth    = 800;
                $scope.borderHeight   = self.defaultHeight;
                
                $scope.fontSizeValue  = 80;
                $scope.xValue         = 400;
                $scope.yValue         = $scope.majorTop + $scope.fontSizeValue;
                $scope.anchorValue    = 'middle';

                $scope.fontSizeValue2 = 80;
                $scope.xValue2        = 400;
                $scope.yValue2        = $scope.majorTop + ($scope.fontSizeValue * .9) + $scope.fontSizeValue2 ;
                $scope.anchorValue2   = 'middle';
                
                $scope.argsUOM        = "";
                $scope.flashRate      = 300;
                $scope.flashRateLimiter=500;
                $scope.flashOnCritical= true;
                $scope.showValue      = true;
                
                $scope.buildScales = function() {
                    var Minimum        = $scope.data.Car.REFERENCE.Gauge[$scope.sraBarGauge].Minimum[$scope.argsUOM].Value        || 0;
                    var Maximum        = $scope.data.Car.REFERENCE.Gauge[$scope.sraBarGauge].Maximum[$scope.argsUOM].Value        || 100;
                    var MajorIncrement = $scope.data.Car.REFERENCE.Gauge[$scope.sraBarGauge].MajorIncrement[$scope.argsUOM].Value || 10;
                    var MinorIncrement = $scope.data.Car.REFERENCE.Gauge[$scope.sraBarGauge].MinorIncrement[$scope.argsUOM].Value || 10;

                    if (Minimum !== "" && Maximum !== "" && MajorIncrement !== "") {
                        //console.log('BarGauge.buildScales.major('+Minimum+','+Maximum+','+MajorIncrement+')');
                        $scope.majorScale  = [];

                        var x     = $scope.startBar;
                        var inc   = ($scope.endBar - $scope.startBar) / ((Maximum - Minimum) / MajorIncrement);
                        for (var min = Minimum; min <= Maximum; min += MajorIncrement) {
                            $scope.majorScale.push({x: x, text: Math.floor(min)});
                            x += inc;
                        }
                    }

                    if (Minimum !== "" && Maximum !== "" && MinorIncrement !== "") {
                        //console.log('BarGauge.buildScales.minor('+Minimum+','+Maximum+','+MinorIncrement+')');
                        $scope.minorScale  = [];

                        var x = $scope.startBar;
                        var inc   = ($scope.endBar - $scope.startBar) / ((Maximum - Minimum) / MinorIncrement);
                        for (var min = Minimum; min <= Maximum; min += MinorIncrement) {
                            $scope.minorScale.push(x);
                            x += inc;
                        }
                    }
                };

                $scope.moveBar = function() {
                    var Minimum        = $scope.data.Car.REFERENCE.Gauge[$scope.sraBarGauge].Minimum[$scope.argsUOM].Value         || 0;
                    var Maximum        = $scope.data.Car.REFERENCE.Gauge[$scope.sraBarGauge].Maximum[$scope.argsUOM].Value         || 100;
                    var value          = $scope.data.Car.REFERENCE.Gauge[$scope.sraBarGauge]['Value'+$scope.gaugeValue][$scope.argsUOM].Value    || 0;
                    var uom            = $scope.data.Car.REFERENCE.Gauge[$scope.sraBarGauge]['Value'+$scope.gaugeValue][$scope.argsUOM].UOMAbbr  || "";

                    var range          = ($scope.endBar - $scope.startBar);

                    var v = value * ($scope.data.Car.REFERENCE.Gauge[$scope.sraBarGauge].Multiplier.Value || 1.0);

                    if (v <= Minimum)
                        $scope.barPercent = 0;
                    else
                    if (v >= Maximum)
                        $scope.barPercent = 1;
                    else {
                        $scope.barPercent = (v - Minimum) / (Maximum - Minimum);
                    }

                    $scope.value = $filter('number')(Math.floor((value+($scope.roundTo/2))/$scope.roundTo) * $scope.roundTo,$scope.decimals);
                    $scope.value = $scope.value.toString().replace($scope.thousandsSeparator,'');
                    $scope.uom   = uom.toUpperCase();
                };

                $scope.updateLabels = function() {
                    $scope.Label1 = $scope.sraArgsLabel1 || $scope.data.Car.REFERENCE.Gauge[$scope.sraBarGauge].Name.ValueFormatted;
                    $scope.Label2 = $scope.sraArgsLabel2 || $scope.data.Car.REFERENCE.Gauge[$scope.sraBarGauge].TypeName.ValueFormatted;
                    if ($scope.gaugeValue.toUpperCase() == "NEXT")
                        $scope.Label2 += " PIT";
                };

                $scope.updateColor = function() {
                    var pitLimiter = ($scope.sraBarGauge.toUpperCase() == "TACHOMETER" || $scope.sraBarGauge.toUpperCase() == "SPEEDOMETER") && $scope.data.Car.REFERENCE.Messages.Value.indexOf(";PITSPEEDLIMITER;") >= 0;

                    $scope.state      = $scope.data.Car.REFERENCE.Gauge[$scope.sraBarGauge]['Value'+$scope.gaugeValue][$scope.argsUOM].State        || "NOTAVAILABLE";
//$scope.state = "CRITICAL";
                    $scope.stateClass = 'SIMRacingApps-Widget-BarGauge-state-'+$scope.state;
                    //stop the blinking if we are not in the critical state.
                    if (!(pitLimiter || sraDispatcher.State.isSHIFTBLINK($scope.state) || sraDispatcher.State.isCRITICAL($scope.state)) && $scope._blink) {
                        $interval.cancel($scope._blink);
                        $scope._blink = null;
                    }

                    if ((pitLimiter || sraDispatcher.State.isSHIFTBLINK($scope.state) || sraDispatcher.State.isCRITICAL($scope.state)) && $scope.flashOnCritical) {
                        //TODO: Make it blink between critical and warning, self.blinkRate
                        if ($scope._blink == null) {
                            $scope._blink = $interval(function() {
                                if ($scope.stateClass != 'SIMRacingApps-Widget-BarGauge-state-CRITICAL') {
                                    $scope.stateClass = 'SIMRacingApps-Widget-BarGauge-state-CRITICAL';
                                }
                                else {
                                    $scope.stateClass = 'SIMRacingApps-Widget-BarGauge-state-NORMAL';
                                }
                            }, pitLimiter ? $scope.flashRateLimiter : $scope.flashRate);
                        }
                    }
                    else
                    if ($scope.useSpeedometer
                    && (  sraDispatcher.State.isNORMAL($scope.state)
                       || sraDispatcher.State.isLIMIT($scope.state)
                       || sraDispatcher.State.isAPPROACHINGLIMIT($scope.state)
                       || sraDispatcher.State.isOVERLIMIT($scope.state)
                       || sraDispatcher.State.isWAYOVERLIMIT($scope.state)
                       )
                    ) {
                        $scope.state       = $scope.data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.State  || "NORMAL";
                        $scope.stateClass  = 'SIMRacingApps-Widget-BarGauge-state-'+$scope.state;
                    }
                };
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope
                $scope.sraBarGauge    = sraDispatcher.getTruthy($scope.sraArgsBARGAUGE      , $attrs.sraBarGauge            , $attrs.sraArgsValue      , $scope.sraBarGauge);
                $scope.gaugeValue     = sraDispatcher.getTruthy($scope.sraArgsGAUGEVALUE    , $attrs.sraGaugeValue          , $attrs.sraArgsGaugeValue , $scope.gaugeValue);

                $scope.sraArgsLabel   = sraDispatcher.getTruthy($scope.sraArgsLABEL         , $attrs.sraArgsLabel           , $scope.sraArgsLabel);
                $scope.xLabel         = sraDispatcher.getTruthy($scope.sraArgsXLABEL        , $attrs.sraArgsXLabel          , $scope.xLabel)         * 1;
                $scope.yLabel         = sraDispatcher.getTruthy($scope.sraArgsYLABEL        , $attrs.sraArgsYLabel          , $scope.yLabel)         * 1;
                $scope.fontSizeLabel  = sraDispatcher.getTruthy($scope.sraArgsFONTSIZELABEL , $attrs.sraArgsFontSizeLabel   , $scope.fontSizeLabel)  * 1;
                $scope.anchorLabel    = sraDispatcher.getTruthy($scope.sraArgsANCHORLABEL   , $attrs.sraArgsAnchorLabel     , $scope.anchorLabel);

                $scope.startBar       = sraDispatcher.getTruthy($scope.sraArgsSTARTBAR      , $attrs.sraArgsStartBar        , $scope.startBar)       * 1;
                $scope.endBar         = sraDispatcher.getTruthy($scope.sraArgsENDBAR        , $attrs.sraArgsEndBar          , $scope.endBar)         * 1;
                $scope.majorTop       = sraDispatcher.getTruthy($scope.sraArgsMAJORTOP      , $attrs.sraArgsMajorTop        , $scope.majorTop)       * 1;
                $scope.majorBottom    = sraDispatcher.getTruthy($scope.sraArgsMAJORBOTTOM   , $attrs.sraArgsMajorBottom     , $scope.majorBottom)    * 1;
                $scope.minorTop       = sraDispatcher.getTruthy($scope.sraArgsMINORTOP      , $attrs.sraArgsMinorTop        , $scope.minorTop)       * 1;
                $scope.minorBottom    = sraDispatcher.getTruthy($scope.sraArgsMINORBOTTOM   , $attrs.sraArgsMinorBottom     , $scope.minorBottom)    * 1;

                $scope.borderSize     = sraDispatcher.getTruthy($scope.sraArgsBORDERSIZE    , $attrs.sraArgsBorderSize      , $scope.borderSize)     * 1;
                $scope.borderX        = sraDispatcher.getTruthy($scope.sraArgsBORDERX       , $attrs.sraArgsBorderX         , $scope.borderX)        * 1;
                $scope.borderY        = sraDispatcher.getTruthy($scope.sraArgsBORDERY       , $attrs.sraArgsBorderY         , $scope.borderY)        * 1;
                $scope.borderWidth    = sraDispatcher.getTruthy($scope.sraArgsBORDERWIDTH   , $attrs.sraArgsBorderWidth     , $scope.borderWidth)    * 1;
                $scope.borderHeight   = sraDispatcher.getTruthy($scope.sraArgsBORDERHEIGHT  , $attrs.sraArgsBorderHeight    , $scope.borderHeight)   * 1;
                
                $scope.majorTextY     = sraDispatcher.getTruthy($scope.sraArgsMAJORTEXTY    , $attrs.sraArgsMajorTextY      , $scope.majorTextY)     * 1;
                $scope.majorFontSize  = sraDispatcher.getTruthy($scope.sraArgsMAJORFONTSIZE , $attrs.sraArgsMajorFontSize   , $scope.majorFontSize)  * 1;
                $scope.roundTo        = sraDispatcher.getTruthy($scope.sraArgsROUNDTO       , $attrs.sraArgsRoundTo         , $scope.roundTo)        * 1;
                $scope.decimals       = sraDispatcher.getTruthy($scope.sraArgsDECIMALS      , $attrs.sraArgsDecimals        , $scope.decimals)       * 1;

                $scope.xValue         = sraDispatcher.getTruthy($scope.sraArgsXVALUE        , $attrs.sraArgsXValue          , $scope.xValue)         * 1;
                $scope.yValue         = sraDispatcher.getTruthy($scope.sraArgsYVALUE        , $attrs.sraArgsYValue          , $scope.yValue)         * 1;
                $scope.fontSizeValue  = sraDispatcher.getTruthy($scope.sraArgsFONTSIZEVALUE , $attrs.sraArgsFontSizeValue   , $scope.fontSizeValue)  * 1;
                $scope.anchorValue    = sraDispatcher.getTruthy($scope.sraArgsANCHORVALUE   , $attrs.sraArgsAnchorValue     , $scope.anchorValue);

                $scope.xValue2        = sraDispatcher.getTruthy($scope.sraArgsXVALUE2       , $attrs.sraArgsXValue2         , $scope.xValue2)        * 1;
                $scope.yValue2        = sraDispatcher.getTruthy($scope.sraArgsYVALUE2       , $attrs.sraArgsYValue2         , $scope.yValue2)        * 1;
                $scope.fontSizeValue2 = sraDispatcher.getTruthy($scope.sraArgsFONTSIZEVALUE2, $attrs.sraArgsFontSizeValue2  , $scope.fontSizeValue2) * 1;
                $scope.anchorValue2   = sraDispatcher.getTruthy($scope.sraArgsANCHORVALUE2  , $attrs.sraArgsAnchorValue2    , $scope.anchorValue2);
                
                $scope.argsUOM        = sraDispatcher.getTruthy($scope.sraArgsUOM           , $attrs.sraArgsUom             , $scope.argsUOM);
  
                $scope.flashRate      = sraDispatcher.getTruthy($scope.sraArgsFLASHRATE     , $attrs.sraArgsFlashRate       , $scope.flashRate)      * 1;
                $scope.flashOnCritical= sraDispatcher.getBoolean($scope.sraArgsFLASHONCRITICAL,$attrs.sraArgsFlashOnCritical ,$scope.flashOnCritical);

                //these arguments can be overridden from the url
                $scope.showValue      = sraDispatcher.getBoolean($scope.sraArgsSHOWDIGITALVALUE, $attrs.sraArgsShowDigitalValue, $attrs.sraArgsShowValue, $scope.showValue);
                $scope.useSpeedometer = $scope.sraBarGauge.toUpperCase() == "TACHOMETER"
                                     ? sraDispatcher.getBoolean($scope.sraArgsTACHUSESPEEDOMETER, $attrs.sraArgsUseSpeedometer, $scope.useSpeedometer)
                                     : false;
                                     
                $attrs.sraArgsData =
                                ";Car/REFERENCE/Gauge/"+$scope.sraBarGauge+"/Value"+$scope.gaugeValue+"/"+$scope.argsUOM
                              + ";Car/REFERENCE/Gauge/"+$scope.sraBarGauge+"/Minimum/"+$scope.argsUOM
                              + ";Car/REFERENCE/Gauge/"+$scope.sraBarGauge+"/Maximum/"+$scope.argsUOM
                              + ";Car/REFERENCE/Gauge/"+$scope.sraBarGauge+"/Multiplier"
                              + ";Car/REFERENCE/Gauge/"+$scope.sraBarGauge+"/MajorIncrement/"+$scope.argsUOM
                              + ";Car/REFERENCE/Gauge/"+$scope.sraBarGauge+"/MinorIncrement/"+$scope.argsUOM
                              + ";Car/REFERENCE/Gauge/"+$scope.sraBarGauge+"/Name"
                              + ";Car/REFERENCE/Gauge/"+$scope.sraBarGauge+"/TypeName"
                ;

                $attrs.sraUOM    = $scope.uom;

                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"'].Minimum['"+$scope.argsUOM+"'].Value",                         $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"'].Minimum['"+$scope.argsUOM+"'].UOM",                           $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"'].Maximum['"+$scope.argsUOM+"'].Value",                         $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"'].Maximum['"+$scope.argsUOM+"'].UOM",                           $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"'].Multiplier.Value",                                            $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"'].MajorIncrement['"+$scope.argsUOM+"'].Value",                  $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"'].MajorIncrement['"+$scope.argsUOM+"'].UOM",                    $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"'].MinorIncrement['"+$scope.argsUOM+"'].Value",                  $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"'].MinorIncrement['"+$scope.argsUOM+"'].UOM",                    $scope.buildScales);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"']['Value"+$scope.gaugeValue+"']['"+$scope.argsUOM+"'].Value",   $scope.moveBar);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"']['Value"+$scope.gaugeValue+"']['"+$scope.argsUOM+"'].UOM",     $scope.moveBar);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"'].Name.Value",                                                  $scope.updateLabels);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"'].TypeName.Value",                                              $scope.updateLabels);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"']['Value"+$scope.gaugeValue+"']['"+$scope.argsUOM+"'].State",   $scope.updateColor);

                //if it's the brake pressure gauge, show the bias value if it has one
                if ($scope.sraBarGauge.toUpperCase() == "BRAKEPRESSURE") {
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
                
                if ($scope.sraBarGauge.toUpperCase() == "TACHOMETER" || $scope.sraBarGauge.toUpperCase() == "SPEEDOMETER") {

                    $attrs.sraArgsData += ";Car/REFERENCE/Messages";
                    $scope.$watch("data.Car.REFERENCE.Messages.Value",$scope.updateColor);
                    
                    if ($scope.useSpeedometer) {
                        $attrs.sraArgsData += ";Car/REFERENCE/Gauge/Speedometer/ValueCurrent";
                        $scope.$watch("data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.State",        $scope.updateColor);
                        $scope.$watch("data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.StatePercent", $scope.updateRevLights);
                    }
                    else {
                        $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraBarGauge+"']['Value"+$scope.gaugeValue+"']['"+$scope.argsUOM+"'].StatePercent", $scope.updateRevLights);
                    }
                }

                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

           /**standard code that should be in every directive **/
                $scope.names        = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

            }
        };
    }]);

    return self;
});
