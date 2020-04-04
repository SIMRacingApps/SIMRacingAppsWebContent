'use strict';
/**
 * This widget shows all your radio channels and let's you click on the one you want to talk on.
 * You can all mute of delete a channel if the SIM allows it.
 * <p>
 * Example(s):
 * <p><b>
 * &lt;sra-radio-control&gt;&lt;/sra-radio-control&gt;<br />
 * </b>
 * <img src="../widgets/RadioControl/icon.png" />
 * @ngdoc directive
 * @name sra-radio-control
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 50.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2020 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps'
       ,'css!widgets/RadioControl/RadioControl'
],function(SIMRacingApps) {

    var self = {
        name:            "sraRadioControl",
        url:             'RadioControl',
        template:        'RadioControl.html',
        defaultWidth:    480,
        defaultHeight:   480,
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

                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });
                /** your code goes here **/
                
                $scope.scanBackground   = "none";
                $scope.rowBackground    = ["none","none","none","none","none","none","none","none","none","none"];
                $scope.muteBackground   = ["none","none","none","none","none","none","none","none","none","none"];
                $scope.deleteBackground = ["none","none","none","none","none","none","none","none","none","none"];

                $scope.addChannel = function(channel) {
                    console.log("addChannel("+channel+")");
                };

                $scope.channelClicked = function($clickedScope,value,arg) {
                    console.log("channelClicked("+arg+")");
                    if ($scope.rowBackground[arg] != "none" && $scope.data.Car.ME.RadioChannel.Value != arg) {
                        $scope.rowBackground[arg] = "clicked";
                        sraDispatcher.sendCommand("Session/setRadioChannel/" + arg );
                    }
                };
                
                $scope.muteClicked = function($clickedScope,value,arg) {
                    console.log("muteClicked("+arg+")");
                    if ($clickedScope.data.Session.RadioChannelIsMutable[arg].Value) {
                        $scope.muteBackground[arg] = "clicked";
                        if ($clickedScope.data.Session.RadioChannelIsMuted[arg].Value)
                            sraDispatcher.sendCommand("Session/setRadioChannelMute/"+arg+"/true");
                        else
                            sraDispatcher.sendCommand("Session/setRadioChannelMute/"+arg+"/false");
                    }
                };
                
                $scope.deleteClicked = function($clickedScope,value,arg) {
                    console.log("deleteClicked("+arg+")");
                    if ($clickedScope.data.Session.RadioChannelIsDeletable[arg].Value) {
                        $scope.deleteBackground[arg] = "clicked";
                        sraDispatcher.sendCommand("Session/setRadioChannelDelete/" + arg );
                    }
                };
                
                $scope.scanClicked = function($clickedScope,value) {
                    console.log("scanClicked()");
                    $scope.scanBackground = "clicked";
                    sraDispatcher.sendCommand("Session/setRadioScan/" + ($scope.data.Session.RadioScan.Value ? 'false' : 'true') );
                };
                
                $scope.updateState = function() {
                    $scope.scanBackground   = "none";
                    for (var channel=0; channel < 10; channel++) {
                        if ($scope.data.Car.ME.RadioChannel.Value == channel)
                            $scope.rowBackground[channel] = "active";
                        else
                        if (!$scope.data.Session.RadioChannelIsListenOnly[channel].Value)
                            $scope.rowBackground[channel] = "cantalk";
                        else
                            $scope.rowBackground[channel] = "none";
                        
                        $scope.muteBackground[channel] = "none";
                        $scope.deleteBackground[channel] = "none";
                    }
                };
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");

                /** your code goes here **/
                $attrs.sraArgsData += ";Car/TRANSMITTING/DriverName;Car/ME/RadioChannel;Session/RadioScan";
                $scope.$watch("data.Car.TRANSMITTING.DriverName.Value", $scope.updateState);
                $scope.$watch("data.Car.ME.RadioChannel.Value", $scope.updateState);
                $scope.$watch("data.Session.RadioScan.Value", $scope.updateState);
                
                for (var channel=0; channel < 10; channel++) {
                    $attrs.sraArgsData += ";Session/RadioChannelName/"+channel;
                    $scope.$watch("data.Session.RadioChannelName['"+channel+"'].Value", $scope.updateState);
                    $attrs.sraArgsData += ";Session/RadioChannelIsListenOnly/"+channel;
                    $scope.$watch("data.Session.RadioChannelIsListenOnly['"+channel+"'].Value", $scope.updateState);
                    $attrs.sraArgsData += ";Session/RadioChannelIsScanable/"+channel;
                    $attrs.sraArgsData += ";Session/RadioChannelIsMutable/"+channel;
                    $attrs.sraArgsData += ";Session/RadioChannelIsMuted/"+channel;
                    $attrs.sraArgsData += ";Session/RadioChannelIsDeleteable/"+channel;
                }
                
                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));
                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
