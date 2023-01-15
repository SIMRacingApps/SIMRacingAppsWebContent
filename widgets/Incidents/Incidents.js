'use strict';
/**
 * This widget displays your incident counts. 
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-incidents&gt;&lt;/sra-incidents&gt;<br />
 * </b>
 * <img src="../widgets/Incidents/icon.png" alt="Image goes here"/>
 * @ngdoc directive
 * @name sra-incidents
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.13
 * @copyright Copyright (C) 2015 - 2023 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/Incidents/Incidents'],
function(SIMRacingApps) {

    var self = {
        name:            "sraIncidents",
        url:             'Incidents',
        template:        'Incidents.html',
        defaultWidth:    800,
        defaultHeight:   280,
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

                //load translations, if you have any comment out if you do not so it will not look for them
//                $scope.translations = {};
//                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
//                    $scope.translations = sraDispatcher.getTranslation(path);
//                });

                /** your code goes here **/

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");

                /** your code goes here **/
                $attrs.sraArgsData += ";Session/IncidentLimit;Car/REFERENCE/Incidents;Car/REFERENCE/IncidentsTeam";

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                /**watches go here **/
                $scope.$watch("data.Car.REFERENCE.Incidents.Value",function(value,oldvalue) {
                    if ($scope.data.Car.REFERENCE.IncidentsTeam.State == 'NORMAL')
                        $scope.incidents = $scope.data.Car.REFERENCE.Incidents.Value + '/' + $scope.data.Car.REFERENCE.IncidentsTeam.Value + '/' + $scope.data.Session.IncidentLimit.Value + $scope.data.Session.IncidentLimit.UOMDesc;
                    else
                        $scope.incidents = $scope.data.Car.REFERENCE.Incidents.Value + '/' + $scope.data.Session.IncidentLimit.Value + $scope.data.Session.IncidentLimit.UOMDesc;
//$scope.incidents = '99/99/9999x';
                });
                $scope.$watch("data.Session.IncidentLimit.Value",function(value,oldvalue) {
                    if ($scope.data.Car.REFERENCE.IncidentsTeam.State == 'NORMAL')
                        $scope.incidents = $scope.data.Car.REFERENCE.Incidents.Value + '/' + $scope.data.Car.REFERENCE.IncidentsTeam.Value + '/' + $scope.data.Session.IncidentLimit.Value + $scope.data.Session.IncidentLimit.UOMDesc;
                    else
                        $scope.incidents = $scope.data.Car.REFERENCE.Incidents.Value + '/' + $scope.data.Session.IncidentLimit.Value + $scope.data.Session.IncidentLimit.UOMDesc;
//$scope.incidents = '99/99/9999x';
                });

            }
        };
    }]);

    return self;
});
