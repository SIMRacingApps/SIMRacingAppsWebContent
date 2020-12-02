'use strict';
/**
 * This widget displays the temps and wears of a tire after it has been changed.
 * It will also be shaded with Red, Yellow, Black to show hottest to coldest relative to left, middle, right side of the tire.
 * It also displays the number of laps that were run on it as well as the lap when it was changed.   
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-tire-measurements data-sra-args-tire='LF'&gt;&lt;/sra-tire-measurements&gt;<br />
 * </b>
 * <img src="../widgets/TireMeasurements/icon.png" />
 * @ngdoc directive
 * @name sra-tire-measurements
 * @param {string}  data-sra-args-tire One of LF,RF,LR,RR (Left Front, Right Front, Left Read, Right Rear). Defaults to RF.
 * @param {boolean} data-sra-args-s-i-m-controller If true, then this widget can send changes to the SIM. Defaults to false. 
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2020 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/TireMeasurements/TireMeasurements'],
function(SIMRacingApps) {

    var self = {
        name:            "sraTireMeasurements",
        url:             'TireMeasurements',
        template:        'TireMeasurements.html',
        defaultWidth:    800,
        defaultHeight:   380,
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

                //load translations, if you have any un-comment this
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                   $scope.translations = sraDispatcher.getTranslation(path);
                });

                $scope.Lcolor = 'rgba(0,0,0,.5)';
                $scope.Mcolor = 'rgba(0,0,0,.5)';
                $scope.Rcolor = 'rgba(0,0,0,.5)';

                /** your code goes here **/
                $scope.updateBackground = function() {
                    var L = $scope.data.Car.REFERENCE.Gauge['TireTemp'+$scope.value+'L'].ValueHistorical;
                    var M = $scope.data.Car.REFERENCE.Gauge['TireTemp'+$scope.value+'M'].ValueHistorical;
                    var R = $scope.data.Car.REFERENCE.Gauge['TireTemp'+$scope.value+'R'].ValueHistorical;
//L.Value = 215.0;
//M.Value = 200.0;
//R.Value = 225.0;
                    var lowest  = Math.min(Math.round(L.Value),Math.round(M.Value),Math.round(R.Value));
                    var highest = Math.max(Math.round(L.Value),Math.round(M.Value),Math.round(R.Value));

                    var lowColor    = "rgba(0,0,0,.5)";      //black
                    var middleColor = "rgba(255,255,0,.5)";  //yellow
                    var highColor   = "rgba(255,0,0,.5)";    //red

                    $scope.Lcolor = (Math.round(L.Value) == lowest ? lowColor : (Math.round(L.Value) == highest ? highColor : middleColor));
                    $scope.Mcolor = (Math.round(M.Value) == lowest ? lowColor : (Math.round(M.Value) == highest ? highColor : middleColor));
                    $scope.Rcolor = (Math.round(R.Value) == lowest ? lowColor : (Math.round(R.Value) == highest ? highColor : middleColor));
                };
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsTIRE, $attrs.sraArgsTire, $scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "RF");

                /** your code goes here **/
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TireTemp"+$scope.value+"L/ValueHistorical";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TireTemp"+$scope.value+"M/ValueHistorical";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TireTemp"+$scope.value+"R/ValueHistorical";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TireWear"+$scope.value+"L/ValueHistorical";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TireWear"+$scope.value+"M/ValueHistorical";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TireWear"+$scope.value+"R/ValueHistorical";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressure"+$scope.value+"/ValueHistorical";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressure"+$scope.value+"/LapsHistorical";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressure"+$scope.value+"/LapChanged";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressure"+$scope.value+"/Count";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TirePressure"+$scope.value+"/MaxCount";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/TireCompound"+"/ValueHistorical";

                $scope.$watch("data.Car.REFERENCE.Gauge['TireTemp"+$scope.value+"L'].ValueHistorical",$scope.updateBackground,true);
                $scope.$watch("data.Car.REFERENCE.Gauge['TireTemp"+$scope.value+"M'].ValueHistorical",$scope.updateBackground,true);
                $scope.$watch("data.Car.REFERENCE.Gauge['TireTemp"+$scope.value+"R'].ValueHistorical",$scope.updateBackground,true);

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
