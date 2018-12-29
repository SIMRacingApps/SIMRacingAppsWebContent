'use strict';
/**
 * This widget displays the SIM's time.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-s-i-m-time&gt;&lt;/sra-s-i-m-time&gt;<br />
 * </b>
 * <img src="../widgets/SIMTime/icon.png" alt="Image goes here"/>
 * @ngdoc directive
 * @name sra-s-i-m-time
 * @param {string} data-sra-args-dateformat A string to use as the date format. Defaults to "fullDate" as defined by AngularJS.date filter at {@link https://docs.angularjs.org/api/ng/filter/date}.
 * @param {string} data-sra-args-format A string to use as the time format. Defaults to "mediumTime" as defined by AngularJS.date filter at {@link https://docs.angularjs.org/api/ng/filter/date}.
 * @param {string} data-sra-args-showtz Show time zone Y/N. Default to Y.  
 * @param {string} data-sra-args-timezone The time zone to display the time in. Defaults to the track's time zone.  
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 200.
 * @author Jeffrey Gilliam
 * @since 1.8
 * @copyright Copyright (C) 2015 - 2018 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/SIMTime/SIMTime'],
function(SIMRacingApps) {

    var self = {
        name:            "sraSIMTime",
        url:             'SIMTime',
        template:        'SIMTime.html',
        defaultWidth:    800,
        defaultHeight:   230,
        defaultInterval: 200   //initialize with the default interval
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

                $scope.dateformat = 'fullDate';
                $scope.format = 'mediumTime';
                $scope.tz     = '';
                $scope.tzShort= '';
                $scope.tzOffset = 0;
                $scope.showTZ = true;
                $scope.time = 0;
                
//                //load translations, if you have any comment out if you do not so it will not look for them
//                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
//                    $scope.translations = sraDispatcher.getTranslation(path);
//                });

                /** your code goes here **/

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
//                $scope.value = 
//                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                $scope.dateformat = $scope.sraArgsDATEFORMAT || $attrs.sraArgsDateFormat || $scope.dateformat;
                $scope.format = $scope.sraArgsFORMAT || $attrs.sraArgsFormat || $scope.format;
                $scope.tz     = $scope.sraArgsTZ || $scope.sraArgsTIMEZONE || $attrs.sraArgsTZ || $attrs.sraArgsTimeZone;
                $scope.showTZ = sraDispatcher.getBoolean($scope.sraArgsSHOWTZ, $attrs.sraArgsSHOWTZ, $attrs.sraArgsShowTZ, $attrs.sraArgsShowTimeZone,$scope.showTZ);
                
                /** your code goes here **/
                $attrs.sraArgsData += ";Session/Time;Track/TimeZone";

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                /**watches go here **/
                $scope.$watch("data.Session.Time.Value",function(value,oldvalue) {
                    $scope.time = new Date(value*1000);
                    $scope.tzShort = $scope.data.Session.Time.State;
                });
                $scope.$watch("data.Track.TimeZone.Value",function(value,oldvalue) {
                    $scope.tz = value;
                });
            }
        };
    }]);

    return self;
});
