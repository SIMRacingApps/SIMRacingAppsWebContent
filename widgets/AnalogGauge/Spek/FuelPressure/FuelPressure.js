'use strict';
/**
 * This widget displays the fuel pressure.
 * <p>
 * States:
 * <p>
 * <ul>
 *   <li>WARNING - time to start looking for pit road.</li>
 *   <li>CRITICAL - time to pit.</li>
 * </ul>
 * Example:
 * <p><b>
 * &lt;sra-analog-gauge-spek-fuel-pressure data-sra-args-show-digital-value="false"&gt;&lt;/sra-analog-gauge-spek-fuel-pressure&gt;
 * </b>
 * <img src="../widgets/AnalogGauge/Spek/FuelPressure/icon.png" />
 * @ngdoc directive
 * @name sra-analog-gauge-spek-fuel-pressure
 * @param {boolean} data-sra-args-show-digital-value Set to true or false for displaying the digital value. Defaults to true. Can be overridden from the URL with "SHOWDIGITALVALUE=false".
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2022 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','widgets/AnalogGauge/AnalogGauge','css!widgets/AnalogGauge/Spek/FuelPressure/FuelPressure'],
function(SIMRacingApps,AnalogGauge) {

    var self = {
        name:            "sraAnalogGaugeSpekFuelPressure",
        url:             'AnalogGauge/Spek/FuelPressure',
        template:        'FuelPressure.html',
        defaultWidth:    480,
        defaultHeight:   480,
        defaultInterval: 500   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter',
    function(sraDispatcher,   $filter) {
        return {
            restrict:    'EA',
            $scope:       true,
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

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
