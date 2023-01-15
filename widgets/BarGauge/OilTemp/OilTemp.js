'use strict';
/**
 * This widget displays the oil temp.
 * <p>
 * States:
 * <p>
 * <ul>
 *   <li>WARNING - maybe some thing is wrong with the engine or your drafting too much.</li>
 *   <li>CRITICAL - pit and repair your engine or get some air to your engine.</li>
 * </ul>
 * Example:
 * <p><b>
 * &lt;sra-bar-gauge-oil-temp data-sra-args-show-digital-value="false"&gt;&lt;/sra-bar-gauge-oil-temp&gt;
 * </b>
 * <img src="../widgets/BarGauge/OilTemp/icon.png" />
 * @ngdoc directive
 * @name sra-bar-gauge-oil-temp
 * @param {boolean} data-sra-args-show-digital-value Set to true or false for displaying the digital value. Defaults to true. Can be overridden from the URL with "SHOWDIGITALVALUE=false".
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2023 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','widgets/BarGauge/BarGauge','css!widgets/BarGauge/OilTemp/OilTemp'],
function(SIMRacingApps,BarGauge) {

    var self = {
        name:            "sraBarGaugeOilTemp",
        url:             'BarGauge/OilTemp',
        template:        'OilTemp.html',
        defaultWidth:    800,
        defaultHeight:   280,
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
