'use strict';
/**
 * This widget displays the car controls, the gear, clutch, brake, throttle, steering wheel, and speed.
 * It uses these widgets: {@link sra-gear Gear}, {@link sra-pedals Pedals}, and {@link sra-steering-wheel SteeringWheel}.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-car-controls&gt;&lt;/sra-car-controls&gt;
 * </b>
 * <img src="../widgets/CarControls/icon.png" />
 * @ngdoc directive
 * @name sra-car-controls
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 100.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2020 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps'
       ,'css!widgets/CarControls/CarControls'
       ,'widgets/Gear/Gear'
       ,'widgets/Pedals/Pedals'
       ,'widgets/SteeringWheel/SteeringWheel'],
function(SIMRacingApps) {

    var self = {
        name:            "sraCarControls",
        url:             'CarControls',
        template:        'CarControls.html',
        defaultWidth:    800,
        defaultHeight:   350,
        defaultInterval: 100   //initialize with the default interval
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
//                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
//                    $scope.translations = sraDispatcher.getTranslation(path);
//                });
                /** your code goes here **/

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
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
