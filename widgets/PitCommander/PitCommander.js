'use strict';
/**
 * This widget displays a virtual car, so that, you can click on parts of the car to change settings for the next pit stop.
 * It also displays the tire temps and wear if the tire was changed when you pitted.
 * It uses the {@link sra-fuel-tank FuelTank} widget, the {@link sra-tire Tire} widget. 
 * See those widgets for their documentation.
 *   
 * <p>
 * If a button is Red, than means it will be changed on the next pit stop to the shown value.
 * Clicking or Touching a Red Button will un-set it so it will not be changed and turn it Green.
 * Clicking on a Green Button has the reverse effect, and selects it to be changed on the next pit stop.
 * Some changes are done by the SIM, and displayed by this widget.
 * Also, the value after pitting will depend on the SIM. 
 * For example, iRacing defaults to full service after a pit. 
 * Meaning it will fill up on fuel and change all 4 tires, etc. But that can be changed in the iRacing/app.ini file. 
 * I detect that setting and react to it accordingly.
 * <p>
 * <b>iRacing Specifics as of the June 2015 build:</b>
 * <p>
 * iRacing supports sending commands for Fuel, Tires, and Tearoff only. If not a fixed setup race, then also tire pressures.
 * If you change any of these using iRacing's black boxes, I will not know it because iRacing doesn't send these to me.
 * But, the Tape, Brake Bias Adjustment and Wedge Adjustment can only be set in iRacing's black boxes and it does send me those values.
 * I have requested that iRacing be consistent so Apps like these work the same for all changes.   
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-pit-commander&gt;&lt;/sra-pit-commander&gt;<br />
 * </b>
 * <img src="../widgets/PitCommander/icon.png" />
 * @ngdoc directive
 * @name sra-pit-commander
 * @param {boolean} data-sra-args-s-i-m-controller If true, then this widget can send changes to the SIM. Defaults to false. 
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 100.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2019 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/PitCommander/PitCommander'
       ,'widgets/FuelTank/FuelTank'
       ,'widgets/Tire/Tire'
       ,'widgets/TireMeasurements/TireMeasurements'
       ,'widgets/Flags/Flags'
       ,'widgets/CarImage/CarImage'
],function(SIMRacingApps) {

    var self = {
        name:            "sraPitCommander",
        url:             'PitCommander',
        template:        'PitCommander.html',
        defaultWidth:    600,
        defaultHeight:   480,
        defaultInterval: 500   //initialize with the default interval
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

                //load translations
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });

                /** your code goes here **/
                $scope.onClickWindshield = function(event) {
                    if (!$scope.controller)
                        return;
                    if ($scope.data.Car.REFERENCE.Gauge.WindshieldTearoff.ChangeFlag.Value)
                        sraDispatcher.sendCommand("Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/false");
                    else
                        sraDispatcher.sendCommand("Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/true");
                    $scope.windshield = 'clicked';
                };

                $scope.onClickFastRepairs = function(event) {
                    if (!$scope.controller)
                        return;
                    if ($scope.data.Car.REFERENCE.Gauge.FastRepairs.ChangeFlag.Value)
                        sraDispatcher.sendCommand("Car/REFERENCE/Gauge/FastRepairs/setChangeFlag/false");
                    else
                        sraDispatcher.sendCommand("Car/REFERENCE/Gauge/FastRepairs/setChangeFlag/true");
                    $scope.fastrepairs = 'clicked';
                };

                $scope.updateButtonStates = function() {
                    $scope.LF = $scope.data.Car.REFERENCE.Gauge.TirePressureLF.ChangeFlag.Value;
                    $scope.LR = $scope.data.Car.REFERENCE.Gauge.TirePressureLR.ChangeFlag.Value;
                    $scope.RF = $scope.data.Car.REFERENCE.Gauge.TirePressureRF.ChangeFlag.Value;
                    $scope.RR = $scope.data.Car.REFERENCE.Gauge.TirePressureRR.ChangeFlag.Value;
                    $scope.GAS= $scope.data.Car.REFERENCE.Gauge.FuelLevel.ChangeFlag.Value;
                    $scope.WS = $scope.data.Car.REFERENCE.Gauge.WindshieldTearoff.ChangeFlag.Value;
                    $scope.FR = $scope.data.Car.REFERENCE.Gauge.FastRepairs.ChangeFlag.Value;

                    $scope.lefts  = $scope.leftsgas = $scope.rights = $scope.rightsgas = $scope.tires4 = $scope.tires4gas = $scope.windshield = $scope.fastrepairs = "normal";

                    if ($scope.LF && $scope.LR) {
                        $scope.lefts = "selected";
                        if ($scope.GAS)
                            $scope.leftsgas = "selected";
                    }
                    if ($scope.RF && $scope.RR) {
                        $scope.rights = "selected";
                        if ($scope.GAS)
                            $scope.rightsgas = "selected";
                    }
                    if ($scope.LF && $scope.LR && $scope.RF && $scope.RR) {
                        $scope.tires4 = "selected";
                        if ($scope.GAS)
                            $scope.tires4gas = "selected";
                    }
                    if ($scope.WS)
                        $scope.windshield = "selected";
                    
                    if ($scope.FR)
                        $scope.fastrepairs = "selected";

                };

                $scope.onClickLefts = function(event) {
                    if (!$scope.controller)
                        return;
                    var command;
                    if ($scope.lefts == "selected") {
                        command = "Car/REFERENCE/Gauge/TirePressureLF/setChangeFlag/false;Car/REFERENCE/Gauge/TirePressureLR/setChangeFlag/false";
                        if (!$scope.RF && !$scope.RR && !$scope.GAS)
                            command += ";Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/false";
                    }
                    else
                        command = "Car/REFERENCE/Gauge/TirePressureLF/setChangeFlag/true;Car/REFERENCE/Gauge/TirePressureLR/setChangeFlag/true;Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/true";

                    sraDispatcher.sendCommand(command);
                    $scope.lefts = "clicked";
                };
                $scope.onClickLeftsGas = function(event) {
                    if (!$scope.controller)
                        return;
                    var MAX= $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value;

                    var command;
                    if ($scope.leftsgas == "selected") {
                        command = "Car/REFERENCE/Gauge/TirePressureLF/setChangeFlag/false;Car/REFERENCE/Gauge/TirePressureLR/setChangeFlag/false;Car/REFERENCE/Gauge/FuelLevel/setValueNext/0;Car/REFERENCE/Gauge/FuelLevel/setChangeFlag/false";
                        if (!$scope.RF && !$scope.RR)
                            command += ";Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/false";
                    }
                    else
                        command = "Car/REFERENCE/Gauge/TirePressureLF/setChangeFlag/true;Car/REFERENCE/Gauge/TirePressureLR/setChangeFlag/true;Car/REFERENCE/Gauge/FuelLevel/setValueNext/"+MAX+";Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/true";
                    sraDispatcher.sendCommand(command);
                    $scope.leftsgas = "clicked";
                };
                $scope.onClickRights = function(event) {
                    if (!$scope.controller)
                        return;
                    var command;
                    if ($scope.rights == "selected") {
                        command = "Car/REFERENCE/Gauge/TirePressureRF/setChangeFlag/false;Car/REFERENCE/Gauge/TirePressureRR/setChangeFlag/false";
                        if (!$scope.LF && !$scope.LR && !$scope.GAS)
                            command += ";Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/false";
                    }
                    else
                        command = "Car/REFERENCE/Gauge/TirePressureRF/setChangeFlag/true;Car/REFERENCE/Gauge/TirePressureRR/setChangeFlag/true;Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/true";
                    sraDispatcher.sendCommand(command);
                    $scope.rights = "clicked";
                };
                $scope.onClickRightsGas = function(event) {
                    if (!$scope.controller)
                        return;
                    var MAX= $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value;

                    var command;
                    if ($scope.rightsgas == "selected") {
                        command = "Car/REFERENCE/Gauge/TirePressureRF/setChangeFlag/false;Car/REFERENCE/Gauge/TirePressureRR/setChangeFlag/false;Car/REFERENCE/Gauge/FuelLevel/setValueNext/0;Car/REFERENCE/Gauge/FuelLevel/setChangeFlag/false";
                        if (!$scope.LF && !$scope.LR)
                            command += ";Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/false";
                    }
                    else
                        command = "Car/REFERENCE/Gauge/TirePressureRF/setChangeFlag/true;Car/REFERENCE/Gauge/TirePressureRR/setChangeFlag/true;Car/REFERENCE/Gauge/FuelLevel/setValueNext/"+MAX+";Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/true";
                    sraDispatcher.sendCommand(command);
                    $scope.rightsgas = "clicked";
                };
                $scope.onClickTires4 = function(event) {
                    if (!$scope.controller)
                        return;
                    var command;
                    if ($scope.tires4 == "selected") {
                        command = "Car/REFERENCE/Gauge/TirePressureRF/setChangeFlag/false;Car/REFERENCE/Gauge/TirePressureRR/setChangeFlag/false;Car/REFERENCE/Gauge/TirePressureLF/setChangeFlag/false;Car/REFERENCE/Gauge/TirePressureLR/setChangeFlag/false";
                        if (!$scope.GAS)
                            command += ";Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/false";
                    }
                    else
                        command = "Car/REFERENCE/Gauge/TirePressureRF/setChangeFlag/true;Car/REFERENCE/Gauge/TirePressureRR/setChangeFlag/true;Car/REFERENCE/Gauge/TirePressureLF/setChangeFlag/true;Car/REFERENCE/Gauge/TirePressureLR/setChangeFlag/true;Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/true";
                    sraDispatcher.sendCommand(command);
                    $scope.tires4 = "clicked";
                };
                $scope.onClickTires4Gas = function(event) {
                    if (!$scope.controller)
                        return;
                    var MAX= $scope.data.Car.REFERENCE.Gauge.FuelLevel.CapacityMaximum.Value;

                    var command;
                    if ($scope.tires4gas == "selected")
                        command = "Car/REFERENCE/Gauge/TirePressureRF/setChangeFlag/false;Car/REFERENCE/Gauge/TirePressureRR/setChangeFlag/false;Car/REFERENCE/Gauge/TirePressureLF/setChangeFlag/false;Car/REFERENCE/Gauge/TirePressureLR/setChangeFlag/false;Car/REFERENCE/Gauge/FuelLevel/setValueNext/0;Car/REFERENCE/Gauge/FuelLevel/setChangeFlag/false;Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/false";
                    else
                        command = "Car/REFERENCE/Gauge/TirePressureRF/setChangeFlag/true;Car/REFERENCE/Gauge/TirePressureRR/setChangeFlag/true;Car/REFERENCE/Gauge/TirePressureLF/setChangeFlag/true;Car/REFERENCE/Gauge/TirePressureLR/setChangeFlag/true;Car/REFERENCE/Gauge/FuelLevel/setValueNext/"+MAX+";Car/REFERENCE/Gauge/WindshieldTearoff/setChangeFlag/true";
                    sraDispatcher.sendCommand(command);
                    $scope.tires4gas = "clicked";
                };
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");

                /** your code goes here **/
                $scope.canControl = sraDispatcher.getBoolean($scope.sraArgsPITCOMMANDSSIMCONTROLLER,$attrs.sraArgsSIMController,$attrs.sraSIMController,false);
                $scope.controller = false;
                
                if ($scope.canControl)
                    $attrs.sraArgsData += ";Car/REFERENCE/HasAutomaticPitCommands";

                $attrs.sraArgsData += ";Car/REFERENCE/RepairTime;Car/REFERENCE/RepairTimeOptional";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/Tape/ValueNext;Car/REFERENCE/Gauge/Tape/ChangeFlag;Car/REFERENCE/Gauge/Tape/IsFixed";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/FrontWing/ValueNext;Car/REFERENCE/Gauge/FrontWing/ChangeFlag;Car/REFERENCE/Gauge/FrontWing/IsFixed";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/FrontFlap/ValueNext;Car/REFERENCE/Gauge/FrontFlap/ChangeFlag;Car/REFERENCE/Gauge/FrontFlap/IsFixed";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/RearWing/ValueNext;Car/REFERENCE/Gauge/RearWing/ChangeFlag;Car/REFERENCE/Gauge/RearWing/IsFixed";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/RRWedgeAdjustment/ValueNext;Car/REFERENCE/Gauge/RRWedgeAdjustment/ChangeFlag;Car/REFERENCE/Gauge/RRWedgeAdjustment/IsFixed";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/LRWedgeAdjustment/ValueNext;Car/REFERENCE/Gauge/LRWedgeAdjustment/ChangeFlag;Car/REFERENCE/Gauge/LRWedgeAdjustment/IsFixed";
                //TODO: Get some help from the server on if this gauge is in-car(real-time) or next pit
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/BrakeBiasAdjustment/ValueNext;Car/REFERENCE/Gauge/BrakeBiasAdjustment/IsFixed";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/WindshieldTearoff/ChangeFlag";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/FastRepairs/ChangeFlag;Car/REFERENCE/Gauge/FastRepairs/ValueCurrent";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressureLF/ChangeFlag;Car/REFERENCE/Gauge/TirePressureLR/ChangeFlag";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressureRF/ChangeFlag;Car/REFERENCE/Gauge/TirePressureRR/ChangeFlag";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/FuelLevel/ChangeFlag;Car/REFERENCE/Gauge/FuelLevel/CapacityMaximum";
                $attrs.sraArgsData += ";Session/IncidentLimit;Car/REFERENCE/Incidents;Car/REFERENCE/IncidentsTeam";
                
                //TODO: As of the March 2015 build, iRacing doesn't let you control Tape, Wedge, Brake Bias from a client

                var elements = $element.find("div");
                for (var i=0; i < elements.length;i++) {
                    var element = angular.element(elements[i]);
                    if (element.hasClass("SIMRacingApps-Widget-PitCommander-windshield"))
                        sraDispatcher.onClick($scope,element,$scope.onClickWindshield);
                    if (element.hasClass("SIMRacingApps-Widget-PitCommander-fastrepairs"))
                        sraDispatcher.onClick($scope,element,$scope.onClickFastRepairs);
                    if (element.hasClass("SIMRacingApps-Widget-PitCommander-button-lefts"))
                        sraDispatcher.onClick($scope,element,$scope.onClickLefts);
                    if (element.hasClass("SIMRacingApps-Widget-PitCommander-button-lefts-gas"))
                        sraDispatcher.onClick($scope,element,$scope.onClickLeftsGas);
                    if (element.hasClass("SIMRacingApps-Widget-PitCommander-button-rights"))
                        sraDispatcher.onClick($scope,element,$scope.onClickRights);
                    if (element.hasClass("SIMRacingApps-Widget-PitCommander-button-rights-gas"))
                        sraDispatcher.onClick($scope,element,$scope.onClickRightsGas);
                    if (element.hasClass("SIMRacingApps-Widget-PitCommander-button-tires4"))
                        sraDispatcher.onClick($scope,element,$scope.onClickTires4);
                    if (element.hasClass("SIMRacingApps-Widget-PitCommander-button-tires4-gas"))
                        sraDispatcher.onClick($scope,element,$scope.onClickTires4Gas);
                }

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                /** watches go here **/
                $scope.$watch("data.Car.REFERENCE.HasAutomaticPitCommands.Value", function(value) {
                    if (!value)
                        $scope.controller = false;
                    else
                    if (value && $scope.canControl)
                        $scope.controller = true;
                });

                $scope.$watch("data.Car.REFERENCE.Gauge.TirePressureLF.ChangeFlag.Value",   $scope.updateButtonStates);
                $scope.$watch("data.Car.REFERENCE.Gauge.TirePressureLR.ChangeFlag.Value",   $scope.updateButtonStates);
                $scope.$watch("data.Car.REFERENCE.Gauge.TirePressureRF.ChangeFlag.Value",   $scope.updateButtonStates);
                $scope.$watch("data.Car.REFERENCE.Gauge.TirePressureRR.ChangeFlag.Value",   $scope.updateButtonStates);
                $scope.$watch("data.Car.REFERENCE.Gauge.FuelLevel.ChangeFlag.Value",        $scope.updateButtonStates);
                $scope.$watch("data.Car.REFERENCE.Gauge.WindshieldTearoff.ChangeFlag.Value",$scope.updateButtonStates);
                $scope.$watch("data.Car.REFERENCE.Gauge.FastRepairs.ChangeFlag.Value",      $scope.updateButtonStates);
            }
        };
    }]);

    return self;
});
