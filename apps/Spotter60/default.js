'use strict';
/**
 * This is the Spotter, Broadcaster App for 60 cars.
 * With this App you can see what's going on from a none driver's point of view.
 * You can change the Camera angle, the car to focus on and control the replay postion.
 *
 * Note that when the reference car is not you, SIMs do not always transmit the same amount of data for other cars.
 * For example, one common complaint is iRacing does let you see the fuel or tire measurements of other cars.
 * 
 * <img src="../apps/Spotter60/icon.png" />
 * 
 * @ngdoc apps
 * @name Spotter60
 * @param {boolean} showFPS When any value is seen in the URL for this attribute, the Frames Per Second(FPS) will be shown. Defaults to not show.
 * @author Jeffrey Gilliam
 * @since 1.3
 * @copyright Copyright (C) 2015 - 2018 Jeffrey Gilliam
 * @license Apache License 2.0
 */
require(SIMRacingAppsRequireConfig,
        ['angular'
        ,'SIMRacingApps'
        ,'css!default'
        ,'widgets/DriverInfo/DriverInfo'
        ,'widgets/CameraSelector/CameraSelector'
        ,'widgets/CarSelector/CarSelector'
        ,'widgets/TrackMap/TrackMap'
        ,'widgets/StandingsTop60/StandingsTop60'
        ,'widgets/Relative/Relative'
        ,'widgets/LapTiming/LapTiming'
        ,'widgets/CarControls/CarControls'
        ,'widgets/TeamSpeakTalking/TeamSpeakTalking'
        ,'widgets/WindGauge/WindGauge'
        ,'widgets/CarNumber/CarNumber'
        ,'widgets/CarImage/CarImage'
        ],
function( angular,  SIMRacingApps) {
    angular.element(document).ready(function() {

        //create any angular filters, values, constants, directives here on the SIMRacingApps.module

        //your application controller is added as a controller on the SIMRacingApps module
        SIMRacingApps.module.controller("SIMRacingApps-Controller",
               ['$scope','$timeout', 'sraDispatcher',
        function($scope,  $timeout, sraDispatcher) {
                   
           sraDispatcher.loadTranslations("/SIMRacingApps/apps/Spotter60","text",function(path) {
               $scope.translations = sraDispatcher.getTranslation(path,"auto");
           });
           
           $scope.clickDelay = 2000;
           $scope.broadcaster = sraDispatcher.getBoolean($scope.sraArgsBROADCASTER,false);
           
           $scope.onClickCarSelector = function($clickedScope,name) {
               if ($scope.broadcaster) {
                   console.log("Spotter60.setReferenceCar("+name+")");
                   $clickedScope.setClickedState('clicked');
                   sraDispatcher.sendCommand("Session/setReferenceCar/"+name);
                   //delay a little, then clear the clicked state.
                   $timeout(function () {
                       $clickedScope.setClickedState('none');
                   }, $scope.clickDelay);
               }
           };
        }]);

        //now start the process by passing in the element where the SIMRacingsApps class is defined.
        //all elements below that will be owned by SIMRacingApps. This should allow you to put other
        //content outside of this element that is not SIMRacingApps specific. All bundled apps will pass in the body.

        SIMRacingApps.start(angular.element(document.body),1280,768,16);

        //once angular is booted, your controller will get called.
        //it is not recommended to have multiple controllers in SIMRacingApps because of how the $scope is transversed from child to parent.
        //You can have as many directives and other angular objects as you wish.
    });
});
