'use strict';
/**
 * This widget displays a blue circl at the merge point.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-track-map-merge-point&gt;&lt;/sra-track-map-merge-point&gt;<br />
 * </b>
 * <img src="../widgets/TrackMap/MergePoint/icon.png" atl="Image goes here"/>
 * @ngdoc directive
 * @name sra-track-map-merge-point
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000
 * @author Jeffrey Gilliam
 * @since 1.12
 * @copyright Copyright (C) 2015 - 2021 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/TrackMap/MergePoint/MergePoint'],
function(SIMRacingApps) {

    var self = {
        name:            "sraTrackMapMergePoint",
        url:             'TrackMap/MergePoint',
        template:        'MergePoint.html',
        defaultWidth:    480,
        defaultHeight:   480,
        defaultInterval: 1000   //initialize with the default interval
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
