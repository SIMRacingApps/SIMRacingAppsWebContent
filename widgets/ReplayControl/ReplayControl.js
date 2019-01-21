'use strict';
/**
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-replay-control&gt;&lt;/sra-replay-control&gt;<br />
 * </b>
 * <img src="../widgets/ReplayControl/icon.png" alt="Image goes here"/>
 * @ngdoc directive
 * @name sra-replay-control
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 300.
 * @author Jeffrey Gilliam
 * @since 1.3
 * @copyright Copyright (C) 2015 - 2019 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/ReplayControl/ReplayControl'],
function(SIMRacingApps) {

    var self = {
        name:            "sraReplayControl",
        url:             'ReplayControl',
        template:        'ReplayControl.html',
        defaultWidth:    800,
        defaultHeight:   300,
        defaultInterval: 300   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$rootScope', '$timeout',
    function(sraDispatcher,   $filter,   $rootScope,   $timeout) {
        return {
            restrict:    'EA',
            scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName    = self.name;
                $scope.defaultWidth     = self.defaultWidth;
                $scope.defaultHeight    = self.defaultHeight;
                $scope.defaultInterval  = self.defaultInterval;

                $scope.translations     = {};
                $scope.clickDelay       = 200;
                $scope.clickedStatus    = 'N';
                $scope.currentState     = '';

                //load translations, if you have any comment out if you do not so it will not look for them
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });

                $scope.sendCommand = function(command) {
                    sraDispatcher.sendCommand(command);
                    console.log(command);
                };
                
                $scope.updateState = function(value) {
                    console.log('updateState() called = ('+$scope.data.Session.Replay.Value+')');
                    $scope.currentState = $scope.data.Session.Replay.Value;
                };
                
                $scope.onButtonClick = function(scope,value,button) {
                    console.log('ReplayControl.onButtonClick('+button+')');
                    scope.clickedStatus = 'Y';
                    
                    $scope.sendCommand("Session/setReplay/" + button);

                    $timeout(function(scope) {
                        scope.clickedStatus = 'N';
                    }, $scope.clickDelay,null,scope);
                };
                
                $scope.onPositionButtonClick = function(scope,value,button) {
                    console.log('ReplayControl.onPositionButtonClick('+button+')');
                    scope.clickedStatus = 'Y';
                    
                    $scope.sendCommand("Session/setReplayPosition/" + button);

                    $timeout(function(scope) {
                        scope.clickedStatus = 'N';
                    }, $scope.clickDelay,null,scope);
                };
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                
                /** your code goes here **/
                $attrs.sraArgsData += ";Session/Replay";
                $attrs.sraArgsData += ";Session/IsReplay";

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                $scope.$watch('data.Session.Replay.Value',$scope.updateState);
            }
        };
    }]);

    return self;
});
