'use strict';
/**
 * This widget displays the time.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-time&gt;&lt;/sra-time&gt;<br />
 * </b>
 * <img src="../widgets/Time/icon.png" alt="Image goes here"/>
 * @ngdoc directive
 * @name sra-time
 * @param {string} data-sra-args-format A string to use as the date format. Defaults to "mediumTime" as defined by AngularJS.date filter at {@link https://docs.angularjs.org/api/ng/filter/date}.
 * @param {string} data-sra-args-timezone The time zone to display the time in. Defaults to the browser's time zone.  
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2022 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/Time/Time'],
function(SIMRacingApps) {

    var self = {
        name:            "sraTime",
        url:             'Time',
        template:        'Time.html',
        defaultWidth:    800,
        defaultHeight:   130,
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

                $scope.format = 'mediumTime';
                $scope.tz     = '';
                $scope.showTZ = false;
                
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
                $scope.format = $scope.sraArgsFORMAT || $attrs.sraArgsFormat || $scope.format;
                $scope.tz     = $scope.sraArgsTZ || $scope.sraArgsTIMEZONE || $attrs.sraArgsTZ || $attrs.sraArgsTimeZone;
                $scope.showTZ = sraDispatcher.getBoolean($scope.sraArgsSHOWTZ, $scope.sraArgsSHOWTIMEZONE, $attrs.sraArgsShowTZ, $attrs.sraArgsShowTimeZone,$scope.showTZ);
                
                /** your code goes here **/
//                $attrs.sraArgsData += ";Car/REFERENCE/Description";

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                /**watches go here **/
//                $scope.$watch("data.xxx.Value",function(value,oldvalue) {
//                });

            }
        };
    }]);

    return self;
});
