'use strict';
/**
 * This widget shows all your tire compounds and allows you to select the one you want.
 * <p>
 * Example(s):
 * <p><b>
 * &lt;sra-tire-compound&gt;&lt;/sra-tire-compound&gt;<br />
 * </b>
 * <img src="../widgets/TireCompound/icon.png" />
 * @ngdoc directive
 * @name sra-tire-compound
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 50.
 * @author Jeffrey Gilliam
 * @since 1.22
 * @copyright Copyright (C) 2015 - 2024 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps'
       ,'css!widgets/TireCompound/TireCompound'
],function(SIMRacingApps) {

    var self = {
        name:            "sraTireCompound",
        url:             'TireCompound',
        template:        'TireCompound.html',
        defaultWidth:    240,
        defaultHeight:   240,
        defaultInterval: 50   //initialize with the default interval
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

                /** your code goes here **/
                
                $scope.backgroundRow1Col1 = "none";
                $scope.backgroundRow1Col2 = "none";
                $scope.backgroundRow2Col1 = "none";
                $scope.backgroundRow2Col2 = "none";
                $scope.controller         = false;

                $scope.row1col1Clicked = function($clickedScope,value) {
                    console.log("Clicked("+$scope.data.Car.REFERENCE.Gauge.TireCompound.Value['0'].ValueFormatted+")");
                    if ($scope.backgroundRow1Col1 != "active" && $scope.data.Car.REFERENCE.Gauge.TireCompound.Value['0'].ValueFormatted != "") {
                        if ($scope.controller) {
                            $scope.backgroundRow1Col1 = "clicked";
                            sraDispatcher.sendCommand("Car/REFERENCE/Gauge/TireCompound/setValueNext/0");
                        }
                    }
                };
                
                $scope.row1col2Clicked = function($clickedScope,value) {
                    console.log("Clicked("+$scope.data.Car.REFERENCE.Gauge.TireCompound.Value['1'].ValueFormatted+")");
                    if ($scope.backgroundRow1Col2 != "active" && $scope.data.Car.REFERENCE.Gauge.TireCompound.Value['1'].ValueFormatted != "") {
                        if ($scope.controller) {
                            $scope.backgroundRow1Col2 = "clicked";
                            sraDispatcher.sendCommand("Car/REFERENCE/Gauge/TireCompound/setValueNext/1");
                        }
                    }
                };
                
                $scope.row2col1Clicked = function($clickedScope,value) {
                    console.log("Clicked("+$scope.data.Car.REFERENCE.Gauge.TireCompound.Value['2'].ValueFormatted+")");
                    if ($scope.backgroundRow2Col1 != "active" && $scope.data.Car.REFERENCE.Gauge.TireCompound.Value['2'].ValueFormatted != "") {
                        if ($scope.controller) {
                            $scope.backgroundRow2Col1 = "clicked";
                            sraDispatcher.sendCommand("Car/REFERENCE/Gauge/TireCompound/setValueNext/2");
                        }
                    }
                };
                
                $scope.row2col2Clicked = function($clickedScope,value) {
                    console.log("Clicked("+$scope.data.Car.REFERENCE.Gauge.TireCompound.Value['3'].ValueFormatted+")");
                    if ($scope.backgroundRow2Col2 != "active" && $scope.data.Car.REFERENCE.Gauge.TireCompound.Value['3'].ValueFormatted != "") {
                        if ($scope.controller) {
                            $scope.backgroundRow2Col2 = "clicked";
                            sraDispatcher.sendCommand("Car/REFERENCE/Gauge/TireCompound/setValueNext/3");
                        }
                    }
                };
                
                
                $scope.updateState = function() {
                    $scope.backgroundRow1Col1 = "none";
                    $scope.backgroundRow1Col2 = "none";
                    $scope.backgroundRow2Col1 = "none";
                    $scope.backgroundRow2Col2 = "none";
                    
                    if ($scope.data.Car.REFERENCE.Gauge.TireCompound.Value['0'].ValueFormatted != ""
                    &&  $scope.data.Car.REFERENCE.Gauge.TireCompound.Value['0'].ValueFormatted == $scope.data.Car.REFERENCE.Gauge.TireCompound.ValueNext.ValueFormatted)
                        $scope.backgroundRow1Col1 = "active";
                    
                    if ($scope.data.Car.REFERENCE.Gauge.TireCompound.Value['1'].ValueFormatted != ""
                    &&  $scope.data.Car.REFERENCE.Gauge.TireCompound.Value['1'].ValueFormatted == $scope.data.Car.REFERENCE.Gauge.TireCompound.ValueNext.ValueFormatted)
                        $scope.backgroundRow1Col2 = "active";
                    
                    if ($scope.data.Car.REFERENCE.Gauge.TireCompound.Value['2'].ValueFormatted != ""
                    &&  $scope.data.Car.REFERENCE.Gauge.TireCompound.Value['2'].ValueFormatted == $scope.data.Car.REFERENCE.Gauge.TireCompound.ValueNext.ValueFormatted)
                        $scope.backgroundRow2Col1 = "active";
                    
                    if ($scope.data.Car.REFERENCE.Gauge.TireCompound.Value['3'].ValueFormatted != ""
                    &&  $scope.data.Car.REFERENCE.Gauge.TireCompound.Value['3'].ValueFormatted == $scope.data.Car.REFERENCE.Gauge.TireCompound.ValueNext.ValueFormatted)
                        $scope.backgroundRow2Col2 = "active";
                };
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                $scope.canControl = sraDispatcher.getBoolean($scope.sraArgsPITCOMMANDSSIMCONTROLLER,$attrs.sraArgsSIMController,$attrs.sraSIMController,false);
                $scope.controller = false;

                /** your code goes here **/
                if ($scope.canControl)
                    $attrs.sraArgsData += ";Car/REFERENCE/HasAutomaticPitCommands";
                
                $scope.$watch("data.Car.REFERENCE.Gauge.TireCompound.ValueNext.ValueFormatted", $scope.updateState);
                $scope.$watch("data.Car.REFERENCE.HasAutomaticPitCommands.Value", function(value) {
                    if (!value) {
                        $scope.controller = false;
                    }
                    else
                    if (value && $scope.canControl) {
                        $scope.controller = true;
                    }
                });
                
                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));
                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
