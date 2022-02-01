'use strict';
/**
 * This widget displays the car image if the SIM provides one.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-car-image&gt;&lt;/sra-car-image&gt;<br />
 * </b>
 * <img src="../widgets/CarImage/icon.png" />
 * @ngdoc directive
 * @name sra-car-image
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2022 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/CarImage/CarImage'
],function(SIMRacingApps) {

    var self = {
        name:            "sraCarImage",
        url:             'CarImage',
        template:        'CarImage.html',
        defaultWidth:    800,
        defaultHeight:   480,
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
//                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
//                    $scope.translations = sraDispatcher.getTranslation(path);
//                });

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "REFERENCE");
                console.log("CarImage="+$scope.value);
                /** your code goes here **/
                $attrs.sraArgsData += ";Car/"+$scope.value+"/ImageUrl";
                
                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                /** watches go here **/
            }
        };
    }]);

    return self;
});
