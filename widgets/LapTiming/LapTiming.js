'use strict';
/**
 * This widget displays information about your lap times, position, who is ahead and behind, laps to go.
 * It simulates iRacing's F1 screen.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-lap-timing&gt;&lt;/sra-lap-timing&gt;<br />
 * </b>
 * <img src="../widgets/LapTiming/icon.png" />
 * @ngdoc directive
 * @name sra-lap-timing
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 100.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2022 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/LapTiming/LapTiming','widgets/CarNumber/CarNumber'],
function(SIMRacingApps) {

    var self = {
        name:            'sraLapTiming',
        url:             'LapTiming',
        template:        'LapTiming.html',
        defaultWidth:    800,
        defaultHeight:   480,
        defaultInterval: 100, //initialize with the default interval
        module:          angular.module('SIMRacingApps') //get the main module
    };

    self.module.directive(self.name,
           ['sraDispatcher','$rootScope',
    function(sraDispatcher,  $rootScope) {
        return {
            restrict: 'EA',
            scope: {
                sraInterval: '@'
            },
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: ['$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                //load translations
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });
                
                $scope.format = 'mediumTime';
                $scope.tz = '';
                $scope.time = 0;
                $scope.showSIMTime = true;
                
            }]
            , link: function($scope,$element,$attrs) {

                $scope.showSIMTime = sraDispatcher.getBoolean($attrs.sraArgsSHOWSIMTIME, $scope.sraArgsShowSIMTime, $scope.showSIMTime);

                /** your code goes here **/
                $attrs.sraArgsData = "Session/Time";
                
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
                
                $scope.$watch("data.Session.Time.Value",function(value,oldvalue) {
                    $scope.time = new Date();
                    $scope.time.setTime((value*1000));
                    $scope.tz = $scope.data.Session.Time.State;
                });
            }
        };
    }]);

    return self;
});
