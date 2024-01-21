'use strict';
/**
 * This widget displays who is currently transmitting on the radio.
 * <p>
 * <b>Note:</b>  iRacing does not show yourself transmitting currently. 
 * <p>
 * Example(s):
 * <p><b>
 * &lt;sra-radio-transmitting&gt;&lt;/sra-radio-transmitting&gt;<br />
 * </b>
 * <img src="../widgets/RadioTransmitting/icon.png" />
 * @ngdoc directive
 * @name sra-radio-transmitting
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Ricky Thompson
 * @since 1.6
 * @copyright Copyright (C) 2015 - 2024 Jeffrey Gilliam, Ricky Thompson
 * @license Apache License 2.0
 */
define(['SIMRacingApps'
       ,'css!widgets/RadioTransmitting/RadioTransmitting'
       ,'widgets/DataTable/DataTable'
       ,'widgets/CarNumber/CarNumber'],
function(SIMRacingApps) {

    var self = {
        name:            "sraRadioTransmitting",
        url:             'RadioTransmitting',
        template:        'RadioTransmitting.html',
        defaultWidth:    800,
        defaultHeight:   50,
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
                
                $scope.sraInterval = $scope.defaultInterval;

//                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
//                    $scope.translations = sraDispatcher.getTranslation(path);
//                });
                /** your code goes here **/

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsCAR, $attrs.sraArgsCar, $scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "TRANSMITTING");

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
