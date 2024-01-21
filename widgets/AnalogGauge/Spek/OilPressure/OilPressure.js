'use strict';
/**
 * This widget displays the oil pressure.
 * <p>
 * States:
 * <p>
 * <ul>
 *   <li>WARNING - something is wrong with your engine.</li>
 *   <li>CRITICAL - time to pit for repairs.</li>
 * </ul>
 * Example:
 * <p><b>
 * &lt;sra-analog-gauge-spek-oil-pressure data-sra-args-show-digital-value="false"&gt;&lt;/sra-analog-gauge-spek-oil-pressure&gt;
 * </b>
 * <img src="../widgets/AnalogGauge/Spek/OilPressure/icon.png" />
 * @ngdoc directive
 * @name sra-analog-gauge-spek-oil-pressure
 * @param {boolean} data-sra-args-show-digital-value Set to true or false for displaying the digital value. Defaults to true. Can be overridden from the URL with "SHOWDIGITALVALUE=false".
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2024 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','widgets/AnalogGauge/AnalogGauge','css!widgets/AnalogGauge/Spek/OilPressure/OilPressure'],
function(SIMRacingApps,AnalogGauge) {

    var self = {
        name:            "sraAnalogGaugeSpekOilPressure",
        url:             'AnalogGauge/Spek/OilPressure',
        template:        'OilPressure.html',
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

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
