'use strict';
/**
 * This widget displays a who is talking and whispering in TeamSpeak.
 * For this to work, TeamSpeak has to be running and the ClientQuery plug-in has to be enabled in the settings. 
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-team-speak-talking&gt;&lt;/sra-team-speak-talking&gt;<br />
 * </b>
 * <img src="../widgets/TeamSpeakTalking/icon.png" />
 * @ngdoc directive
 * @name sra-team-speak-talking
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 50.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2017 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/TeamSpeakTalking/TeamSpeakTalking','widgets/DataTable/DataTable'],
function(SIMRacingApps) {

    var self = {
        name:            "sraTeamSpeakTalking",
        url:             'TeamSpeakTalking',
        template:        'TeamSpeakTalking.html',
        defaultWidth:    800,
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

                //load translations, if you have any un-comment this
//              sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
//                  $scope.translations = sraDispatcher.getTranslation(path);
//              });

                /** your code goes here **/

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");

                /** your code goes here **/

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
