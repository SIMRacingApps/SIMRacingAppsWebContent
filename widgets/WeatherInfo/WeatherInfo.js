'use strict';
/**
 * This widget displays the weather information.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-weather-info&gt;&lt;/sra-weather-info&gt;<br />
 * </b>
 * <img src="../widgets/WeatherInfo/icon.png" atl="Image goes here"/>
 * @ngdoc directive
 * @name sra-weather-info
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2022 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/WeatherInfo/WeatherInfo','widgets/DataTable/DataTable'],
function(SIMRacingApps) {

    var self = {
        name:            "sraWeatherInfo",
        url:             'WeatherInfo',
        template:        'WeatherInfo.html',
        defaultWidth:    800,
        defaultHeight:   130,
        defaultInterval: 1000   //initialize with the default interval
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

                //load translations
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });
                /** your code goes here **/

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
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
