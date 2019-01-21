'use strict';
/**
 * 
 * <img src="../apps/StreamingOverlay/icon.png" />
 * 
 * To change the WaitingForSIM to cover the entire area, 
 * add this to your Documents/SIMRacingApps/useroverrides.css file.
 * <pre>
 * .SIMRacingApps-App-StreamingOverlay-WaitingForSIM {
 *   width:      100%;
 *   height:     100%;
 *   top:        0%;
 *   left:       0%;
 * }
 * </pre>
 * To have it display a custom image instead, create a PNG file called
 * Documents/SIMRacingApps/WaitingForSIM.png.
 *  
 * @ngdoc apps
 * @name StreamingOverlay
 * @param {boolean} showFPS When any value is seen in the URL for this attribute, the Frames Per Second(FPS) will be shown. Defaults to not show.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2019 Jeffrey Gilliam
 * @license Apache License 2.0
 */
require(SIMRacingAppsRequireConfig,
        ['angular'
        ,'SIMRacingApps'
        ,'css!default'
        ,'widgets/StandingsBanner/StandingsBanner'
        ,'widgets/RelativeSmall/RelativeSmall'
        ,'widgets/LapTiming/LapTiming'
        ,'widgets/TrackMap/TrackMap'
        ,'widgets/AnalogGauge/Spek/FuelLevel/FuelLevel'
        ,'widgets/AnalogGauge/Spek/FuelPressure/FuelPressure'
        ,'widgets/AnalogGauge/Spek/OilLevel/OilLevel'
        ,'widgets/AnalogGauge/Spek/OilPressure/OilPressure'
        ,'widgets/AnalogGauge/Spek/OilTemp/OilTemp'
        ,'widgets/AnalogGauge/Spek/Tachometer/Tachometer'
        ,'widgets/AnalogGauge/Spek/Voltage/Voltage'
        ,'widgets/AnalogGauge/Spek/WaterLevel/WaterLevel'
        ,'widgets/AnalogGauge/Spek/WaterPressure/WaterPressure'
        ,'widgets/AnalogGauge/Spek/WaterTemp/WaterTemp'
        ,'widgets/AnalogGauge/Spek/BrakePressure/BrakePressure'
        ,'widgets/WaitingForSIM/WaitingForSIM'
        ],
function( angular,  SIMRacingApps) {
    angular.element(document).ready(function() {

        //create any angular filters, values, constants, directives here on the SIMRacingApps.module

        //your application controller is added as a controller on the SIMRacingApps module
        SIMRacingApps.module.controller("SIMRacingApps-Controller",
               ['$scope','sraDispatcher',
        function($scope,  sraDispatcher) {
        }]);

        //now start the process by passing in the element where the SIMRacingsApps class is defined.
        //all elements below that will be owned by SIMRacingApps. This should allow you to put other
        //content outside of this element that is not SIMRacingApps specific. All bundled apps will pass in the body.

        SIMRacingApps.start(angular.element(document.body),1920,1080,16);

        //once angular is booted, your controller will get called.
        //it is not recommended to have multiple controllers in SIMRacingApps because of how the $scope is transversed from child to parent.
        //You can have as many directives and other angular objects as you wish.
    });
});
