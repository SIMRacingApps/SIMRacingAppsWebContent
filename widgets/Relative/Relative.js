'use strict';
/**
 * This widget displays the cars that are physically close to you on the track, (optionally by class by default, the REFERENCE car's class).
 * There are 2 times, how far behind the leader (of your class) and how far they are from you at your current speed.
 * The cars are color coded as Red(At least a lap ahead), Blue (At least a lap behind), White (Same lap as you), Cyan (Off track).
 * A blink counter is shown before the Club Name.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-relative&gt;&lt;/sra-relative&gt;<br />
 * </b>
 * <img src="../widgets/Relative/icon.png" />
 * @ngdoc directive
 * @name sra-relative
 * @param {boolean} data-sra-args-class-filter true, displays cars relative to your location. Default false.
 * @param {boolean} data-sra-args-by-location true, displays cars relative to your location. Default false.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2017 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/Relative/Relative','widgets/CarNumber/CarNumber'],
function(SIMRacingApps) {

    var self = {
        name:            'sraRelative',
        url:             'Relative',
        template:        'Relative.html',
        defaultWidth:    800,
        defaultHeight:   480,
        defaultInterval: 300, //initialize with the default interval
        module:          angular.module('SIMRacingApps') //get the main module
    };

    self.module.directive(self.name,
           ['sraDispatcher',
    function(sraDispatcher) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: ['$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                $scope.sraRelativeCar  = "REFERENCE";   //TODO: Need server support to have relative based on another car that's not the reference car, like the leader.
                $scope.classFilter     = false;
                $scope.referenceClass  = "";
                $scope.leader          = "LEADERCLASS";
                $scope.positions       = [];
                $scope.numPositions    = 9;     //behind and ahead and reference = (2 * numPostions) = 1
                
                //load translations
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });
            }]
            , link: function($scope,$element,$attrs) {
                $scope.sraArgsBYLOCATION = sraDispatcher.getBoolean($scope.sraArgsBYLOCATION, $attrs.sraArgsByLocation, false);
                //$scope.sraRelativeCar    = sraDispatcher.getTruthy($scope.sraArgsRELATIVECAR, $attrs.sraArgsRelativeCar, $scope.sraRelativeCar);
                $scope.classFilter       = sraDispatcher.getBoolean($scope.sraArgsCLASSFILTER, $attrs.sraArgsClassFilter, $scope.classFilter);
                $scope.numPositions      = sraDispatcher.getTruthy($scope.sraArgsNUMPOSITIONS, $attrs.sraArgsNumPositions, $scope.numPositions) * 1;
                self.defaultHeight       = sraDispatcher.getTruthy($scope.sraArgsDEFAULTHEIGHT, $attrs.sraArgsDefaultHeight, self.defaultHeight) * 1;
                
                $scope.leader = "LEADER" + ($scope.classFilter ? $scope.sraRelativeCar : "");
                
                $attrs.sraArgsData = "Session/Type"
                                   + ";Session/Laps"
                                   + ";Session/TimeRemaining"
                                   + ";Car/"+$scope.sraRelativeCar+"/Lap"
                                   + ";Car/"+$scope.sraRelativeCar+"/LapsToGo"
                                   + ";Car/"+$scope.sraRelativeCar+"/LapTime/SessionLast"
                                   + ";Session/NumberOfCarClasses";

                var addData = function(position) {
                    
                    $attrs.sraArgsData += ";Car/"+position+"/Id";
                    $attrs.sraArgsData += ";Car/"+position+"/ClassName";
                    $attrs.sraArgsData += ";Car/"+position+"/Position";
                    $attrs.sraArgsData += ";Car/"+position+"/PositionClass";
                    $attrs.sraArgsData += ";Car/"+position+"/ManufacturerLogo";
                    $attrs.sraArgsData += ";Car/"+position+"/ClassColor";
                    $attrs.sraArgsData += ";Car/"+position+"/DriverName";
                    $attrs.sraArgsData += ";Car/"+position+"/TeamName";
                    $attrs.sraArgsData += ";Car/"+position+"/DriverClubName";
                    $attrs.sraArgsData += ";Car/"+position+"/Discontinuality";
                    $attrs.sraArgsData += ";Car/"+position+"/IsBelowMinimumSpeed";
                    $attrs.sraArgsData += ";Car/"+position+"/StatusClass";
                    $attrs.sraArgsData += ";Car/"+position+"/IsEqual/TRANSMITTING"
                    $attrs.sraArgsData += ";Car/"+position+"/IsEqual/"+$scope.sraRelativeCar;
                    $attrs.sraArgsData += ";Session/DiffCars/"+$scope.leader+"/"+position;
                    $attrs.sraArgsData += ";Session/DiffCarsRelative/"+$scope.sraRelativeCar+"/"+position;

                    //if the id changes, need to update the positions list
                    $scope.$watch("data.Car['"+position+"'].Id.Value", $scope.update);
                    $scope.positions.push(position);
                };
                
                //now need to watch all possible cars ahead and behind since we are going to do the filter by class in the watches.
                var position = $scope.classFilter
                             ? ($scope.sraArgsBYLOCATION ? "RLC" : "RC")
                             : ($scope.sraArgsBYLOCATION ? "RL" : "R");
                             
                for (var i=(($scope.numPositions-1)/2); i > 0; i--) {
                    addData(position +  i);
                }
                
                addData($scope.sraRelativeCar);
                
                for (var i=1; i <= (($scope.numPositions-1)/2); i++) {
                    addData(position +  -i);
                }

                $scope.$watch("data.Session.NumberOfCarClasses.Value", function(value) {
                    if (value === "0" || value === "1")
                        $scope.classFilter = false;
                });
                
                $scope.$watch("data.Car['"+$scope.sraRelativeCar+"'].ClassName.Value", function(className) {
                    $scope.referenceClass  = $scope.classFilter ? className : "";
                });
                
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
