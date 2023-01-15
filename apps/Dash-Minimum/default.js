'use strict';
/**
 * This is the Dash for Small screens, like phones.
 * 
 * <img src="../apps/Dash-Minimum/icon.png" />
 * 
 * @ngdoc apps
 * @name Dash-Minimum
 * @param {boolean} LAPSTOAVERAGE The number of laps to average for the fuel mileage commands. Defaults to zero(0) or worst lap.
 * @param {boolean} ALTLAPSTOAVERAGE The alternate number of laps to average for the fuel mileage commands. Used when saving fuel. Defaults to 2 laps.
 * @param {boolean} showFPS When any value is seen in the URL for this attribute, the Frames Per Second(FPS) will be shown. Defaults to not show.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2023 Jeffrey Gilliam
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
        ,'widgets/FuelTank/FuelTank'
        ,'widgets/Tire/Tire'
        ,'widgets/Messages/Messages'
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

               sraDispatcher.loadTranslations("/SIMRacingApps/apps/Dash-Minimum","text",function(path) {
                   $scope.translations = sraDispatcher.getTranslation(path,"auto");
               });
        }]);

        //now start the process by passing in the element where the SIMRacingsApps class is defined.
        //all elements below that will be owned by SIMRacingApps. This should allow you to put other
        //content outside of this element that is not SIMRacingApps specific. All bundled apps will pass in the body.

        SIMRacingApps.start(angular.element(document.body),960,540,16);

        //once angular is booted, your controller will get called.
        //it is not recommended to have multiple controllers in SIMRacingApps because of how the $scope is transversed from child to parent.
        //You can have as many directives and other angular objects as you wish.
    });
});
