'use strict';
/**
 * This widget displays the gear for the requested car identifier.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-gear data-sra-args-car="REFERENCE"&gt;&lt;/sra-gear&gt;<br />
 * </b>
 * <img src="../widgets/Gear/icon.png" />
 * @ngdoc directive
 * @name sra-gear
 * @param {carIdentifier} data-sra-args-car The <a href="../JavaDoc/com/SIMRacingApps/Session.html#getCar-java.lang.String-" target="_blank">Car Identifier</a> to get the number from. Defaults to REFERENCE.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 100.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2021 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/Gear/Gear'],
function(SIMRacingApps) {

    var self = {
        name:            "sraGear",
        url:             'Gear',
        template:        'Gear.html',
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
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsCAR,$attrs.sraArgsCar,$scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "REFERENCE");

                /** your code goes here **/
                $attrs.sraArgsData += ";Car/"+$scope.value+"/Gauge/Gear/ValueCurrent";


                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
