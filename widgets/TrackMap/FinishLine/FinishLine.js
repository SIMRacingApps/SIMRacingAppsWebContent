'use strict';
/**
 * This widget displays a start/finish line image.
 * It displays it initially as a horizontal image where the center is positioned so that it can be rotated to a specific X/Y coordinate.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-track-map-finish-line&gt;&lt;/sra-track-map-finish-line&gt;<br />
 * </b>
 * <img src="../widgets/TrackMap/FinishLine/icon.png" atl="Image goes here"/>
 * @ngdoc directive
 * @name sra-track-map-finish-line
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2016 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/TrackMap/FinishLine/FinishLine'],
function(SIMRacingApps) {

    var self = {
        name:            "sraTrackMapFinishLine",
        url:             'TrackMap/FinishLine',
        template:        'FinishLine.html',
        defaultWidth:    800,
        defaultHeight:   480,
        defaultInterval: 500   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$rootScope',
    function(sraDispatcher,   $filter, $rootScope) {
        return {
            restrict:    'EA',
            scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope
                $attrs.sraArgsData  = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");

                //register with the dispatcher
                $rootScope.$on('sraResize', function() {
                    sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight);
                });
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
