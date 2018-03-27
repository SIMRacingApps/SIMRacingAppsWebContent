'use strict';
/**
 * This widget displays a message that we are in the garage.
 * Mostly to be used by streamers to cover up their garage settings,
 * but could be use to put up a setup guide.
 * <p>
 * Streamers should add the argument to the URL to set the background to transparent, &BACKGROUNDCOLOR=transparent.
 * <p>
 * Users can override the message with an image file of their own.
 * Place a file called "InGarage.png" or "InGarage.gif" in your "Documents/SIMRacingApps" folder.
 * If both are there, the gif will take priority.
 * This image will be scaled to the window size, but the aspect ratio will be maintained.
 * The default ratio is 16x9.
 * <p>
 * Example(s):
 * <p><b>
 * &lt;sra-in-garage&gt;&lt;/sra-in-garage&gt;<br />
 * </b>
 * <img src="../widgets/InGarage/icon.png" />
 * @ngdoc directive
 * @name sra-in-garage
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 100.
 * @author Jeffrey Gilliam
 * @since 1.6
 * @copyright Copyright (C) 2015 - 2018 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/InGarage/InGarage'],
function(SIMRacingApps) {

    var self = {
        name:            "sraInGarage",
        url:             'InGarage',
        template:        'InGarage.html',
        defaultWidth:    1920,
        defaultHeight:   1080,
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

                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });
                /** your code goes here **/
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");

                /** your code goes here **/
                $attrs.sraArgsData += ";Car/ME/Status";

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));
                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
