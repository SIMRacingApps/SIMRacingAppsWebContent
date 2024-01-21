'use strict';
/**
 * This widget displays a virtual fuel tank/cell. 
 * The blue represents the fuel level in the tank.
 * The red represents what will be added on the next pit stop.
 * The darkened checkered area represents the amount of fuel needed to finish the race. 
 * If this area extends out of the blue area, then you will need to add fuel to finish.
 * The green area is where you have no fuel. You can click within this area to add fuel to that point.
 * <p>
 * Clicking or Touching the blue area, will toggle between request full tank and none.
 * Clicking above the blue, but within the checkered, adds the smallest amount needed to finish.
 * Clicking in the green area will add fuel to the point where you clicked.
 * <p>
 * Several fuel mileage calculations are also shown, such as, the number of laps remaining base on fuel in the tank.
 * Also, the number of laps per full tank, as well as alternate number of laps remaining based on a different number of laps to average.
 * <p>
 * By default, fuel mileage is calculated based on the worst lap that was not a out lap or caution lap, or a damaged lap.
 * This is indicated by the number of laps to average of zero(0).
 * Also by default, the alternate calculation is based on the last 2 laps averaged. 
 * Useful if saving fuel, you can see how far you can go if you continue to save at the same rate.
 * Both of these can be changed using the parameters below.
 * <p>
 * If the fuel calculations have a red background on any of them, then that means you need to pit and you cannot add enough to finish.
 * If the fuel calculations have a yellow background, then that still means you need to pit, but you can add enough fuel to finish.
 * If the fuel calculations all have a green background, then you are good to go to the end of the race on fuel that's in the tank.
 * <p>
 * If the SIM supports it, this widget can send commands to the SIM to tell it what fuel level you want added on the next pit stop.
 * By default, it does not send the commands. 
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-fuel-tank data-sra-args-laps-to-average=0 data-sra-args-alt-laps-to-average=2&gt;&lt;/sra-fuel-tank&gt;<br />
 * </b>
 * <img src="../widgets/FuelTank/icon.png" />
 * @ngdoc directive
 * @name sra-fuel-tank
 * @param {integer} data-sra-args-laps-to-average The number of laps to average all fuel calculations. Defaults to zero(0).
 * @param {integer} data-sra-args-alt-laps-to-average The number of laps to average for the alternate fuel calculations. Default zero(2).
 * @param {boolean} data-sra-args-show-alt-laps-to-average Hides the the Alternate Laps column. Default (false).
 * @param {boolean} data-sra-args-s-i-m-controller If true, then this widget can send changes to the SIM. Defaults to false.
 * @param {boolean} data-sra-args-show-table If true, then the table of values will be shown. Default (true).
 * @param {boolean} data-sra-args-show-to-go-laps If true, then the Laps To Go value will be shown. Default (true).
 * @param {boolean} data-sra-args-show-in-tank-laps If true, then the Laps remaining in the tank will be shown. Default (true).
 * @param {boolean} data-sra-args-show-per-tank-laps If true, then the number of laps for a full tank will be shown. Default (true).
 * @param {boolean} data-sra-args-show-to-finish If true, then the amount of fuel needed to finish is shown. Default (true).
 * @param {boolean} data-sra-args-show-in-tank If true, then the amount of fuel in the tank is shown. Default (true).
 * @param {boolean} data-sra-args-show-needed If true, then the amount of fuel you need to add to be able to finish is shown. Default (true).   
 * @param {boolean} data-sra-args-show-adding If true, then the actual amount of fuel you can add based on what you have asked the SIM to add will be shown. Default (true).
 * @param {boolean} data-sra-args-show-pit-stops If true, then the number of stops to finish is shown. Default (true).
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 100.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2024 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/FuelTank/FuelTank'],
function(SIMRacingApps) {

    var self = {
        name:            "sraFuelTank",
        url:             'FuelTank',
        template:        'FuelTank.html',
        defaultWidth:    360,
        defaultHeight:   480,
        defaultInterval: 100   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$rootScope',
    function(sraDispatcher,   $filter,   $rootScope) {
        return {
            restrict:    'EA',
            scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;
                $scope.translations    = {};
                
                //load translations, if you have any un-comment this
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                   $scope.translations = sraDispatcher.getTranslation(path);
                });

                $scope.controller           = false;
                $scope.showTable            = true;
                $scope.lapsToAverage        = 0; //default to worst lap
                $scope.altLapsToAverage     = 2; //when saving, use last to laps
                $scope.showAltLapsToAverage = true;
                $scope.showToGoLaps         = true;
                $scope.showInTankLaps       = true;
                $scope.showPerTankLaps      = true;
                $scope.showToFinish         = true;
                $scope.showInTank           = true;
                $scope.showNeeded           = true;
                $scope.showAdding           = true;
                $scope.showPitStops         = true;
                $scope.lapsInTank           = 0;
                $scope.altLapsInTank        = 0;
                $scope.lapsToGo             = 0;
                $scope.lapsToGoUOM          = "lap";
                $scope.classIsEnough        = "SIMRacingApps-Widget-FuelTank-enoughToFinish"; //enoughToFinish, enoughAddedToFinish, notEnoughToFinish
                $scope.classIsEnoughAdding  = "SIMRacingApps-Widget-FuelTank-enoughToFinish-adding"; //enoughToFinish-adding, enoughAddedToFinish-adding, notEnoughToFinish-adding
                $scope.classIsAltEnough     = "SIMRacingApps-Widget-FuelTank-enoughToFinish"; //enoughToFinish, enoughAddedToFinish, notEnoughToFinish
                $scope.classIsAltEnoughAdding="SIMRacingApps-Widget-FuelTank-enoughToFinish-adding"; //enoughToFinish-adding, enoughAddedToFinish-adding, notEnoughToFinish-adding
                $scope.fuelLevelToFinish    = 0.0;
                $scope.altFuelLevelToFinish = 0.0;
                
                $scope.fuelLevelPercentage          = 0;
                $scope.fuelLevelNextPercentage      = 0;
                $scope.fuelLevelNeededPercentage    = 0;
                $scope.fuelLevelToFinishPercentage  = 0;
                
                $scope.update = function() {
                    var fuelLevel   = $scope.data.Car.REFERENCE.Gauge.FuelLevel.ValueCurrent.Value;
                    var perLap      = $scope.data.Car.REFERENCE.FuelLevelPerLap[$scope.lapsToAverage].Value;
                    var altPerLap   = $scope.data.Car.REFERENCE.FuelLevelPerLap[$scope.altLapsToAverage].Value;
                    var percentage  = $scope.data.Car.REFERENCE.Lap.COMPLETEDPERCENT.Value / 100.0;
                    var adding      = $scope.data.Car.REFERENCE.Gauge.FuelLevel.ValueNext.Value;
                    var fuelChecked = $scope.data.Car.REFERENCE.Gauge.FuelLevel.ChangeFlag.Value;

                    //unless we've completed one lap, don't use the percentage
                    //Eliminates the weird numbers you get at the start of the race.
                    if (percentage < 0.0 || $scope.data.Car.REFERENCE.Lap.COMPLETED.Value <= 0)
                        percentage = 0.0;
                    
                    $scope.fuelLevelAdding              = fuelChecked ? Math.min(adding, $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value - fuelLevel): 0.0;
                    $scope.fuelLevelPercentage          = (fuelLevel / $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value) * 100.0;
                    $scope.fuelLapsRemaining            = $scope.data.Car.REFERENCE.FuelLaps[$scope.lapsToAverage].Value;
                    $scope.altFuelLapsRemaining         = $scope.data.Car.REFERENCE.FuelLaps[$scope.altLapsToAverage].Value;
                    $scope.lapsToGo                     = $scope.data.Car.REFERENCE.LapsToGo.Value - percentage;
                    $scope.lapsToGoUOM                  = $scope.data.Car.REFERENCE.LapsToGo.UOM;
                    $scope.lapsInTank                   = $scope.fuelLapsRemaining;
                    $scope.altLapsInTank                = $scope.altFuelLapsRemaining;
                    $scope.lapsPerTank                  = $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value / perLap;
                    $scope.altLapsPerTank               = $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value / altPerLap;
                    $scope.fuelLevelNeeded              = $scope.data.Car.REFERENCE.FuelLevelNeeded[$scope.lapsToAverage].Value;  
                    $scope.altFuelLevelNeeded           = $scope.data.Car.REFERENCE.FuelLevelNeeded[$scope.altLapsToAverage].Value;  
                    $scope.fuelLevelToFinish            = $scope.data.Car.REFERENCE.FuelLevelToFinish[$scope.lapsToAverage].Value;
                    $scope.altFuelLevelToFinish         = $scope.data.Car.REFERENCE.FuelLevelToFinish[$scope.altLapsToAverage].Value;
                    $scope.fuelLevelNeededPercentage    = ($scope.fuelLevelNeeded / $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value) * 100.0;
                    $scope.fuelLevelToFinishPercentage  = ($scope.fuelLevelToFinish / $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value) * 100.0;
                    
                    if (fuelChecked) {
                        $scope.fuelLevelNextPercentage = ($scope.fuelLevelAdding / $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value) * 100.0;
                    }
                    else {
                        $scope.fuelLevelNextPercentage = 0.0;
                    }
                    
                    if ($scope.fuelLevelAdding > 0.0) {
                        if ($scope.fuelLevelNeeded <= 0.0 ) {
                            $scope.classIsEnough       = "SIMRacingApps-Widget-FuelTank-enoughToFinish"; //enoughToFinish, enoughAddedToFinish, notEnoughToFinish
                            $scope.classIsEnoughAdding = "SIMRacingApps-Widget-FuelTank-enoughToFinish-adding"; //enoughToFinish-adding, enoughAddedToFinish-adding, notEnoughToFinish-adding
                        }
                        else
                        if ($scope.fuelLevelAdding >= $scope.fuelLevelNeeded) {
                            $scope.classIsEnough       = "SIMRacingApps-Widget-FuelTank-enoughAddedToFinish"; //enoughToFinish, enoughAddedToFinish, notEnoughToFinish
                            $scope.classIsEnoughAdding = "SIMRacingApps-Widget-FuelTank-enoughAddedToFinish-adding"; //enoughToFinish-adding, enoughAddedToFinish-adding, notEnoughToFinish-adding
                        }
                        else {
                            $scope.classIsEnough       = "SIMRacingApps-Widget-FuelTank-notEnoughToFinish"; //enoughToFinish, enoughAddedToFinish, notEnoughToFinish
                            $scope.classIsEnoughAdding = "SIMRacingApps-Widget-FuelTank-notEnoughToFinish-adding"; //enoughToFinish-adding, enoughAddedToFinish-adding, notEnoughToFinish-adding
                        }
                        
                        if ($scope.altFuelLevelNeeded <= 0.0 ) {
                            $scope.classIsAltEnough       = "SIMRacingApps-Widget-FuelTank-enoughToFinish"; //enoughToFinish, enoughAddedToFinish, notEnoughToFinish
                            $scope.classIsAltEnoughAdding = "SIMRacingApps-Widget-FuelTank-enoughToFinish-adding"; //enoughToFinish-adding, enoughAddedToFinish-adding, notEnoughToFinish-adding
                        }
                        else
                        if ($scope.fuelLevelAdding >= $scope.altFuelLevelNeeded) {
                            $scope.classIsAltEnough       = "SIMRacingApps-Widget-FuelTank-enoughAddedToFinish"; //enoughToFinish, enoughAddedToFinish, notEnoughToFinish
                            $scope.classIsAltEnoughAdding = "SIMRacingApps-Widget-FuelTank-enoughAddedToFinish-adding"; //enoughToFinish-adding, enoughAddedToFinish-adding, notEnoughToFinish-adding
                        }
                        else {
                            $scope.classIsAltEnough       = "SIMRacingApps-Widget-FuelTank-notEnoughToFinish"; //enoughToFinish, enoughAddedToFinish, notEnoughToFinish
                            $scope.classIsAltEnoughAdding = "SIMRacingApps-Widget-FuelTank-notEnoughToFinish-adding"; //enoughToFinish-adding, enoughAddedToFinish-adding, notEnoughToFinish-adding
                        }
                    }
                    else {
                        if ($scope.fuelLevelNeeded <= 0.0 ) {
                            $scope.classIsEnough       = "SIMRacingApps-Widget-FuelTank-enoughToFinish"; //enoughToFinish, enoughAddedToFinish, notEnoughToFinish
                            $scope.classIsEnoughAdding = "SIMRacingApps-Widget-FuelTank-enoughToFinish-adding"; //enoughToFinish-adding, enoughAddedToFinish-adding, notEnoughToFinish-adding
                        }
                        else {
                            $scope.classIsEnough       = "SIMRacingApps-Widget-FuelTank-notEnoughToFinish"; //enoughToFinish, enoughAddedToFinish, notEnoughToFinish
                            $scope.classIsEnoughAdding = "SIMRacingApps-Widget-FuelTank-notEnoughToFinish-adding"; //enoughToFinish-adding, enoughAddedToFinish-adding, notEnoughToFinish-adding
                        }
                        
                        if ($scope.altFuelLevelNeeded <= 0.0 ) {
                            $scope.classIsAltEnough       = "SIMRacingApps-Widget-FuelTank-enoughToFinish"; //enoughToFinish, enoughAddedToFinish, notEnoughToFinish
                            $scope.classIsAltEnoughAdding = "SIMRacingApps-Widget-FuelTank-enoughToFinish-adding"; //enoughToFinish-adding, enoughAddedToFinish-adding, notEnoughToFinish-adding
                        }
                        else {
                            $scope.classIsAltEnough       = "SIMRacingApps-Widget-FuelTank-notEnoughToFinish"; //enoughToFinish, enoughAddedToFinish, notEnoughToFinish
                            $scope.classIsAltEnoughAdding = "SIMRacingApps-Widget-FuelTank-notEnoughToFinish-adding"; //enoughToFinish-adding, enoughAddedToFinish-adding, notEnoughToFinish-adding
                        }
                    }
                    
                    if ($scope.lapsToGo < 0.0)
                        $scope.lapsToGo = 0.0;
                    
                    if ($scope.lapsInTank < 0.0)
                        $scope.lapsInTank = 0.0;
                    
                    if ($scope.altLapsInTank < 0.0)
                        $scope.altLapsInTank = 0.0;
               };

            }]
            , link: function($scope,$element,$attrs) {

                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                
                /** your code goes here **/
                $scope.canControl           = sraDispatcher.getBoolean($scope.sraArgsPITCOMMANDSSIMCONTROLLER, $attrs.sraArgsSIMController, $attrs.sraSIMController, "false");
                $scope.lapsToAverage        = sraDispatcher.getTruthy( $scope.sraArgsLAPSTOAVERAGE, $attrs.sraArgsLapsToAverage, $scope.lapsToAverage);
                $scope.altLapsToAverage     = sraDispatcher.getTruthy( $scope.sraArgsALTLAPSTOAVERAGE, $attrs.sraArgsAltLapsToAverage, $scope.altLapsToAverage);
                $scope.showTable            = sraDispatcher.getBoolean($scope.sraArgsSHOWTABLE, $attrs.sraArgsShowTable, $scope.showTable);
                $scope.showAltLapsToAverage = sraDispatcher.getBoolean($scope.sraArgsSHOWALTLAPSTOAVERAGE, $attrs.sraArgsShowAltLapsToAverage, $scope.showAltLapsToAverage);
                $scope.showToGoLaps         = sraDispatcher.getBoolean($scope.sraArgsSHOWTOGOLAPS,$attrs.sraArgsShowToGoLaps,$scope.showToGoLaps);
                $scope.showInTankLaps       = sraDispatcher.getBoolean($scope.sraArgsSHOWINTANKLAPS,$attrs.sraArgsShowInTankLaps,$scope.showInTankLaps);
                $scope.showPerTankLaps      = sraDispatcher.getBoolean($scope.sraArgsSHOWPERTANKLAPS,$attrs.sraArgsShowPerTankLaps,$scope.showPerTankLaps);
                $scope.showToFinish         = sraDispatcher.getBoolean($scope.sraArgsSHOWTOFINISH,$attrs.sraArgsShowToFinish,$scope.showToFinish);
                $scope.showInTank           = sraDispatcher.getBoolean($scope.sraArgsSHOWINTANK,$attrs.sraArgsShowInTank,$scope.showInTank);
                $scope.showNeeded           = sraDispatcher.getBoolean($scope.sraArgsSHOWNEEDED,$attrs.sraArgsShowNeeded,$scope.showNeeded);
                $scope.showAdding           = sraDispatcher.getBoolean($scope.sraArgsSHOWADDING,$attrs.sraArgsShowAdding,$scope.showAdding);
                $scope.showPitStops         = sraDispatcher.getBoolean($scope.sraArgsSHOWPITSTOPS,$attrs.sraArgsShowPitStops,$scope.showPitStops);
                
                if ($scope.canControl)
                    $attrs.sraArgsData += ";Car/REFERENCE/HasAutomaticPitCommands";

                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/FuelLevel/ValueCurrent";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/FuelLevel/CapacityMaximum";
                $attrs.sraArgsData += ";Car/REFERENCE/FuelLevelPerLap/"+$scope.lapsToAverage;
                $attrs.sraArgsData += ";Car/REFERENCE/FuelLevelPerLap/"+$scope.altLapsToAverage;
                $attrs.sraArgsData += ";Car/REFERENCE/PitStopsRemaining/"+$scope.lapsToAverage;
                $attrs.sraArgsData += ";Car/REFERENCE/PitStopsRemaining/"+$scope.altLapsToAverage;
                $attrs.sraArgsData += ";Car/REFERENCE/LapsToGo";
                $attrs.sraArgsData += ";Car/REFERENCE/FuelLaps/"+$scope.lapsToAverage;
                $attrs.sraArgsData += ";Car/REFERENCE/FuelLaps/"+$scope.altLapsToAverage;
                $attrs.sraArgsData += ";Car/REFERENCE/FuelLapsMaximum/"+$scope.lapsToAverage;
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/FuelLevel/ValueNext";

                $attrs.sraArgsData += ";Car/REFERENCE/FuelLevelToFinish/"+$scope.lapsToAverage;
                $attrs.sraArgsData += ";Car/REFERENCE/FuelLevelToFinish/"+$scope.altLapsToAverage;
                $attrs.sraArgsData += ";Car/REFERENCE/FuelLevelNeeded/"+$scope.lapsToAverage;
                $attrs.sraArgsData += ";Car/REFERENCE/FuelLevelNeeded/"+$scope.altLapsToAverage;
                $attrs.sraArgsData += ";Car/REFERENCE/Lap/COMPLETEDPERCENT";
                $attrs.sraArgsData += ";Car/REFERENCE/Lap/COMPLETED";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/FuelLevel/CapacityIncrement";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/FuelLevel/ChangeFlag";
                $attrs.sraArgsData += ";Car/REFERENCE/Status";

                var elements = $element.find("div");
                var tank = null;
                for (var i=0; i < elements.length;i++) {
                    var element = angular.element(elements[i]);
                    if (element.hasClass("SIMRacingApps-Widget-FuelTank-tank"))
                        tank = element;
                }

                sraDispatcher.onClick($scope,tank,function(event) {
                    if (!$scope.controller)
                        return;

                    var pct = ((event.offsetHeight - event.offsetY) / event.offsetHeight) * 100.0;
                    var fuelLevelToAdd = $scope.data.Car.REFERENCE.Gauge.FuelLevel.ValueNext.Value;

                    //if they clicked in the fuel area, toggle between full,none
                    if (pct <= $scope.fuelLevelPercentage) {
                        if ($scope.data.Car.REFERENCE.Gauge.FuelLevel.ChangeFlag.Value)
                            fuelLevelToAdd = 0;
                        else
                            fuelLevelToAdd = $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value;
                    }
                    else
                    //if clicked in the needed area, toogle between needed and none
                    if (pct <= ($scope.fuelLevelPercentage + $scope.fuelLevelNeededPercentage)) {
                        if ($scope.data.Car.REFERENCE.Gauge.FuelLevel.ChangeFlag.Value)
                            fuelLevelToAdd = 0;
                        else
                            fuelLevelToAdd  = $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value
                                            * ($scope.fuelLevelNeededPercentage / 100.0);
                    }
                    else {
                        //use the pct to calculate how much fuel to add that's above what you have
                        fuelLevelToAdd  = $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value
                                        * ((pct - $scope.fuelLevelPercentage) / 100.0);
                    }

                    if (fuelLevelToAdd == 0)
                        sraDispatcher.sendCommand("Car/REFERENCE/Gauge/FuelLevel/setValueNext/0;Car/REFERENCE/Gauge/FuelLevel/setChangeFlag/false");
                    else 
                        sraDispatcher.sendCommand("Car/REFERENCE/Gauge/FuelLevel/setValueNext/"+fuelLevelToAdd+";Car/REFERENCE/Gauge/FuelLevel/setChangeFlag/true");
                });

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                /**watches go here **/
                $scope.$watch("data.Car.REFERENCE.HasAutomaticPitCommands.Value", function(value) {
                    if (!value)
                        $scope.controller = false;
                    else
                    if (value && $scope.canControl)
                        $scope.controller = true;
                });

                $scope.$watch("data.Car.REFERENCE.Gauge.FuelLevel.ValueCurrent.Value",function(value) {
                    $scope.update();
                });
                
                $scope.$watch("data.Car.REFERENCE.Gauge.FuelLevel.ValueNext.Value",function(value) {
                    $scope.update();
                });
                $scope.$watch("data.Car.REFERENCE.Gauge.FuelLevel.ChangeFlag.Value",function(value) {
                    if (value) {
                        $scope.fuelLevelNextPercentage = ($scope.data.Car.REFERENCE.Gauge.FuelLevel.ValueNext.Value / $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value) * 100.0;
//$scope.fuelLevelNextPercentage=25;
                    }
                    else
                        $scope.fuelLevelNextPercentage = 0.0;
                    $scope.update();
                });

                $scope.$watch("data.Car.REFERENCE.Lap.COMPLETEDPERCENT.Value",function(value) {
                    $scope.update();
                });
                
                $scope.$watch("data.Car.REFERENCE.LapsToGo.Value",function(value) {
                    $scope.update();
                });
                
                $scope.$watch("data.Car.REFERENCE.FuelLaps['"+$scope.lapsToAverage+"'].Value",function(value) {
                    $scope.update();
                });
                
                $scope.$watch("data.Car.REFERENCE.FuelLaps['"+$scope.altLapsToAverage+"'].Value",function(value) {
                    $scope.update();
                });
                
                $scope.$watch("data.Car.REFERENCE.FuelLevelNeeded['"+$scope.lapsToAverage+"'].Value",function(value) {
                    $scope.update();
                });
                $scope.$watch("data.Car.REFERENCE.FuelLevelToFinish['"+$scope.lapsToAverage+"'].Value",function(value) {
                    $scope.update();
                });
            }
        };
    }]);

    return self;
});
