'use strict';
/**
 * This widget displays your driver rating based on how the SIM ranks you. 
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-driver-rating&gt;&lt;/sra-driver-rating&gt;<br />
 * </b>
 * <img src="../widgets/DriverRating/icon.png" alt="Image goes here"/>
 * @ngdoc directive
 * @name sra-driver-rating
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.13
 * @copyright Copyright (C) 2015 - 2022 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/DriverRating/DriverRating'],
function(SIMRacingApps) {

    var self = {
        name:            "sraDriverRating",
        url:             'DriverRating',
        template:        'DriverRating.html',
        defaultWidth:    800,
        defaultHeight:   180,
        defaultInterval: 500   //initialize with the default interval
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

                //load translations, if you have any comment out if you do not so it will not look for them
//                $scope.translations = {};
//                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
//                    $scope.translations = sraDispatcher.getTranslation(path);
//                });

                /** your code goes here **/

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");

                /** your code goes here **/
                $attrs.sraArgsData += ";Car/REFERENCE/DriverRating";

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                /**watches go here **/
                $scope.$watch("data.Car.REFERENCE.DriverRating.ValueFormatted",function(value,oldvalue) {
                    $scope.driverrating = value;
//$scope.driverrating = '12045(+99)A3.53';                    
                });
            }
        };
    }]);

    return self;
});
