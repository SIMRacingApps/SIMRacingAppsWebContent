'use strict';
/**
 * This widget displays a virtual image of the steering wheel.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-steering-wheel&gt;&lt;/sra-steering-wheel&gt;<br />
 * </b>
 * <img src="../widgets/SteeringWheel/icon.png" />
 * @ngdoc directive
 * @name sra-steering-wheel
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2024 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/SteeringWheel/SteeringWheel'],
function(SIMRacingApps) {

    var self = {
        name:            "sraSteeringWheel",
        url:             'SteeringWheel',
        template:        'SteeringWheel.html',
        defaultWidth:    480,
        defaultHeight:   480,
        defaultInterval: 100   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$rootScope',
    function(sraDispatcher,   $filter,   $rootScope) {
        return {
            restrict:    'EA',
            $scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                //load translations, if you have any un-comment this
//                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
//                    $$scope.translations = sraDispatcher.getTranslation(path);
//                });
                /** your code goes here **/

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");

                /** your code goes here **/

                /* These 2 functions were found at:
                 * http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
                 */
                function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
                    var angleInRadians = (angleInDegrees) * Math.PI / 180.0;

                    return {
                      x: centerX + (radius * Math.cos(angleInRadians)),
                      y: centerY + (radius * Math.sin(angleInRadians))
                    };
                }

                function describeArc(x, y, radius, startAngle, endAngle){

                      var start = polarToCartesian(x, y, radius, endAngle);
                      var end = polarToCartesian(x, y, radius, startAngle);

                      var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

                      var d = [
                          "M", start.x, start.y,
                          "A", radius, radius, 0, arcSweep, 0, end.x, end.y
                      ].join(" ");

                      return d;
                }

                $scope.tapepath = describeArc(240,240,210,265,275);

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));
                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
