'use strict';
/**
 * This widget displays the starting point of a sector.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-track-map-sector data-sra-args-sector="1"&gt;&lt;/sra-track-map-sector&gt;<br />
 * </b>
 * @ngdoc directive
 * @name sra-track-map-sector
 * @param {value} data-sra-args-sector the sector number.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 300.
 * @author Jeffrey Gilliam
 * @since 19.0
 * @copyright Copyright (C) 2015 - 2023 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/TrackMap/Sector/Sector'],
function(SIMRacingApps) {

    var self = {
        name:            "sraTrackMapSector",
        url:             'TrackMap/Sector',
        template:        'Sector.html',
        defaultWidth:    480,
        defaultHeight:   480,
        defaultInterval: 300   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter','$rootScope', '$location',
    function(sraDispatcher,   $filter,  $rootScope,   $location) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;
            }]
            , link: function($scope,$element,$attrs) {
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                //copy arguments to our $scope
                $scope.sraSector         = 
                $scope[self.name]     = sraDispatcher.getTruthy($attrs.sraArgsSector, $attrs[self.name], $attrs.sraArgsValue, "");

            /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', function() {
                    sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight);
                });

                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
