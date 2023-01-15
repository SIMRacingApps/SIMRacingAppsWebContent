'use strict';
/**
 * This widget displays the projected lap time based on a relative point in time.
 * If Green, then you are faster than the relative point, Red if not.
 * It also shows in different shades of Red and Green a projection of how you are doing to the relative point. 
 * Clicking on the widget, will rotate between the available relative points. 
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-timing-delta&gt;&lt;/sra-timing-delta&gt;<br />
 * </b>
 * <img src="../widgets/TimingDelta/icon.png" atl="Image goes here"/>
 * @ngdoc directive
 * @name sra-timing-delta
 * @param {String} data-sra-args-value Basis for the relative delta calculation. Defaults to SESSIONBEST. 
 *                 Must be one of the following: SESSIONBEST, SESSIONOPTIMAL, SESSIONLAST, BEST, OPTIMAL.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 16.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2023 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/TimingDelta/TimingDelta'],
function(SIMRacingApps) {

    var self = {
        name:            "sraTimingDelta",
        url:             'TimingDelta',
        template:        'TimingDelta.html',
        defaultWidth:    800,
        defaultHeight:   480,
        defaultInterval: 16   //initialize with the default interval
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
                $scope.visibility      = "hidden";

                //load translations, if you have any un-comment this
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });

                /** your code goes here **/
                $scope.update = function() {
                    var sessionBest      = $scope.data.Car.REFERENCE.LapTimeDeltaReference.SESSIONBEST.Value;
                    var sessionBestDelta = $scope.data.Car.REFERENCE.LapTimeDelta.SESSIONBEST.Value;
                    var delta            = $scope.data.Car.REFERENCE.LapTimeDelta[$scope.value].Value;
                    var percent          = $scope.data.Car.REFERENCE.LapTimeDeltaPercent[$scope.value].Value;
                    var reference        = $scope.data.Car.REFERENCE.LapTimeDeltaReference[$scope.value].Value;
                    var category         = $scope.data.Track.Category.Value;

                    $scope.visibility = $scope.data.Car.REFERENCE.LapTimeDelta[$scope.value].State == 'NORMAL' 
                                      ? 'inherit'
                                      : 'hidden'; 

                    //position the bar, adjust the width and set it's color
                    var w,l;
                    var color = 'white';
                    var deltacolor = 'white';

                    //iRacing only shows a smaller bar if the time is within +/- .5 second
                    //so if not, setup for maximum bar
                    //TODO: There are entries in the app.ini for the range. Should I read them?
                    //      [SplitsDeltas]
                    //      deltaBarRangeOval=0.5
                    //      deltaBarRangeRoad=2.0

                    var range = category == "Oval" ? .5 : 2.0;

                    if (delta < (range * -1)) {
                        l = 50;
                        w = 50;
                        color = 'chartreuse';
                    }
                    else
                    if (delta > range) {
                        l = 0;
                        w = 50;
                        color = 'red';
                    }
                    else {
                        w = (Math.abs(delta) / range) * 50;
                        if (delta < 0) {
                            color = 'chartreuse';
                            l = 50;
                        }
                        else
                        if (delta > 0) {
                            color = 'red';
                            l = 50 - w;
                        }
                        else {
                            color = 'white';
                            l = 50;
                        }
                    }

                    var invpct = (100.0 - Math.abs(percent)) / 100.0;

                    // -1 to 0 to 1 = green(-1) to white(0), to red(1)

                    if (percent >= -100 && percent < 0) {
                        deltacolor = (Math.round(255 * invpct) << 16) + 0xFF00 + Math.round(255 * invpct);
                    }
                    else
                    if (percent > 0 && percent <= 100) {
                        deltacolor = 0xFF0000 + (Math.round(255 * invpct) << 8) + Math.round(255 * invpct);
                    }
                    else {
                        deltacolor = 0xFFFFFF; /* white */
                    }

                    if ($scope.data.Car.REFERENCE.Lap.CompletedPercent.Value < 15) {
                        $scope.fontWeight = 'bold';
                        //don't update the times to hold them steady for a little while
                    }
                    else {
                        $scope.barWidth      = w;
                        $scope.barLeft       = l;
                        $scope.barDeltaColor = deltacolor;
                        $scope.fontColor     = color;

                        $scope.fontWeight = 'normal';
                        //$scope.projected  = reference + delta;
                        $scope.projected  = sessionBest + sessionBestDelta;
                        $scope.delta      = delta;
                    }

                };

                $scope.updateProjected = function() {
                    if ($scope.data.Car.REFERENCE.Lap.CompletedPercent.Value < 15) {
                        $scope.projected = $scope.data.Car.REFERENCE.LapTime.SESSIONLAST.Value;
                    }
                };
                
                $scope.values = ['SESSIONBEST','SESSIONOPTIMAL','SESSIONLAST','BEST','OPTIMAL'];

                $scope.onClick = function(event) {
                    for (var i=0; $scope.value && i < $scope.values.length; i++) {
                        if ($scope.values[i] == $scope.value.toUpperCase()) {
                            $scope.value = $scope.values[ ++i % $scope.values.length ];
                            console.log("TimingDelta = "+$scope.value);
                            return;
                        }
                    }
                };
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "SessionBest").toUpperCase();

                /** your code goes here **/
                for (var i=0; i < $scope.values.length; i++) {
                    $attrs.sraArgsData += ";Car/REFERENCE/LapTimeDelta/"+$scope.values[i];
                    $attrs.sraArgsData += ";Car/REFERENCE/LapTimeDeltaPercent/"+$scope.values[i];
                    $attrs.sraArgsData += ";Car/REFERENCE/LapTimeDeltaReference/"+$scope.values[i];
                    $attrs.sraArgsData += ";Car/REFERENCE/LapTime/SESSIONLAST";
                }

                $attrs.sraArgsData += ";Car/REFERENCE/Lap/CompletedPercent";
                $attrs.sraArgsData += ";Track/Category";

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                //let session best drive all the updates
                $scope.$watch("data.Car.REFERENCE.LapTimeDelta.SESSIONBEST.Value",$scope.update);
                $scope.$watch("data.Car.REFERENCE.LapTime.SESSIONLAST.Value",$scope.updateProjected);

                sraDispatcher.onClick($scope,$element,$scope.onClick);

            }
        };
    }]);

    return self;
});
