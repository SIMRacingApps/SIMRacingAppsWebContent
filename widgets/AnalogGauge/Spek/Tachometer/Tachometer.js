'use strict';
/**
 * This widget displays the revolutions per minute(RPM) of the engine.
 * It also visually display different colors around the pit road speed limit.
 * Yellow as you approach the limit, Green at the limit, Red above the limit.
 * In addition, there is a series of lights that indicate where you are between these states.
 * <p
 * By default, the Tachometer uses your actual speed limit to display these colors.
 * But it can be changed to use the RPM in 2nd Gear that is pit road speed limit for that car at that track.
 * But, as of 1.0, this RPM is not sent to us by the SIM and I have not determined them on my own.
 * A future enhancement, will be the ability to set the RPM by clicking a button while you are on track at pit road speed, (like the pros do it). 
 * <p>
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
 * &lt;sra-analog-gauge-spek-tachometer data-sra-args-show-digital-value="false"&gt;&lt;/sra-analog-gauge-tachometer&gt;
 * </b>
 * <img src="../widgets/AnalogGauge/Spek/Tachometer/icon.png" />
 * @ngdoc directive
 * @name sra-analog-gauge-spek-tachometer
 * @param {boolean} data-sra-args-show-digital-value Set to true or false for displaying the digital value. Defaults to true. Can be overridden from the URL with "SHOWDIGITALVALUE=false".
 * @param {double}  data-sra-args-tach-round-to The value to round the digital display to. Defaults to 1. Can be overridden from the URL with "TACHROUNDTO=10".
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 16.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2017 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','widgets/AnalogGauge/AnalogGauge','css!widgets/AnalogGauge/Spek/Tachometer/Tachometer'],
function(SIMRacingApps,AnalogGauge) {

    var self = {
        name:            "sraAnalogGaugeSpekTachometer",
        url:             'AnalogGauge/Spek/Tachometer',
        template:        'Tachometer.html',
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
