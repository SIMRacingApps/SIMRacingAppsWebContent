'use strict';
/**
 * This widget is a generic implementation of a Text Gauge. 
 * All of the Text Gauges simply use this widget by passing in the different parameters.
 * It is configured using the available arguments.
 * All sizes are in pixels relative to 320x120. 
 * If a gauge is resized, it will automatically adjust these values.
 * <p>
 * Example of how the Tachometer uses this:
 * <p><b>
 * <pre>
 *  &lt;sra-text-gauge
 *       class                          = "SIMRacingApps-Widget-TextGauge-Tachometer"
 *       data-sra-args-text-gauge       = "Tachometer"
 *       data-sra-args-gauge-value      = "Current"
 *       data-sra-args-round-to         = "10"
 *       data-sra-args-decimals         = "0"
 *       data-sra-args-show-text-label  = "{{sraShowTextLabel}}"
 *       data-sra-args-interval         = "{{sraArgsInterval||sraInterval}}"
 *  &gt;&lt;/sra-text-gauge&gt;
 * </pre></b>
 * <img src="../widgets/TextGauge/Tachometer/icon.png" />
 * @ngdoc directive
 * @name sra-text-gauge
 * @param {string} data-sra-args-text-gauge The name of the gauge that the SIM will use to send the values from. 
 *                 See, <a href="../JavaDoc/com/SIMRacingApps/Gauge.Type.html">Gauges</a>, for avaiLabel values. Defaults to "Generic".
 * @param {string} data-sra-args-gauge-value Either the "Current" or "Next" values. Defaults to "Current".
 * @param {boolean} data-sra-args-use-speedometer The condition, true or false, to get the Tachometer to use the speed to determine the states relating to pit road speed.
 *          Defaults to true. If set to false, it uses the RPMs while in 2nd Gear that the SIM returns. 
 *          if your app or widget implements a way for the user to set it (like in the real stock cars), 
 *          then calling "/SIMRacingApps/Data/Car/REFERENCE/setRPMPitRoadSpeed/{RPM}" will set it for that session. 
 *          Otherwise, it will use the default from Car.json or the car specific json files for each SIM where it can be defined by track. 
 *          (NOTE: As of version 1.0, the json files have not been updated and the default is 3950.)
 * @param {string} data-sra-args-show-text-label The title of the gauge. Defaults to the gauge's label1 and lable2 values.
 * @param {double} data-sra-args-round-to The value to round the digital values to. Defaults to 1.0.
 * @param {integer} data-sra-args-decimals The number of decimals places to show the digital value.
 * @param {string} data-sra-args-uom The unit of measure to show the entire gauge in.
 * @param {milliseconds} data-sra-args-flash-rate The rate to flash when CRITICAL state is reached.
 * @param {boolean} data-sra-args-flash-on-critical Enable or disable the flash on critical. Defaults to true.
 * @author Jeffrey Gilliam
 * @since 1.10
 * @copyright Copyright (C) 2019 - 2019 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/TextGauge/TextGauge'],
function(SIMRacingApps) {

    var self = {
        name:            "sraTextGauge",
        url:             'TextGauge',
        template:        'TextGauge.html',
        defaultWidth:    320,
        defaultHeight:   120,
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

                $scope.sraTextGauge    = "Generic";
                $scope.gaugeValue      = 'Current'; //or Next

                $scope.sraArgsLabel   = "";
                $scope.argsUOM        = "";
                $scope.flashRate      = 300;
                $scope.flashRateLimiter=500;
                $scope.flashOnCritical= true;

                $scope.sraLabel       = "";
                $scope.xLabel         = 1;
                $scope.yLabel         = 25;
                $scope.fontSizeLabel  = 30;
                $scope.anchorLabel    = 'start';
                $scope.showLabel      = true;
                $scope.showLabelUOM   = false;
                
                $scope.sraValue       = "0";
                $scope.uom            = "";
                $scope.fontSizeValue  = 70;
                $scope.xValue         = 1;
                $scope.yValue         = 85;
                $scope.anchorValue    = 'start';
                $scope.showUOM        = true;
                $scope.decimals       = 1;
                $scope.roundTo        = 1;
                
                $scope.updateValue = function() {
                    var v = sraDispatcher.getTruthy($scope.data.Car.REFERENCE.Gauge[$scope.sraTextGauge]['Value'+$scope.gaugeValue][$scope.argsUOM].Value,0);
                    v = $filter('sraRound')(v,$scope.roundTo);
                    v = $filter('sraNumber')(v,$scope.decimals,false/*blankIfZero*/,false/*showPositive*/,false/*showThousandsSeparator*/,false/*showApproximateOnly*/);
                    $scope.sraValue = v;
                    $scope.uom = sraDispatcher.getTruthy($scope.data.Car.REFERENCE.Gauge[$scope.sraTextGauge]['Value'+$scope.gaugeValue][$scope.argsUOM].UOMAbbr,"");
                };
                
                $scope.updateLabels = function() {
                    if ($scope.showLabelUOM) {
                        $scope.uom = sraDispatcher.getTruthy($scope.data.Car.REFERENCE.Gauge[$scope.sraTextGauge]['Value'+$scope.gaugeValue][$scope.argsUOM].UOMAbbr,"");
                        $scope.sraLabel = $scope.sraArgsLabel || $scope.uom.toUpperCase();
                    }
                    else {
                        $scope.Label1 = $scope.data.Car.REFERENCE.Gauge[$scope.sraTextGauge].Name.ValueFormatted;
                        $scope.Label2 = $scope.data.Car.REFERENCE.Gauge[$scope.sraTextGauge].TypeName.ValueFormatted;
                        if ($scope.gaugeValue.toUpperCase() == "NEXT")
                            $scope.Label2 += " PIT";
                        $scope.sraLabel = $scope.sraArgsLabel || ($scope.Label1 + " " + $scope.Label2);
                    }
                };

                $scope.updateColor = function() {
                    var pitLimiter = ($scope.sraTextGauge.toUpperCase() == "TACHOMETER" || $scope.sraTextGauge.toUpperCase() == "SPEEDOMETER") && $scope.data.Car.REFERENCE.Messages.Value.indexOf(";PITSPEEDLIMITER;") >= 0;

                    $scope.state      = $scope.data.Car.REFERENCE.Gauge[$scope.sraTextGauge]['Value'+$scope.gaugeValue][$scope.argsUOM].State        || "NOTAVAILABLE";
//$scope.state = "CRITICAL";
                    $scope.stateClass = 'SIMRacingApps-Widget-TextGauge-state-'+$scope.state;
                    //stop the blinking if we are not in the critical state.
                    if (!(pitLimiter || sraDispatcher.State.isSHIFTBLINK($scope.state) || sraDispatcher.State.isCRITICAL($scope.state)) && $scope._blink) {
                        $interval.cancel($scope._blink);
                        $scope._blink = null;
                    }

                    if ((pitLimiter || sraDispatcher.State.isSHIFTBLINK($scope.state) || sraDispatcher.State.isCRITICAL($scope.state)) && $scope.flashOnCritical) {
                        //TODO: Make it blink between critical and warning, self.blinkRate
                        if ($scope._blink == null) {
                            $scope._blink = $interval(function() {
                                if ($scope.stateClass != 'SIMRacingApps-Widget-TextGauge-state-CRITICAL') {
                                    $scope.stateClass = 'SIMRacingApps-Widget-TextGauge-state-CRITICAL';
                                }
                                else {
                                    $scope.stateClass = 'SIMRacingApps-Widget-TextGauge-state-NORMAL';
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
                        $scope.stateClass  = 'SIMRacingApps-Widget-TextGauge-state-'+$scope.state;
                    }
                };
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope
                $scope.sraTextGauge   = sraDispatcher.getTruthy($scope.sraArgsTextGauge     , $attrs.sraTextGauge           , $attrs.sraArgsValue      , $scope.sraTextGauge);
                $scope.gaugeValue     = sraDispatcher.getTruthy($scope.sraArgsGAUGEVALUE    , $attrs.sraGaugeValue          , $attrs.sraArgsGaugeValue , $scope.gaugeValue);

                $scope.sraArgsLabel   = sraDispatcher.getTruthy($scope.sraArgsLABEL         , $attrs.sraArgsLabel           , $scope.sraArgsLabel);
                $scope.xLabel         = sraDispatcher.getTruthy($scope.sraArgsXLABEL        , $attrs.sraArgsXLabel          , $scope.xLabel)         * 1;
                $scope.yLabel         = sraDispatcher.getTruthy($scope.sraArgsYLABEL        , $attrs.sraArgsYLabel          , $scope.yLabel)         * 1;
                $scope.fontSizeLabel  = sraDispatcher.getTruthy($scope.sraArgsFONTSIZELABEL , $attrs.sraArgsFontSizeLabel   , $scope.fontSizeLabel)  * 1;
                $scope.anchorLabel    = sraDispatcher.getTruthy($scope.sraArgsANCHORLABEL   , $attrs.sraArgsAnchorLabel     , $scope.anchorLabel);

                $scope.xValue         = sraDispatcher.getTruthy($scope.sraArgsXVALUE        , $attrs.sraArgsXValue          , $scope.xValue)         * 1;
                $scope.yValue         = sraDispatcher.getTruthy($scope.sraArgsYVALUE        , $attrs.sraArgsYValue          , $scope.yValue)         * 1;
                $scope.fontSizeValue  = sraDispatcher.getTruthy($scope.sraArgsFONTSIZEVALUE , $attrs.sraArgsFontSizeValue   , $scope.fontSizeValue)  * 1;
                $scope.anchorValue    = sraDispatcher.getTruthy($scope.sraArgsANCHORVALUE   , $attrs.sraArgsAnchorValue     , $scope.anchorValue);
                $scope.roundTo        = sraDispatcher.getTruthy($scope.sraArgsROUNDTO       , $attrs.sraArgsRoundTo         , $scope.roundTo)        * 1;
                $scope.decimals       = sraDispatcher.getTruthy($scope.sraArgsDECIMALS      , $attrs.sraArgsDecimals        , $scope.decimals)       * 1;
                $scope.argsUOM        = sraDispatcher.getTruthy($scope.sraArgsUOM           , $attrs.sraArgsUom             , $scope.argsUOM);
                $scope.showUOM        = sraDispatcher.getBoolean($scope.sraArgsSHOWUOM      , $attrs.sraArgsShowUOM         , $scope.sraArgsShowUOM, $scope.showUOM);
                $scope.showLabelUOM   = sraDispatcher.getBoolean($scope.sraArgsLABELUOM     , $attrs.sraArgsLabelUOM        , $scope.sraArgsLabelUOM, $scope.showLabelUOM);

                $scope.flashRate      = sraDispatcher.getTruthy($scope.sraArgsFLASHRATE     , $attrs.sraArgsFlashRate       , $scope.flashRate)      * 1;
                $scope.flashOnCritical= sraDispatcher.getBoolean($scope.sraArgsFLASHONCRITICAL,$attrs.sraArgsFlashOnCritical ,$scope.flashOnCritical);

                //these arguments can be overridden from the url
                $scope.showLabel      = sraDispatcher.getBoolean($scope.sraArgsSHOWLABEL    , $attrs.sraArgsShowLabel       , $scope.sraArgsShowLabel, $scope.showLabel);
                $scope.useSpeedometer = $scope.sraTextGauge.toUpperCase() == "TACHOMETER"
                                     ? sraDispatcher.getBoolean($scope.sraArgsTACHUSESPEEDOMETER, $attrs.sraArgsUseSpeedometer, $scope.useSpeedometer)
                                     : false;
                                     
                $attrs.sraArgsData =
                                ";Car/REFERENCE/Gauge/"+$scope.sraTextGauge+"/Value"+$scope.gaugeValue+"/"+$scope.argsUOM
                              + ";Car/REFERENCE/Gauge/"+$scope.sraTextGauge+"/Multiplier"
                              + ";Car/REFERENCE/Gauge/"+$scope.sraTextGauge+"/Name"
                              + ";Car/REFERENCE/Gauge/"+$scope.sraTextGauge+"/TypeName"
                ;

                $attrs.sraUOM    = $scope.uom;

                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraTextGauge+"'].Multiplier.Value",                                            $scope.updateValue);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraTextGauge+"']['Value"+$scope.gaugeValue+"']['"+$scope.argsUOM+"'].Value",   $scope.updateValue);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraTextGauge+"']['Value"+$scope.gaugeValue+"']['"+$scope.argsUOM+"'].UOM",     $scope.updateValue);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraTextGauge+"'].Name.Value",                                                  $scope.updateLabels);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraTextGauge+"'].TypeName.Value",                                              $scope.updateLabels);
                $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraTextGauge+"']['Value"+$scope.gaugeValue+"']['"+$scope.argsUOM+"'].State",   $scope.updateColor);

                //if it's the brake pressure gauge, show the bias value if it has one
                if ($scope.sraTextGauge.toUpperCase() == "BRAKEPRESSURE") {
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
                
                if ($scope.sraTextGauge.toUpperCase() == "TACHOMETER" || $scope.sraTextGauge.toUpperCase() == "SPEEDOMETER") {

                    $attrs.sraArgsData += ";Car/REFERENCE/Messages";
                    $scope.$watch("data.Car.REFERENCE.Messages.Value",$scope.updateColor);
                    
                    if ($scope.useSpeedometer) {
                        $attrs.sraArgsData += ";Car/REFERENCE/Gauge/Speedometer/ValueCurrent";
                        $scope.$watch("data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.State",        $scope.updateColor);
                        $scope.$watch("data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.StatePercent", $scope.updateRevLights);
                    }
                    else {
                        $scope.$watch("data.Car.REFERENCE.Gauge['"+$scope.sraTextGauge+"']['Value"+$scope.gaugeValue+"']['"+$scope.argsUOM+"'].StatePercent", $scope.updateRevLights);
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
