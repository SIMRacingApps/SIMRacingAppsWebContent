'use strict';
/**
 * This widget displays a message that we are waiting on the SIM to connect.
 * 
 * Users can override the message with an image file of their own.
 * Place a file called "WaitingForSIM.png" your "Documents/SIMRacingApps" folder.
 * This image will be scaled to the window size, but the aspect ratio will be maintained.
 * The default ratio is 16x9.
 * <p>
 * Example(s):
 * <p><b>
 * &lt;sra-waiting-for-s-i-m&gt;&lt;/sra-waiting-for-s-i-m&gt;<br />
 * </b>
 * <img src="../widgets/WaitingForSIM/icon.png" />
 * @ngdoc directive
 * @name sra-waiting-for-s-i-m
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2021 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/WaitingForSIM/WaitingForSIM'],
function(SIMRacingApps) {

    var self = {
        name:            "sraWaitingForSIM",
        url:             'WaitingForSIM',
        template:        'WaitingForSIM.html',
        defaultWidth:    1920,
        defaultHeight:   1080,
        defaultInterval: 1000   //initialize with the default interval
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
                $scope.message = "";

                $scope.update = function () {
                    var value = $scope.data.Session.Messages.Value;
                    $scope.message = "";

                    var messages = value.split(";");
                    for (var i = 0; i < messages.length; i++) {
                        if (messages[i] == "DISCONNECTED") {
                            $scope.message = $scope.translations && $scope.translations["WAITINGFORSIM"] 
                                           ? $scope.translations["WAITINGFORSIM"] : "Waiting For SIM";
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
                $scope.$watch("data.Session.Messages.Value", $scope.update);

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));
                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
