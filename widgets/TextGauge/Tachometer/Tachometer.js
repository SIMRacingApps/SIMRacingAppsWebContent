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
 * <li>CRITICAL         - indicates it has red-lined</li>
 * </ul>
 * Example:
 * <p><b>
 * &lt;sra-text-gauge-tachometer data-sra-args-show-text-label="true"&gt;&lt;/sra-text-gauge-tachometer&gt;
 * </b>
 * <img src="../widgets/TextGauge/Tachometer/icon.png" />
 * @ngdoc directive
 * @name sra-text-gauge-tachometer
 * @param {boolean} data-sra-args-show-label Set to true or false for displaying the label. Defaults to true. Can be overridden from the URL with "SHOWLABEL=false".
 * @param {double}  data-sra-args-round-to The value to round the digital display to. Defaults to 1. Can be overridden from the URL with "ROUNDTO=10".
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 16.
 * @author Jeffrey Gilliam
 * @since 1.10
 * @copyright Copyright (C) 2015 - 2022 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','widgets/TextGauge/TextGauge','css!widgets/TextGauge/Tachometer/Tachometer'],
function(SIMRacingApps,TextGauge) {

    var self = {
        name:            "sraTextGaugeTachometer",
        url:             'TextGauge/Tachometer',
        template:        'Tachometer.html',
        defaultWidth:    380,
        defaultHeight:   120,
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
                $scope[self.name]   = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                $scope.sraShowLabel = sraDispatcher.getBoolean($scope.sraArgsSHOWLABEL, $attrs.sraArgsShowLabel, $attrs.sraArgsShowLabel, true);
                $scope.sraShowUOM   = sraDispatcher.getBoolean($scope.sraArgsSHOWUOM, $attrs.sraArgsShowUOM, $attrs.sraArgsShowUOM, false);
                $scope.sraRoundTo   = sraDispatcher.getTruthy($scope.sraArgsTACHROUNDTO,$attrs.sraArgsRoundTo,-1)*1;
                $scope.sraDecimals  = sraDispatcher.getTruthy($scope.sraArgsDECIMALS,$attrs.sraArgsDecimals,"0")*1;

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
