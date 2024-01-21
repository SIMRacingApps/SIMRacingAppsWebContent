'use strict';
/**
 * This widget displays the fuel level.
 * <p>
 * States:
 * <p>
 * <ul>
 *   <li>WARNING - time to start looking for pit road.</li>
 *   <li>CRITICAL - time to pit.</li>
 * </ul>
 * Example:
 * <p><b>
 * &lt;sra-text-gauge-fuel-level&gt;&lt;/sra-text-gauge-fuel-level&gt;
 * </b>
 * <img src="../widgets/TextGauge/FuelLevel/icon.png" />
 * @ngdoc directive
 * @name sra-text-gauge-fuel-level
 * @param {boolean} data-sra-args-show-label Set to true or false for displaying the label. Defaults to true. Can be overridden from the URL with "SHOWLABEL=false".
 * @param {double}  data-sra-args-round-to The value to round the digital display to. Defaults to 1. Can be overridden from the URL with "ROUNDTO=10".
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 16.
 * @author Jeffrey Gilliam
 * @since 1.10
 * @copyright Copyright (C) 2015 - 2024 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','widgets/TextGauge/TextGauge','css!widgets/TextGauge/FuelLevel/FuelLevel'],
function(SIMRacingApps,TextGauge) {

    var self = {
        name:            "sraTextGaugeFuelLevel",
        url:             'TextGauge/FuelLevel',
        template:        'FuelLevel.html',
        defaultWidth:    380,
        defaultHeight:   120,
        defaultInterval: 300   //initialize with the default interval
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
                $scope[self.name]   = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                $scope.sraShowLabel = sraDispatcher.getBoolean($scope.sraArgsSHOWLABEL, $attrs.sraArgsShowLabel, $attrs.sraArgsShowLabel, true);
                $scope.sraShowUOM   = sraDispatcher.getBoolean($scope.sraArgsSHOWUOM, $attrs.sraArgsShowUOM, $attrs.sraArgsShowUOM, true);
                $scope.sraRoundTo   = sraDispatcher.getTruthy($scope.sraArgsTACHROUNDTO,$attrs.sraArgsRoundTo,1)*1;
                $scope.sraDecimals  = sraDispatcher.getTruthy($scope.sraArgsDECIMALS,$attrs.sraArgsDecimals,1)*1;

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
