'use strict';
/**
 * This widget displays up to 3 the informational messages.
 * <p>
 * Example(s):
 * <p><b>
 * &lt;sra-messages&gt;&lt;/sra-messages&gt;<br />
 * </b>
 * <img src="../widgets/Messages/icon.png" />
 * @ngdoc directive
 * @name sra-messages
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2017 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/Messages/Messages'],
function(SIMRacingApps) {

    var self = {
        name:            "sraMessages",
        url:             'Messages',
        template:        'Messages.html',
        defaultWidth:    800,
        defaultHeight:   288,
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

                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });
                /** your code goes here **/
                $scope.messages = [];

                $scope.update = function () {
                    var value = $scope.data.Session.Messages.Value + "" + $scope.data.Car.REFERENCE.Messages.Value;
                    $scope.messages = [];

                    //process the flag in importance order. Only the first 2 will get displayed.
                    if ($scope.data.Session.IsRedFlag.Value) {
                        $scope.messages.push($scope.translations.RED);
                    }
                    if ($scope.data.Car.REFERENCE.IsBlackFlag.Value) {
                        $scope.messages.push($scope.translations.BLACK);
                    }
                    if ($scope.data.Car.REFERENCE.IsBlueFlag.Value) {
                        $scope.messages.push($scope.translations.BLUE);
                    }
                    if ($scope.data.Session.IsGreenFlag.Value) {
                        $scope.messages.push($scope.translations.GREEN);
                    }
                    if ($scope.data.Session.IsWhiteFlag.Value) {
                        $scope.messages.push($scope.translations.WHITE);
                    }
                    if ($scope.data.Session.IsCheckeredFlag.Value) {
                        $scope.messages.push($scope.translations.CHECKERED);
                    }
                    if ($scope.data.Session.IsCautionFlag.Value) {
                        $scope.messages.push($scope.translations.CAUTION);
                    }
                    if ($scope.data.Car.REFERENCE.IsYellowFlag.Value) {
                        $scope.messages.push($scope.translations.YELLOW);
                    }
                    if ($scope.data.Session.IsCrossedFlag.Value) {
                        $scope.messages.push($scope.translations.HALFWAY);
                    }
                    
                    var messages = value.split(";");
                    for (var i = 0; i < messages.length; i++) {
                        if (messages[i]) {
                            //translate TOWING without the time, then add it back
                            if (messages[i].match(/^TOWING/)) {
                                $scope.messages.push($scope.translations && $scope.translations.TOWING 
                                                   ? $scope.translations.TOWING + ' ' + messages[i].substring(7)
                                                   : messages[i]);
                            }
                            else {
                                $scope.messages.push($scope.translations && $scope.translations[messages[i]] ? $scope.translations[messages[i]] : messages[i]);
                            }
                        }
                    }
                };

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");

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
