'use strict';
/**
 * This is the Spek Gauges App.
 * It uses the following widgets: 
 * {@link sra-bar-gauge-spek-fuel-level BarGauge/FuelLevel},
 * {@link sra-bar-gauge-spek-fuel-pressure BarGauge/FuelPressure},
 * {@link sra-bar-gauge-spek-oil-level BarGauge/OilLevel},
 * {@link sra-bar-gauge-spek-oil-pressure BarGauge/OilPressure},
 * {@link sra-bar-gauge-spek-oil-temp BarGauge/OilTemp},
 * {@link sra-bar-gauge-spek-tachometer BarGauge/Tachometer},
 * {@link sra-bar-gauge-spek-voltage BarGauge/Voltage},
 * {@link sra-bar-gauge-spek-water-level BarGauge/WaterLevel},
 * {@link sra-bar-gauge-spek-water-pressure BarGauge/WaterPressure},
 * {@link sra-bar-gauge-spek-water-temp BarGauge/WaterTemp},
 * {@link sra-bar-gauge-spek-brake-pressure BarGauge/BrakePressure},
 * {@link sra-shift-lights ShiftLights},
 * {@link sra-car-number CarNumber},
 * {@link sra-flags Flags},
 * {@link sra-timing-delta TimingDelta},
 * {@link sra-pit-road PitRoad},
 * {@link sra-car-controls CarControls},
 * {@link sra-driver-info DriverInfo},
 * {@link sra-team-speak-talking TeamSpeakTalking}
 * {@link sra-fuel-tank FuelTank}
 * {@link sra-wind-gauge WindGauge}
 * 
 * <img src="../apps/Dash-BarGauges-DigitalOverlay/icon.png" />
 * 
 * @ngdoc apps
 * @name Dash-BarGauges-DigitalOverlay
 * @param {boolean} LAPSTOAVERAGE The number of laps to average for the fuel mileage commands. Defaults to zero(0) or worst lap.
 * @param {boolean} ALTLAPSTOAVERAGE The alternate number of laps to average for the fuel mileage commands. Used when saving fuel. Defaults to 2 laps.
 * @param {boolean} showFPS When any value is seen in the URL for this attribute, the Frames Per Second(FPS) will be shown. Defaults to not show.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2017 Jeffrey Gilliam
 * @license Apache License 2.0
 */
require(SIMRacingAppsRequireConfig,
        ['angular'
        ,'SIMRacingApps'
        ,'css!default'
        ,'widgets/BarGauge/Tachometer/Tachometer'
        ,'widgets/BarGauge/WaterTemp/WaterTemp'
        ,'widgets/BarGauge/WaterPressure/WaterPressure'
        ,'widgets/BarGauge/WaterLevel/WaterLevel'
        ,'widgets/BarGauge/FuelPressure/FuelPressure'
        ,'widgets/BarGauge/FuelLevel/FuelLevel'
        ,'widgets/BarGauge/Voltage/Voltage'
        ,'widgets/BarGauge/OilTemp/OilTemp'
        ,'widgets/BarGauge/OilPressure/OilPressure'
        ,'widgets/BarGauge/OilLevel/OilLevel'
        ,'widgets/BarGauge/BrakePressure/BrakePressure'
        ,'widgets/ShiftLights/ShiftLights'
        ,'widgets/CarControls/CarControls'
        ,'widgets/DataTable/DataTable'
        ,'widgets/DriverInfo/DriverInfo'
        ,'widgets/CarNumber/CarNumber'
        ,'widgets/Flags/Flags'
        ,'widgets/TimingDelta/TimingDelta'
        ,'widgets/PitRoad/PitRoad'
        ,'widgets/TeamSpeakTalking/TeamSpeakTalking'
        ,'widgets/FuelTank/FuelTank'
        ,'widgets/WindGauge/WindGauge'
        ],
function( angular,  SIMRacingApps) {
    angular.element(document).ready(function() {

        //create any angular filters, values, constants, directives here on the SIMRacingApps.module

        //your application controller is added as a controller on the SIMRacingApps module
        SIMRacingApps.module.controller("SIMRacingApps-Controller",
               ['$scope','sraDispatcher',
        function($scope,  sraDispatcher) {
               $scope.sraArgsLAPSTOAVERAGE    = $scope.sraArgsLAPSTOAVERAGE || "0";
               $scope.sraArgsALTLAPSTOAVERAGE = $scope.sraArgsALTLAPSTOAVERAGE || "2";
               
               //TODO: if you have any translations for your app, then uncomment the next 3 lines to load them.
               //Place them in a folder called "nls" and name each file with the pattern "text-{locale}.json"
               //{locale} should follow the same convention as the files in the ngLocale folder (i.e. ngLocale/angular-locale_{locale}.js).
               //Always provide a default translation file named "nls/text-en.json".
               //The format if these files are simply a json object that will get loaded into $scope.translations
               //or any variable of your choosing.

               sraDispatcher.loadTranslations("/SIMRacingApps/apps/Dash-BarGauges-DigitalOverlay","text",function(path) {
                   $scope.translations = sraDispatcher.getTranslation(path,"auto");
               });
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
