'use strict';
/**
 * This widget displays a virtual tire, so that, you can click on it to change it at the next pit stop.
 * If it is not a fixed setup race, then plus(+) and minus(-) buttons will appear to change tire pressures.
 *   
 * <p>
 * If it is Red, than means it will be changed on the next pit stop to the shown value.
 * Clicking or Touching it when Red will un-set it so it will not be changed and turn it Green.
 * Clicking on a Green Button has the reverse effect, and selects it to be changed on the next pit stop.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-tire data-sra-args-tire='LF'&gt;&lt;/sra-tire&gt;<br />
 * </b>
 * <img src="../widgets/Tire/icon.png" />
 * @ngdoc directive
 * @name sra-tire
 * @param {string}  data-sra-args-tire One of LF,RF,LR,RR (Left Front, Right Front, Left Read, Right Rear). Defaults to RF.
 * @param {boolean} data-sra-args-s-i-m-controller If true, then this widget can send changes to the SIM. Defaults to false. 
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2021 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/Tire/Tire'],
function(SIMRacingApps) {

    var self = {
        name:            "sraTire",
        url:             'Tire',
        template:        'Tire.html',
        defaultWidth:    150,
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

                //load translations, if you have any un-comment this
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                   $scope.translations = sraDispatcher.getTranslation(path);
                });

                $scope.background = 'normal';
                $scope.Lcolor     = 'rgb(0,255,0)';
                $scope.Mcolor     = 'rgb(0,255,0)';
                $scope.Rcolor     = 'rgb(0,255,0)';

                /** your code goes here **/
                $scope.updateBackground = function() {
                    if (  $scope.data.Car.REFERENCE.Gauge['TirePressure'+$scope.value].MaxCount.State == 'NORMAL'
                    && $scope.data.Car.REFERENCE.Gauge['TirePressure'+$scope.value].Count.Value >= $scope.data.Car.REFERENCE.Gauge['TirePressure'+$scope.value].MaxCount.Value
                    )
                        $scope.controller = false;
                    else
                        $scope.controller = ($scope.data.Car.REFERENCE.HasAutomaticPitCommands.Value && $scope.canControl);
                     
                    if ($scope.data.Car.REFERENCE.Gauge['TirePressure'+$scope.value].ChangeFlag.Value) {
                        $scope.Lcolor = 'rgb(255,0,0)';
                        $scope.Mcolor = 'rgb(255,0,0)';
                        $scope.Rcolor = 'rgb(255,0,0)';
                        $scope.background = 'selected';
                    }
                    else {
                        $scope.Lcolor = 'rgb(0,128,0)';
                        $scope.Mcolor = 'rgb(0,128,0)';
                        $scope.Rcolor = 'rgb(0,128,0)';
                        $scope.background = 'normal';
                    }
//                    else {
//                        var L = $scope.data["Car/REFERENCE/Gauge/TireTemp"+$scope.value+"L/ValueHistorical"];
//                        var M = $scope.data["Car/REFERENCE/Gauge/TireTemp"+$scope.value+"M/ValueHistorical"];
//                        var R = $scope.data["Car/REFERENCE/Gauge/TireTemp"+$scope.value+"R/ValueHistorical"];
////L.Value = 215.0;
////M.Value = 200.0;
////R.Value = 225.0;
//                        var lowest  = Math.min(Math.round(L.Value),Math.round(M.Value),Math.round(R.Value));
//                        var highest = Math.max(Math.round(L.Value),Math.round(M.Value),Math.round(R.Value));
//
//                        var lowColor    = "rgb(0,0,0)";      //black
//                        var middleColor = "rgb(255,255,0)";  //yellow
//                        var highColor   = "rgb(255,0,0)";    //red
//
//                        $scope.Lcolor = (Math.round(L.Value) == lowest ? lowColor : (Math.round(L.Value) == highest ? highColor : middleColor));
//                        $scope.Mcolor = (Math.round(M.Value) == lowest ? lowColor : (Math.round(M.Value) == highest ? highColor : middleColor));
//                        $scope.Rcolor = (Math.round(R.Value) == lowest ? lowColor : (Math.round(R.Value) == highest ? highColor : middleColor));
//                    }
                };

                $scope.onClickIncrement = function() {
                    if (!$scope.controller)
                        return;
                    if (!$scope.data.Car.REFERENCE.Gauge['TirePressure'+$scope.value].IsFixed.Value) {
                        sraDispatcher.sendCommand('Car/REFERENCE/Gauge/TirePressure'+$scope.value+'/IncrementValueNext');
                        $scope.Lcolor = $scope.Mcolor = $scope.Rcolor = 'rgba(255,0,0,.3)';
                        $scope.background = 'clicked';
                    }
                };
                $scope.onClickDecrement = function() {
                    if (!$scope.controller)
                        return;
                    if (!$scope.data.Car.REFERENCE.Gauge['TirePressure'+$scope.value].IsFixed.Value) {
                        sraDispatcher.sendCommand('Car/REFERENCE/Gauge/TirePressure'+$scope.value+'/DecrementValueNext');
                        $scope.Lcolor = $scope.Mcolor = $scope.Rcolor = 'rgba(255,0,0,.3)';
                        $scope.background = 'clicked';
                    }
                };
                $scope.onClickSurface = function() {
                    if (!$scope.controller)
                        return;
                    if (!$scope.data.Car.REFERENCE.Gauge['TirePressure'+$scope.value].ChangeFlag.Value)
                        sraDispatcher.sendCommand('Car/REFERENCE/Gauge/TirePressure'+$scope.value+'/setChangeFlag/true');
                    else
                        sraDispatcher.sendCommand('Car/REFERENCE/Gauge/TirePressure'+$scope.value+'/setChangeFlag/false');
                    $scope.Lcolor = $scope.Mcolor = $scope.Rcolor = 'rgba(255,0,0,.3)';
                    $scope.background = 'clicked';
                };
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsTIRE, $attrs.sraArgsTire, $scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "RF");

                /** your code goes here **/
                $scope.canControl = sraDispatcher.getBoolean($scope.sraArgsPITCOMMANDSSIMCONTROLLER,$attrs.sraArgsSIMController,$attrs.sraSIMController, false);
                $scope.controller = false;
                
                if ($scope.canControl)
                    $attrs.sraArgsData += ";Car/REFERENCE/HasAutomaticPitCommands";

                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TireTemp"+$scope.value+"L/ValueHistorical";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TireTemp"+$scope.value+"M/ValueHistorical";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TireTemp"+$scope.value+"R/ValueHistorical";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressure"+$scope.value+"/ValueNext";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressure"+$scope.value+"/Laps";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressure"+$scope.value+"/IsDirty";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressure"+$scope.value+"/IsFixed";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressure"+$scope.value+"/ChangeFlag";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressure"+$scope.value+"/Count";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressure"+$scope.value+"/MaxCount";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TireCompound"+"/ValueNext";

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                /** Watches go here **/

                var elements = $element.find("td");
                for (var i=0; i < elements.length;i++) {
                    var element = angular.element(elements[i]);
                    if (element.hasClass("SIMRacingApps-Widget-Tire-increment"))
                        sraDispatcher.onClick($scope,element,$scope.onClickIncrement);
                    if (element.hasClass("SIMRacingApps-Widget-Tire-decrement"))
                        sraDispatcher.onClick($scope,element,$scope.onClickDecrement);
                    if (element.hasClass("SIMRacingApps-Widget-Tire-surface"))
                        sraDispatcher.onClick($scope,element,$scope.onClickSurface);
                }

                $scope.$watch("data.Car.REFERENCE.HasAutomaticPitCommands.Value", function(value) {
                    if (!value)
                        $scope.controller = false;
                    else
                    if (value && $scope.canControl)
                        $scope.controller = true;
                });
                $scope.$watch("data.Car.REFERENCE.Gauge['TireTemp"+$scope.value+"L'].ValueHistorical.Value",$scope.updateBackground);
                $scope.$watch("data.Car.REFERENCE.Gauge['TireTemp"+$scope.value+"M'].ValueHistorical.Value",$scope.updateBackground);
                $scope.$watch("data.Car.REFERENCE.Gauge['TireTemp"+$scope.value+"R'].ValueHistorical.Value",$scope.updateBackground);
                $scope.$watch("data.Car.REFERENCE.Gauge['TirePressure"+$scope.value+"'].ValueNext.Value",$scope.updateBackground);
                $scope.$watch("data.Car.REFERENCE.Gauge['TirePressure"+$scope.value+"'].ChangeFlag.Value",$scope.updateBackground);
                $scope.$watch("data.Car.REFERENCE.Gauge['TirePressure"+$scope.value+"'].Count.Value",$scope.updateBackground);
            }
        };
    }]);

    return self;
});
