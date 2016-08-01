'use strict';
/**
 * This widget displays the car as a circle with either their number, id, initials, or lap completed as a percentage in the circle.
 * The car will be color coded as Yellow (you), Orange(Talking/Pacecar), Green (Leader), Red(At least a lap ahead), Blue (At least a lap behind), White (Same lap as you), Cyan (Reference Car).
 * Clicking on the car will make it the reference car.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-track-map-car data-sra-args-car="REFERENCE" data-sra-args-text-type="number"&gt;&lt;/sra-track-map-car&gt;<br />
 * </b>
 * <img src="../widgets/TrackMap/Car/icon.png" atl="Image goes here"/>
 * @ngdoc directive
 * @name sra-track-map-car
 * @param {carIdentifier} data-sra-args-car The <a href="../JavaDoc/com/SIMRacingApps/Session.html#getCar-java.lang.String-" target="_blank">Car Identifier</a> to get the number from. Defaults to REFERENCE.
 * @param {String} data-sra-args-text-type The text to display. Defaults to number. Should be one of the following: number, id, initials, percentage.
 *                 Also can be overridden from the URL parameter &TEXTYPE=number. 
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 300.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2016 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/TrackMap/Car/Car'],
function(SIMRacingApps) {

    var self = {
        name:            "sraTrackMapCar",
        url:             'TrackMap/Car',
        template:        'Car.html',
        defaultWidth:    480,
        defaultHeight:   480,
        defaultInterval: 300   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter','$rootScope', '$location',
    function(sraDispatcher,   $filter,  $rootScope,   $location) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                $scope.sraChangeCamera      = false;
                $scope.backgroundColor      = "transparent";
                $scope.backgroundColorClass = "";
                
                $scope.updateBackgroundColor = function () {
                    if ($scope.data.Car[$scope.sraCar].IsEqual.TRANSMITTING.Value)
                        $scope.backgroundColorClass = 'SIMRacingApps-Widget-TrackMap-Car-transmitting';
                    else
                        $scope.backgroundColorClass = 'SIMRacingAppsCarStatusClassBackground-'+$scope.data.Car[$scope.sraCar].StatusClass.Value;
                    
                    if ($scope.data.Session.NumberOfCarClasses.Value > 1)
                        $scope.backgroundColor = '#'+ $filter('sraHex')($scope.data.Car[$scope.sraCar].ClassColor.Value,6);
                    else
                        $scope.backgroundColor = 'black';
                    
                }
                
                $scope.updateText = function() {

                    
                    if ($scope.sraCar.match(/MARKER$/) || $scope.sraTextType == 'percentage') {
                        var percentage= $scope.sraCar.match(/MARKER$/)
                                      ? $scope.sraPercentage
                                      : $scope.data.Car[$scope.sraCar].Lap.CompletedPercent.Value
                                      ;
                        $scope.text = Math.floor(percentage * 10); //show 3 decimal places
                        while ($scope.text.toString().length < 3)
                            $scope.text = "0" + $scope.text;
                        $scope.text = $scope.text;
                    }
                    else
                    if ($scope.sraCar.match(/PITSTALL$/))
                        $scope.text = "PIT";
                    else
                    if ($scope.data.Car[$scope.sraCar].IsEqual.PACECAR.Value)
                        $scope.text = $scope.data.Car[$scope.sraCar].Number.Value;
                    else
                    if ($scope.sraTextType == 'initials')
                        $scope.text = $scope.data.Car[$scope.sraCar].DriverInitials.Value;
                    else
                    if ($scope.sraTextType == 'id')
                        $scope.text = $scope.data.Car[$scope.sraCar].Id.Value;
                    else
                        $scope.text = $scope.data.Car[$scope.sraCar].Number.Value;
                };

            }]
            , link: function($scope,$element,$attrs) {
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                //copy arguments to our $scope
                $scope.sraCar         = 
                $scope[self.name]     = sraDispatcher.getTruthy($attrs.sraArgsCar, $attrs[self.name], $attrs.sraArgsValue, "REFERENCE");
                $scope.sraTextType    = sraDispatcher.getTruthy($scope.sraArgsTEXTTYPE, $attrs.sraArgsTEXTTYPE, $attrs.sraArgsTextType, 'number').toLowerCase();  //id, number, initials, percentage
                $scope.sraPercentage  = sraDispatcher.getTruthy($attrs.sraArgsPercentage,0);         //for markers to place them where you want them
                $scope.sraChangeCamera= sraDispatcher.getBoolean($scope.sraArgsCHANGECAMERA   , $attrs.sraArgsChangeCamera,     $scope.sraChangeCamera);

                $scope.text           = ""; //this is what will be displayed on the car

                if (!$scope.sraCar.match(/MARKER$/)) {
                     $attrs.sraArgsData +=
                       ";Car/" + $scope.sraCar + "/Number"
                     + ";Car/" + $scope.sraCar + "/Id"
                     + ";Car/" + $scope.sraCar + "/DriverInitials"
                     + ";Car/" + $scope.sraCar + "/Lap/CompletedPercent"
                     + ";Car/" + $scope.sraCar + "/Status"
                     + ";Car/" + $scope.sraCar + "/StatusClass"
                     + ";Car/" + $scope.sraCar + "/IsEqual/PACECAR"
                     + ";Car/" + $scope.sraCar + "/IsEqual/TRANSMITTING"
                     + ";Car/" + $scope.sraCar + "/ClassColor"
                     + ";Car/" + $scope.sraCar + "/IsBelowMinimumSpeed"
                     + ";Session/NumberOfCarClasses"
                     ;
                }

                //if a car is clicked, make them the reference car
                sraDispatcher.onClick($scope,$element,function($event) {
                    sraDispatcher.sendCommand("Session/setReferenceCar/"+$scope.sraCar);
                    if ($scope.sraChangeCamera)
                        sraDispatcher.sendCommand("Session/setCamera/"+$scope.sraCar);
                });

            /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', function() {
                    sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight);
                });

                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                if ($scope.sraCar.match(/MARKER$/)) {
                    $scope.data.Car[$scope.sraCar].StatusClass= {};
                    $scope.data.Car[$scope.sraCar].StatusClass.Value = $scope.sraCar;
                }
                
                //removed these attributes from the template because sraCar was not resolved at the time of compilation

                if ($scope.sraTextType == 'number')
                    $scope.$watch("data.Car[sraCar].Number.Value", $scope.updateText);

                if ($scope.sraTextType == 'id')
                    $scope.$watch("data.Car[sraCar].Id.Value", $scope.updateText);

                if ($scope.sraTextType == 'initials')
                    $scope.$watch("data.Car[sraCar].DriverInitials.Value", $scope.updateText);

                if ($scope.sraTextType == 'percentage')
                    $scope.$watch("data.Car[sraCar].Lap.CompletedPercent.Value", $scope.updateText);

                $scope.$watch("data.Car[sraCar].StatusClass.Value",$scope.updateBackgroundColor);
                $scope.$watch("data.Car[sraCar].IsEqual.TRANSMITTING.Value",$scope.updateBackgroundColor);
                
                
            }
        };
    }]);

    return self;
});
