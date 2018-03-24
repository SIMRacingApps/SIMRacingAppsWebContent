'use strict';
/**
 * This widget displays the SIMRacingApps Logo.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-s-r-a-logo&gt;&lt;/sra-s-r-a-logo&gt;<br />
 * </b>
 * <img src="../widgets/SRALogo/icon.png" />
 * @ngdoc directive
 * @name sra-s-r-a-logo
 * @param {string} data-sra-args-value The name of the logo file. Must have a 1x1 aspect ratio and placed in the HTML root (i.e. Documents/SIMRacingApps).
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Jeffrey Gilliam
 * @since 1.7
 * @copyright Copyright (C) 2015 - 2018 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/SRALogo/SRALogo'
],function(SIMRacingApps) {

    var self = {
        name:            "sraSRALogo",
        url:             'SRALogo',
        template:        'SRALogo.html',
        defaultWidth:    205,
        defaultHeight:   205,
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
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "SRA-Logo.png");

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
