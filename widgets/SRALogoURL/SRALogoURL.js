'use strict';
/**
 * This widget displays the SIMRacingApps Logo with the URL.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-s-r-a-logo-u-r-l&gt;&lt;/sra-s-r-a-logo-u-r-l&gt;<br />
 * </b>
 * <img src="../widgets/SRALogoURL/icon.png" />
 * @ngdoc directive
 * @name sra-s-r-a-logo-u-r-l
 * @param {string} data-sra-args-value The name of the logo file. Must have a 4x1 aspect ratio and placed in the HTML root (i.e. Documents/SIMRacingApps).
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Jeffrey Gilliam
 * @since 1.7
 * @copyright Copyright (C) 2015 - 2018 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/SRALogoURL/SRALogoURL'
],function(SIMRacingApps) {

    var self = {
        name:            "sraSRALogoURL",
        url:             'SRALogoURL',
        template:        'SRALogoURL.html',
        defaultWidth:    869,
        defaultHeight:   217,
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
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "SRA-Logo-with-URL-semi-transparent.png");

                /** your code goes here **/
                
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
