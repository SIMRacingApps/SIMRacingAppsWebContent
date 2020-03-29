'use strict';
/**
 * This widget displays the flags as Horizontal bars.
 * <p>
 * Example(s):
 * <p><b>
 * &lt;sra-flags-bar-horizontal&gt;&lt;/sra-flags-bar-horizontal&gt;<br />
 * </b>
 * <img src="../widgets/FlagsBarHorizontal/icon.png" />
 * @ngdoc directive
 * @name sra-flags-bar-horizontal
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 100.
 * @author Jeffrey Gilliam, Mark Arthur
 * @since 1.13
 * @copyright Copyright (C) 2015 - 2020 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/FlagsBarHorizontal/FlagsBarHorizontal'],
function(SIMRacingApps) {

    var self = {
        name:            "sraFlagsBarHorizontal",
        url:             'FlagsBarHorizontal',
        template:        'FlagsBarHorizontal.html',
        defaultWidth:    468,
        defaultHeight:   48,
        defaultInterval: 100   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$rootScope', '$interval', '$timeout',
    function(sraDispatcher,   $filter,   $rootScope,   $interval,   $timeout) {
        return {
            restrict:    'EA',
            scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

//                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
//                    $scope.translations = sraDispatcher.getTranslation(path);
//                });
                /** your code goes here **/

                $scope.displayTop = true;
                $scope.displayGreen = true;

                $scope.sessionType = '';
                $scope.flagsVisibility = "inherit";
                $scope.CAUTIONBLINKDURATION = 30000;
                $scope.timeStarted = 0;
                $scope.blink = false;

                $scope.update = function () {
                    var value = $scope.data.Session.Messages.Value + "" + $scope.data.Car.REFERENCE.Messages.Value;
                    var flags = [];
                    $scope.blink = false;

//for testing only
//$scope.data.Session.IsGreenFlag.Value = true;

                    //process the flag in importance order. Only the first 2 will get displayed.
                    if ($scope.data.Session.IsRedFlag.Value) {
                        flags.push("red");
                    }
                    if ($scope.data.Car.REFERENCE.IsBlackFlag.Value) {
                        flags.push("black");
                    }
                    if ($scope.data.Car.REFERENCE.IsBlueFlag.Value) {
                        flags.push("blue");
                    }
                    if ($scope.data.Session.IsGreenFlag.Value) {
                        flags.push("green");
                    }
                    if ($scope.data.Session.IsWhiteFlag.Value) {
                        flags.push("white");
                    }
                    if ($scope.data.Session.IsCheckeredFlag.Value) {
                        flags.push("checkered");
                    }
                    if ($scope.data.Session.IsCautionFlag.Value || $scope.data.Car.REFERENCE.IsYellowFlag.Value) {
                        flags.push("yellow");
                        if ($scope.timeStarted == 0)
                            $scope.timeStarted = Date.now();
                            
                        if (Date.now() < ($scope.timeStarted + $scope.CAUTIONBLINKDURATION))
                            $scope.blink = true;
                    }
                    else {
                        $scope.timeStarted = 0;
                    }
                    if ($scope.data.Session.IsCrossedFlag.Value) {
                        //TODO: Find a picture of a crossed flag
                    }
                    if (value.indexOf(";REPAIR;") != -1) {
                        flags.push("repair");
                    }
                    
                    if (flags.length > 0) {
                        if ($scope.displayTop)
                            $scope.image  = "SIMRacingApps-Widget-FlagsBarHorizontal-image-top  SIMRacingApps-Widget-FlagsBarHorizontal-top-" +flags[0];
                        else {
                            if (flags.length > 1)
                                $scope.image = "SIMRacingApps-Widget-FlagsBarHorizontal-image-bottom SIMRacingApps-Widget-FlagsBarHorizontal-bottom-"+flags[1];
                            else
                                $scope.image = "SIMRacingApps-Widget-FlagsBarHorizontal-image-bottom SIMRacingApps-Widget-FlagsBarHorizontal-bottom-"+flags[0];
                        }
                    }
                    else {
                        //if no flag, then display green, if it has already been displayed
                        if ($scope.displayGreen && $scope.data.Session.Status.Value == "GREEN") {
                            if ($scope.displayTop)
                                $scope.image  = "SIMRacingApps-Widget-FlagsBarHorizontal-image-top SIMRacingApps-Widget-FlagsBarHorizontal-top-green";
                            else
                                $scope.image  = "SIMRacingApps-Widget-FlagsBarHorizontal-image-bottom SIMRacingApps-Widget-FlagsBarHorizontal-bottom-green";
                        }
                        else {
                            //turn off flags
                            if ($scope.displayTop)
                                $scope.image  = "SIMRacingApps-Widget-FlagsBarHorizontal-image-top";
                            else
                                $scope.image  = "SIMRacingApps-Widget-FlagsBarHorizontal-image-bottom";
                        }
                    }


                    if ($scope.blink) {
                        if ($scope._blink == null) {
                            $scope._blink = $interval(function() {
                                if ($scope.flagsVisibility == 'inherit') {
                                    $scope.flagsVisibility = 'hidden';
                                }
                                else {
                                    $scope.flagsVisibility = 'inherit';
                                }
                            }, 500);
                            //stop the blinking after the CAUTIONBLINKDURATION
                            $timeout(function() {
                                if ($scope._blink) {
                                    $interval.cancel($scope._blink);
                                    $scope.flagsVisibility = 'inherit';
                                    $scope._blink = null;
                                    $scope.blink = false;
                                }
                            },$scope.CAUTIONBLINKDURATION);
                        }
                    }
                    else
                    if ($scope._blink) {
                        $interval.cancel($scope._blink);
                        $scope.flagsVisibility = 'inherit';
                        $scope._blink = null;
                    }

                };

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name]   = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                $scope.displayTop   = sraDispatcher.getBoolean($scope.sraArgsDISPLAYTOP,   $scope.sraDisplayTop,   $attrs.sraArgsDISPLAYTOP,   $attrs.sraArgsDisplayTop,   $scope.displayTop);
                $scope.displayGreen = sraDispatcher.getBoolean($scope.sraArgsDISPLAYGREEN, $scope.sraDisplayGreen, $attrs.sraArgsDISPLAYGREEN, $attrs.sraArgsDisplayGreen, $scope.displayGreen);
                
                /** your code goes here **/
                $attrs.sraArgsData += ";Session/Type";
                $attrs.sraArgsData += ";Session/Status";
                $attrs.sraArgsData += ";Session/Messages";
                $attrs.sraArgsData += ";Session/IsGreenFlag";
                $attrs.sraArgsData += ";Session/IsCautionFlag";
                $attrs.sraArgsData += ";Session/IsRedFlag";
                $attrs.sraArgsData += ";Session/IsWhiteFlag";
                $attrs.sraArgsData += ";Session/IsCheckeredFlag";
                $attrs.sraArgsData += ";Session/IsCrossedFlag";
                
                $attrs.sraArgsData += ";Car/REFERENCE/Messages";
                $attrs.sraArgsData += ";Car/REFERENCE/IsYellowFlag";
                $attrs.sraArgsData += ";Car/REFERENCE/IsBlueFlag";
                $attrs.sraArgsData += ";Car/REFERENCE/IsBlackFlag";
                $attrs.sraArgsData += ";Car/REFERENCE/IsDisqualifyFlag";

                $scope.$watch("data.Session.Type.Value", $scope.update);
                $scope.$watch("data.Session.Status.Value", $scope.update);
                $scope.$watch("data.Session.Messages.Value", $scope.update);
                $scope.$watch("data.Session.IsGreenFlag.Value", $scope.update);
                $scope.$watch("data.Session.IsCautionFlag.Value", $scope.update);
                $scope.$watch("data.Session.IsRedFlag.Value", $scope.update);
                $scope.$watch("data.Session.IsWhiteFlag.Value", $scope.update);
                $scope.$watch("data.Session.IsCheckeredFlag.Value", $scope.update);
                $scope.$watch("data.Session.IsCrossedFlag.Value", $scope.update);
                $scope.$watch("data.Car.REFERENCE.Messages.Value", $scope.update);
                $scope.$watch("data.Car.REFERENCE.IsYellowFlag.Value", $scope.update);
                $scope.$watch("data.Car.REFERENCE.IsBlueFlag.Value", $scope.update);
                $scope.$watch("data.Car.REFERENCE.IsBlackFlag.Value", $scope.update);
                $scope.$watch("data.Car.REFERENCE.IsDisqualifyFlag.Value", $scope.update);

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));
                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
