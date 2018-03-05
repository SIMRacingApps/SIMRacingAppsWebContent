'use strict';
/**
 * This widget displays the speed in either MPH or KPH .
 * It also visually display different colors around the pit road speed limit.
 * Yellow as you approach the limit, Green at the limit, Red above the limit.
 * In addition, there is a series of lights that indicate where you are between these states.
 * <p
 * States:
 * <p>
 * <ul>
 * <li>APPROACHINGLIMIT - you are approaching the pit road speed limit</li>
 * <li>LIMIT            - You are near the pit road speed limit</li>
 * <li>OVERLIMIT        - You are over the pit road speed limit</li>
 * <li>WAYOVERLIMIT     - You are way over the pit road speed limit</li>
 * <li>SHIFT            - indicates it is time to shift to the next gear</li>
 * <li>CRITICAL         - indicates it has red-lined</li>
 * </ul>
 * Example:
 * <p><b>
 * &lt;sra-analog-gauge-spek-speedometer data-sra-args-show-digital-value="false"&gt;&lt;/sra-analog-gauge-speedmeter&gt;
 * </b>
 * <img src="../widgets/AnalogGauge/Spek/Speedometer/icon.png" />
 * @ngdoc directive
 * @name sra-analog-gauge-spek-speedometer
 * @param {boolean} data-sra-args-show-digital-value Set to true or false for displaying the digital value. Defaults to true. Can be overridden from the URL with "SHOWDIGITALVALUE=false".
 * @param {double}  data-sra-args-round-to The value to round the digital display to. Defaults to 1. Can be overridden from the URL with "TACHROUNDTO=10".
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 16.
 * @author Jeffrey Gilliam
 * @since 1.6
 * @copyright Copyright (C) 2015 - 2018 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','widgets/AnalogGauge/AnalogGauge','css!widgets/AnalogGauge/Spek/Speedometer/Speedometer'],
function(SIMRacingApps,AnalogGauge) {

    var self = {
        name:            "sraAnalogGaugeSpekSpeedometer",
        url:             'AnalogGauge/Spek/Speedometer',
        template:        'Speedometer.html',
        defaultWidth:    480,
        defaultHeight:   480,
        defaultInterval: 16   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter',
    function(sraDispatcher,   $filter) {
        return {
            restrict:    'EA',
            scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                $scope.sraShowValue = sraDispatcher.getBoolean($scope.sraArgsSHOWDIGITALVALUE, $attrs.sraArgsShowDigitalValue, $attrs.sraArgsShowValue, true);
                $scope.sraRoundTo   = sraDispatcher.getTruthy($scope.sraArgsTACHROUNDTO, $attrs.sraArgsRoundTo, 0);

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
