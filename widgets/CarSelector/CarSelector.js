'use strict';
/**
 * This widget shows a grid of cars that when clicked, makes that car the reference car.
 * This is a global setting and all open widgets will act as if that car is "ME".
 * <p>
 * Other Widgets and Apps can use this widget and override that behavior. 
 * For example, the RaceAdministrator App uses it to send the selected command.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-car-selector&gt;&lt;/sra-car-selector&gt;<br />
 * </b>
 * <img src="../widgets/CarSelector/icon.png" alt="Image goes here"/>
 * @ngdoc directive
 * @name sra-car-selector
 * @param {boolean} sra-click-persistent true will leave the car clicked highlighted. Defaults to false.
 * @param {boolean} sra-show-all true to show the "ALL" button. Defaults to false.
 * @param {boolean} sra-show-reference false to hide the current reference car. Defaults to true.
 * @param {boolean} sra-show-click-to-select false to hide the "Click To Select" label text. Defaults to true.
 * @param {boolean} sra-show-leader false to hide the Leader button. Defaults to true.
 * @param {boolean} sra-show-me false to hide the ME Button. Defaults to true.
 * @param {boolean} sra-show-buttons false to hide all buttons. Defaults to true,
 * @param {boolean} sra-show-ahead-behind true to show the Ahead and Behind buttons. Defaults to false.
 * @param {boolean} sra-show-reply true to show the REPLY button. Defaults to false.
 * @param {boolean} sra-change-camera Set to true to change the current camera to the selected car. Defaults to false.
 * @param {boolean} sra-change-focus Set to true to change what the current camera is focused on. Defaults to false.
 * @param {String} data-sra-args-on-click Optional name of a function in the parent's scope that will get called when clicked. Default is to make the car clicked the REFERENCE car.
 * @param {int} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2022 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/CarSelector/CarSelector','widgets/CarNumberExtended/CarNumberExtended'],
function(SIMRacingApps) {

    var self = {
        name:            "sraCarSelector",
        url:             'CarSelector',
        template:        'CarSelector.html',
        defaultWidth:    430,
        defaultHeight:   480,
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
            controller: [ '$scope', '$timeout', function($scope,$timeout) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                //load translations, if you have any comment out if you do not so it will not look for them
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });

                /** your code goes here **/
                $scope.clickDelay           = 2000;
                $scope.sraClickedPersistent = false;
                $scope.sraShowAll           = false;
                $scope.sraShowClickToSelect = true;
                $scope.sraShowReference     = true;
                $scope.sraShowLeader        = true;
                $scope.sraShowPaceCar       = true;
                $scope.sraShowMe            = true;
                $scope.sraShowButtons       = true;
                $scope.sraShowAheadBehind   = false;
                $scope.sraShowReply         = false;
                $scope.sraChangeCamera      = false;
                $scope.sraChangeFocus       = false;
                
                //This function will get called from the CarNumberExtended widget when it is clicked.
                $scope.carClicked = function($clickedScope,car) {
                    if (car) {
                        console.log("CarSelector.carClicked("+car+")");

                        //if an onclick function was passed in
                        if ($scope.sraOnClick) {
                            //now if the parent has defined a function to call when clicked
                            //then call it, else execute the setReferenceCar method
                            if (angular.isFunction($scope.$parent[$scope.sraOnClick]))
                                $scope.$parent[$scope.sraOnClick]($clickedScope,car);
                            
                        }
                        else {
                            $clickedScope.setClickedState('clicked');
                            if (car != "ALL" && car != "PACECAR")
                                sraDispatcher.sendCommand("Session/setReferenceCar/"+car);
                        }

                        if ($scope.sraChangeCamera) {
                            if (car != "ALL") {
                                sraDispatcher.sendCommand("Car/"+car+"/setCamera");
                            }
                        }
                        
                        if (!$scope.sraClickedPersistent) {
                            //delay a little, then clear the clicked state.
                            $timeout(function () {
                                $clickedScope.setClickedState('none');
                            }, $scope.clickDelay);
                        }
                    }
                };
                
                $scope.allClicked = function($clickedScope) {
                    $scope.carClicked($clickedScope,"ALL");
                };
                $scope.leaderClicked = function($clickedScope) {
                    $scope.carClicked($clickedScope,"LEADERCLASS");
                };
                $scope.meClicked = function($clickedScope) {
                    $scope.carClicked($clickedScope,"ME");
                };
                $scope.pacecarClicked = function($clickedScope) {
                    $scope.carClicked($clickedScope,"PACECAR");
                };
                $scope.aheadClicked = function($clickedScope) {
                    $scope.carClicked($clickedScope,"RL1");
                };
                $scope.behindClicked = function($clickedScope) {
                    $scope.carClicked($clickedScope,"RL-1");
                };
                $scope.replyClicked = function($clickedScope) {
                    $scope.carClicked($clickedScope,"REPLY");
                };
                
                $scope.focusClicked = function($clickedScope,focus) {
                    if (focus) {
                        console.log("CarSelector.focusClicked("+focus+")");
                        if ($scope.sraChangeFocus) {
                            sraDispatcher.sendCommand("Session/setCameraFocus/"+focus);
                            sraDispatcher.sendCommand("Session/setReferenceCar/"+focus);
                        }
                    }
                };
                
                $scope.focusOnLeaderClicked = function($clickedScope) {
                    $scope.focusClicked($clickedScope,"LEADER");
                };
                $scope.focusOnCrashesClicked = function($clickedScope) {
                    $scope.focusClicked($clickedScope,"CRASHES");
                };
                $scope.focusOnExcitingClicked = function($clickedScope) {
                    $scope.focusClicked($clickedScope,"EXCITING");
                };
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name]           = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                $scope.sraChangeFocus       = sraDispatcher.getBoolean($scope.sraArgsCHANGEFOCUS    , $attrs.sraArgsChangeFocus,      $scope.sraChangeFocus);
                
                //if focus is on, turn on the camera change option also
                if ($scope.sraChangeFocus) {
                    $scope.sraChangeCamera = 
                    $scope.sraShowReference = 
                    $scope.sraShowMe = true;
                    $scope.sraShowLeader = false;
                }
                
                $scope.sraShowReference     = sraDispatcher.getBoolean($scope.sraArgsSHOWREFERENCE,   $attrs.sraArgsShowReference,    $scope.sraShowReference);
                $scope.sraClickedPersistent = sraDispatcher.getBoolean($scope.sraArgsCLICKEDPERSISTENT,$attrs.sraArgsClickedPersistent,$scope.sraClickedPersistent);
                $scope.sraShowAll           = sraDispatcher.getBoolean($scope.sraArgsSHOWALL,         $attrs.sraArgsShowAll,          $scope.sraShowAll);
                $scope.sraShowClickToSelect = sraDispatcher.getBoolean($scope.sraArgsSHOWCLICKTOSELECT,$attrs.sraArgsShowClickToSelect,$scope.sraShowClickToSelect);
                $scope.sraShowLeader        = sraDispatcher.getBoolean($scope.sraArgsSHOWLEADER,      $attrs.sraArgsShowLeader,       $scope.sraShowLeader);
                $scope.sraShowPaceCar       = sraDispatcher.getBoolean($scope.sraArgsSHOWPACECAR,     $attrs.sraArgsShowPaceCar,      $scope.sraShowPaceCar);
                $scope.sraShowMe            = sraDispatcher.getBoolean($scope.sraArgsSHOWME,          $attrs.sraArgsShowMe,           $scope.sraShowMe);
                $scope.sraShowButtons       = sraDispatcher.getBoolean($scope.sraArgsSHOWBUTTONS,     $attrs.sraArgsShowButtons,      $scope.sraShowButtons);
                $scope.sraShowAheadBehind   = sraDispatcher.getBoolean($scope.sraArgsSHOWAHEADBEHIND, $attrs.sraArgsShowAheadBehind,  $scope.sraShowAheadBehind);
                $scope.sraShowReply         = sraDispatcher.getBoolean($scope.sraArgsSHOWREPLY      , $attrs.sraArgsShowReply,        $scope.sraShowReply);
                $scope.sraChangeCamera      = sraDispatcher.getBoolean($scope.sraArgsCHANGECAMERA   , $attrs.sraArgsChangeCamera,     $scope.sraChangeCamera);
                $scope.sraOnClick           = $attrs.sraArgsOnClick;

                /** your code goes here **/

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                /**watches go here **/
//                $scope.$watch("data.xxx.Value",function(value,oldvalue) {
//                });

            }
        };
    }]);

    return self;
});
