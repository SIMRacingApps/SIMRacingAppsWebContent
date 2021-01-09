'use strict';
/**
 * This widget shows all of the values for the In-Car Adjustments that you can make with
 * either the black box in the SIM or with assigned buttons in the SIM.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-in-car-adjustments&gt;&lt;/sra-in-car-adjustments&gt;<br />
 * </b>
 * <img src="../widgets/InCarAdjustments/icon.png" />
 * @ngdoc directive
 * @name sra-in-car-adjustments
 * @param {integer} data-sra-args-value The car to use as the reference car. Default to REFERENCE.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.8
 * @copyright Copyright (C) 2015 - 2021 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/InCarAdjustments/InCarAdjustments'],
function(SIMRacingApps) {

    var self = {
        name:            'sraInCarAdjustments',
        url:             'InCarAdjustments',
        template:        'InCarAdjustments.html',
        defaultWidth:    580,
        defaultHeight:   410,
        defaultInterval: 500, //initialize with the default interval
        module:          angular.module('SIMRacingApps') //get the main module
    };

    self.module.directive(self.name,
           ['sraDispatcher',
    function(sraDispatcher) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: ['$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                $scope.sraCar          = "REFERENCE";
                $scope.gauges          = [];
                $scope.gaugeList       = [  "ABS"
                                           ,"AntiRollFront"
                                           ,"AntiRollRear"
                                           ,"BoostLevel"
                                           ,"BrakeBiasAdjustment"
                                           ,"DiffEntry"
                                           ,"DiffExit"
                                           ,"DiffMiddle"
                                           ,"DiffPreload"
                                           ,"DisableFuelCut"
                                           ,"EngineBraking"
                                           ,"EnginePower"
                                           ,"FullCourseYellowMode"
                                           ,"FuelCutPosition"
                                           ,"FuelMixture"
                                           ,"HYSBoostHold"
                                           ,"HYSDisableBoostHold"
                                           ,"HYSCharge"
                                           ,"HYSDeployment"
                                           ,"HYSDeployMode"
                                           ,"HYSDeployTrim"
                                           ,"HYSRegenGain"
                                           ,"InLapMode"
                                           ,"LaunchRPM"
                                           ,"LowFuelAccept"
                                           ,"PeakBrakeBias"
//                                           ,"PitSpeedLimiter"
                                           ,"BrakeConnectedRF"
//                                           ,"Starter"
                                           ,"ThrottleShape"
                                           ,"TopWing"
                                           ,"TractionControl"
                                           ,"TractionControlFront"
                                           ,"TractionControlRear"
                                           ,"WeightJackerRight"
                                           ,"WeightJackerLeft"
                                           ];
                
                $scope.update = function() {
                    $scope.gauges = [];
                    for (var i in $scope.gaugeList) {
                        var gauge = $scope.gaugeList[i];
                        if ($scope.data.Car[$scope.sraCar].Gauge[gauge].ValueCurrent.State != 'NOTAVAILABLE')
                            $scope.gauges.push(gauge);
                    }
                };
                
                //load translations
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });
            }]
            , link: function($scope,$element,$attrs) {
                $scope.sraCar = sraDispatcher.getTruthy($scope.sraArgsCAR, $attrs.sraArgsCar, $scope.sraCar);

                //everytime the Status changes, update the gauges available
                $attrs.sraArgsData = "Car/"+$scope.sraCar+"/Status";
                $scope.$watch("data.Car['"+$scope.sraCar+"'].Status.Value", $scope.update);
                
                for (var i in $scope.gaugeList) {
                    var gauge = $scope.gaugeList[i];
                    $attrs.sraArgsData += ";Car/"+$scope.sraCar+"/Gauge/"+gauge+"/ValueCurrent";
                    $attrs.sraArgsData += ";Car/"+$scope.sraCar+"/Gauge/"+gauge+"/Name";
                    $attrs.sraArgsData += ";Car/"+$scope.sraCar+"/Gauge/"+gauge+"/TypeName";
                }
                
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
