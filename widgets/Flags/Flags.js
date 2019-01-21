'use strict';
/**
 * This widget displays the flags and informational messages about laps.
 * <p>
 * Example(s):
 * <p><b>
 * &lt;sra-flags&gt;&lt;/sra-flags&gt;<br />
 * </b>
 * <img src="../widgets/Flags/icon.png" />
 * @ngdoc directive
 * @name sra-flags
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2019 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/Flags/Flags','widgets/Messages/Messages'],
function(SIMRacingApps) {

    var self = {
        name:            "sraFlags",
        url:             'Flags',
        template:        'Flags.html',
        defaultWidth:    800,
        defaultHeight:   480,
        defaultInterval: 500   //initialize with the default interval
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

                $scope.flagsVisibility = "inherit";
                $scope.messagesVisibility = "inherit";
                $scope.CAUTIONBLINKDURATION = 30000;
                $scope.timeStarted = 0;
                $scope.blink = false;

                $scope.update = function () {
                    var value = $scope.data.Session.Messages.Value + "" + $scope.data.Car.REFERENCE.Messages.Value;
                    var flags = [];
                    $scope.blink = false;

                    //process the flag in importance order. Only the first 2 will get displayed.
                    if ($scope.data.Session.IsRedFlag.Value) {
                        flags.push("red");
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
                        $scope.leftimage  = "SIMRacingApps-Widget-Flags-leftimage  SIMRacingApps-Widget-Flags-left-" +flags[0];
                        if (flags.length > 1)
                            $scope.rightimage = "SIMRacingApps-Widget-Flags-rightimage SIMRacingApps-Widget-Flags-right-"+flags[1];
                        else
                            $scope.rightimage = "SIMRacingApps-Widget-Flags-rightimage SIMRacingApps-Widget-Flags-right-"+flags[0];
                    }
                    else {
                        $scope.leftimage  = "SIMRacingApps-Widget-Flags-leftimage";
                        $scope.rightimage = "SIMRacingApps-Widget-Flags-rightimage";
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
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                var messages      = sraDispatcher.getBoolean($scope.sraArgsShowMessages, $scope.sraArgsSHOWMESSAGES, $attrs.sraArgsShowMessages, true);
                
                if (!messages)
                    $scope.messagesVisibility = "hidden";

                /** your code goes here **/
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
