'use strict';
/**
 * This widget displays information about the driver currently in the car.
 * <p>
 * Example(s):
 * <p><b>
 * &lt;sra-driver-info data-sra-args-car="ME"&gt;&lt;/sra-driver-info&gt;<br />
 * &lt;div data-sra-driver-info="ME"&gt;&lt;/div&gt;
 * </b>
 * <img src="../widgets/DriverInfo/icon.png" />
 * @ngdoc directive
 * @name sra-driver-info
 * @param {carIdentifier} data-sra-args-car The <a href="../JavaDoc/com/SIMRacingApps/Session.html#getCar-java.lang.String-" target="_blank">Car Identifier</a> to get the number from.
 * @param {string} data-sra-args-title The title to show in the header. Defaults to Car or Radio Channel if car is TRANSMITTING. Can be overridden in the URL as &TITLE=something.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 50.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2024 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps'
       ,'css!widgets/DriverInfo/DriverInfo'
       ,'widgets/DataTable/DataTable'
       ,'widgets/CarNumber/CarNumber'],
function(SIMRacingApps) {

    var self = {
        name:            "sraDriverInfo",
        url:             'DriverInfo',
        template:        'DriverInfo.html',
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
                
                $scope.sraInterval = $scope.defaultInterval;

                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);

                    //translate title if we have it.
                    if ($scope.sraTitle)
                        if ($scope.translations[$scope.sraTitle.toUpperCase()])
                            $scope.sraTitle = $scope.translations[$scope.sraTitle.toUpperCase()];
                });
                /** your code goes here **/

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsCAR, $attrs.sraArgsCar, $scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "REFERENCE");

//The new default for all numeric is to lookup the car number, so this will not work anymore
//                //if all numeric, then add a hash in front for car number lookup
//                if ($scope.value.match(/^[0-9]/) && $scope.value.match(/[0-9]$/))
//                    $scope.value = $scope[self.name] = '#' + $scope.value;

                /** your code goes here **/
                $scope.sraTitle =  $scope.sraArgsTITLE || $attrs.sraArgsTitle || $attrs.sraTitle;

                if (!$scope.sraTitle && $attrs.sraBindTitle) {
                    $scope.$parent.$watch($attrs.sraBindTitle,function(value) {
                        $scope.sraTitle = value;
                    });
                }
                else
                if ($scope.value == "TRANSMITTING" && !$scope.sraTitle) {
                    $scope.$watch("data.Car.TRANSMITTING.RadioChannelName.ValueFormatted",function(newValue) {
                        $scope.sraTitle = '@'+newValue;
                    });
                }
                else
                if (!$scope.sraTitle)
                    $scope.sraTitle = $scope.value;

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));
                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
