'use strict';

/**
 * The Race Administrator App is designed to make managing a race easier.
 * <p>
 * There are session commands that get issued as soon as you click them.
 * These commands are Advance Session, All Chat On, All Chat Off, Caution.
 * <p>
 * There are driver commands where you have to click the command to issue first,
 * (it will turn green), and then click each driver to apply the command to.
 * The driver command will stay active until you change it, except for the Remove command.
 * <p>
 * The last 5 commands sent will be shown at the bottom left of the screen.
 * 
 * <img src="../apps/RaceAdministrator/icon.png" />
 * 
 * NOTE: All parameters are specified in the URL.
 * @ngdoc apps
 * @name RaceAdministrator
 * @param {boolean} showFPS When any value is seen in the URL for this attribute, the Frames Per Second(FPS) will be shown. Defaults to not show.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2018 Jeffrey Gilliam
 * @license Apache License 2.0
 */
require(SIMRacingAppsRequireConfig,
        ['angular'
        ,'SIMRacingApps'
        ,'css!default'
        ,'widgets/CarSelector64/CarSelector64'
        ],
function( angular,  SIMRacingApps) {
    angular.element(document).ready(function() {

        //create any angular filters, values, constants, directives here on the SIMRacingApps.module

        //your application controller is added as a controller on the SIMRacingApps module
        SIMRacingApps.module.controller("SIMRacingApps-Controller",
               ['$scope','sraDispatcher','$timeout',
        function($scope,  sraDispatcher, $timeout) {
                   
            sraDispatcher.loadTranslations("/SIMRacingApps/apps/RaceAdministrator","text",function(path) {
                $scope.translations = sraDispatcher.getTranslation(path,"auto");
            });
            
            $scope.clickDelay = 2000;
            $scope.activeDriverButton     = "";
            $scope.currentCarCommand      = "";
            $scope.sentCommands           = [0,1,2,3,4];
            $scope.sentCommandsText       = ['&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;'];
            
            $scope.sendCommand = function(command) {
                sraDispatcher.sendCommand(command);
                $scope.sentCommandsText[0] = $scope.sentCommandsText[1];
                $scope.sentCommandsText[1] = $scope.sentCommandsText[2];
                $scope.sentCommandsText[2] = $scope.sentCommandsText[3];
                $scope.sentCommandsText[3] = $scope.sentCommandsText[4];
                $scope.sentCommandsText[4] = command;
                console.log(command);
            };
           
            $scope.cautionClicked = function($clickedScope) {
                $clickedScope.setClickedState('clicked');
                $scope.sendCommand("Session/setCautionFlag");
                
                //delay a little, then clear the clicked state.
                $timeout(function () {
                    $clickedScope.setClickedState('none');
                }, $scope.clickDelay);
            };
            
            $scope.chatOnClicked = function($clickedScope) {
                console.log("Chat On Clicked");
                $clickedScope.setClickedState('clicked');
                $scope.sendCommand("Session/setChatFlag/Y");
                
                //delay a little, then clear the clicked state.
                $timeout(function () {
                    $clickedScope.setClickedState('none');
                }, $scope.clickDelay);
            };

            $scope.chatOffClicked = function($clickedScope) {
                console.log("Chat Off Clicked");
                $clickedScope.setClickedState('clicked');
                $scope.sendCommand("Session/setChatFlag/N");
                
                //delay a little, then clear the clicked state.
                $timeout(function () {
                    $clickedScope.setClickedState('none');
                }, $scope.clickDelay);
            };
            
            $scope.advanceClicked = function($clickedScope) {
                console.log("Advance Clicked");
                $clickedScope.setClickedState('clicked');
                $scope.sendCommand("Session/setAdvanceFlag");
                
                //delay a little, then clear the clicked state.
                $timeout(function () {
                    $clickedScope.setClickedState('none');
                }, $scope.clickDelay);
            };

            $scope.DRIVERADMINON_Clicked = function($clickedScope) {
                $scope.activeDriverButton = "DRIVERADMINON";
                $scope.currentCarCommand  = "setAdminFlag/Y";
                console.log($scope.activeDriverButton+"_Clicked");
            };
            
            $scope.DRIVERADMINOFF_Clicked = function($clickedScope) {
                $scope.activeDriverButton = "DRIVERADMINOFF";
                $scope.currentCarCommand  = "setAdminFlag/N";
                console.log($scope.activeDriverButton+"_Clicked");
            };
            
            $scope.DRIVERCHATON_Clicked = function($clickedScope) {
                $scope.activeDriverButton = "DRIVERCHATON";
                $scope.currentCarCommand  = "setChatFlag/Y";
                console.log($scope.activeDriverButton+"_Clicked");
            };

            $scope.DRIVERCHATOFF_Clicked = function($clickedScope) {
                $scope.activeDriverButton = "DRIVERCHATOFF";
                $scope.currentCarCommand  = "setChatFlag/N";
                console.log($scope.activeDriverButton+"_Clicked");
            };

            $scope.DRIVERREMOVE_Clicked = function($clickedScope) {
                $scope.activeDriverButton = "DRIVERREMOVE";
                $scope.currentCarCommand  = "setRemoveFlag";
                console.log($scope.activeDriverButton+"_Clicked");
            };
            
            $scope.DRIVERWAVEAROUND_Clicked = function($clickedScope) {
                $scope.activeDriverButton = "DRIVERWAVEAROUND";
                $scope.currentCarCommand  = "setWaveAroundFlag";
                console.log($scope.activeDriverButton+"_Clicked");
            };
            
            $scope.DRIVERBLACK0_Clicked = function($clickedScope) {
                $scope.activeDriverButton = "DRIVERBLACK0";
                $scope.currentCarCommand  = "setBlackFlag/0";
                console.log($scope.activeDriverButton+"_Clicked");
            };
            
            $scope.DRIVERBLACK15_Clicked = function($clickedScope) {
                $scope.activeDriverButton = "DRIVERBLACK15";
                $scope.currentCarCommand  = "setBlackFlag/15";
                console.log($scope.activeDriverButton+"_Clicked");
            };
            
            $scope.DRIVERBLACKLAP_Clicked = function($clickedScope) {
                $scope.activeDriverButton = "DRIVERBLACKLAP";
                $scope.currentCarCommand  = "setBlackFlag/1/lap";
                console.log($scope.activeDriverButton+"_Clicked");
            };
            
            $scope.DRIVERDQ_Clicked = function($clickedScope) {
                $scope.activeDriverButton = "DRIVERDQ";
                $scope.currentCarCommand  = "setDisqualifyFlag";
                console.log($scope.activeDriverButton+"_Clicked");
            };
            
            $scope.DRIVEREOL_Clicked = function($clickedScope) {
                $scope.activeDriverButton = "DRIVEREOL";
                $scope.currentCarCommand  = "setEndOfLineFlag";
                console.log($scope.activeDriverButton+"_Clicked");
            };
            
            $scope.DRIVERCLEARALLPENALTIES_Clicked = function($clickedScope) {
                $scope.activeDriverButton = "DRIVERCLEARALLPENALTIES";
                $scope.currentCarCommand  = "setClearPenaltiesFlag";
                console.log($scope.activeDriverButton+"_Clicked");
            };
            
            
            $scope.carClicked = function($clickedScope,car) {
                if ($scope.currentCarCommand && car) {
                    console.log("RaceAdministrator.carClicked("+car+")");
                    $clickedScope.setClickedState('clicked');
                    $scope.sendCommand("Car/"+car+"/"+$scope.currentCarCommand);
                    
                    //This command is not reversable, so after it has been issued, remove it from the active button state.
                    if ($scope.activeDriverButton == "DRIVERREMOVE") {
                        $scope.activeDriverButton = "";
                        $scope.currentCarCommand  = "";
                    }
                    
                    //delay a little, then clear the clicked state.
                    $timeout(function () {
                        $clickedScope.setClickedState('none');
                    }, $scope.clickDelay);
                }
            };

            /**
            //TODO: Move this code to the server and add these to the settings
            var car = 'P10';        //Car to watch
            var delay = 0;          //amount to delay (milliseconds) before throwing the caution
            var laps = [45,90];     //laps throw caution on. Add as many as you want
            var interval = 100;     //polling frequency in milliseconds
            
            sraDispatcher.subscribe($scope,{
                sraArgsData: "Car/"+car+"/Lap/COMPLETED;Session/Type;Session/IsCautionFlag;Session/IsGreenFlag"
            },interval);
            $scope.$watch('data.Car.'+car+'.Lap.COMPLETED.Value', function() {
                if ($scope.data.Session.Type.Value == 'RACE' 
                && !$scope.data.Session.IsCautionFlag.Value
                && !$scope.data.Session.IsGreenFlag.Value   //if were under yellow and just going back green, do not throw another one
                ) {
                    for (var i=0; i < laps.length; i++) {
                        if ($scope.data.Car[car].Lap.COMPLETED.Value == laps[i]) {
                            $timeout(function () {
                                $scope.sendCommand("Session/setCautionFlag");
                            }, delay);
                        }
                    }
                }
            });
            /**/

        }]);

        //now start the process by passing in the element where the SIMRacingsApps class is defined.
        //all elements below that will be owned by SIMRacingApps. This should allow you to put other
        //content outside of this element that is not SIMRacingApps specific. All bundled apps will pass in the body.

        SIMRacingApps.start(angular.element(document.body),800,480,16);

        //once angular is booted, your controller will get called.
        //it is not recommended to have multiple controllers in SIMRacingApps because of how the $scope is transversed from child to parent.
        //You can have as many directives and other angular objects as you wish.
    });
});
