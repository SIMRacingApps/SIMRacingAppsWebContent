'use strict';
/**
 * This is the NASCAR Digital Dash.
 * 
 * <img src="../apps/NASCAR-Digital-Dash/icon.png" />
 * 
 * @ngdoc apps
 * @name NASCAR-Digital-Dash
 * @param {boolean} showFPS When any value is seen in the URL for this attribute, the Frames Per Second(FPS) will be shown. Defaults to not show.
 * @author Jeffrey Gilliam
 * @since 1.10
 * @copyright Copyright (C) 2015 - 2024 Jeffrey Gilliam
 * @license Apache License 2.0
 */
require(SIMRacingAppsRequireConfig,
        ['angular'
        ,'SIMRacingApps'
        ,'css!default'
        ,'widgets/BarGauge/Tachometer/Tachometer'
        ,'widgets/ShiftLights/ShiftLights'
        ,'widgets/TextGauge/WaterTemp/WaterTemp'
        ,'widgets/TextGauge/WaterPressure/WaterPressure'
        ,'widgets/TextGauge/OilTemp/OilTemp'
        ,'widgets/TextGauge/OilPressure/OilPressure'
        ,'widgets/TextGauge/Voltage/Voltage'
        ,'widgets/TextGauge/FuelLevel/FuelLevel'
        ,'widgets/Gear/Gear'
        ],
function( angular,  SIMRacingApps) {
    angular.element(document).ready(function() {

        //create any angular filters, values, constants, directives here on the SIMRacingApps.module

        //your application controller is added as a controller on the SIMRacingApps module
        SIMRacingApps.module.controller("SIMRacingApps-Controller",
               ['$scope','sraDispatcher',
        function($scope,  sraDispatcher) {
               
               //TODO: if you have any translations for your app, then uncomment the next 3 lines to load them.
               //Place them in a folder called "nls" and name each file with the pattern "text-{locale}.json"
               //{locale} should follow the same convention as the files in the ngLocale folder (i.e. ngLocale/angular-locale_{locale}.js).
               //Always provide a default translation file named "nls/text-en.json".
               //The format if these files are simply a json object that will get loaded into $scope.translations
               //or any variable of your choosing.

               sraDispatcher.loadTranslations("/SIMRacingApps/apps/NASCAR-Digital-Dash","text",function(path) {
                   $scope.translations = sraDispatcher.getTranslation(path,"auto");
               });
        }]);

        //now start the process by passing in the element where the SIMRacingsApps class is defined.
        //all elements below that will be owned by SIMRacingApps. This should allow you to put other
        //content outside of this element that is not SIMRacingApps specific. All bundled apps will pass in the body.

        SIMRacingApps.start(angular.element(document.body),1280,480,16);

        //once angular is booted, your controller will get called.
        //it is not recommended to have multiple controllers in SIMRacingApps because of how the $scope is transversed from child to parent.
        //You can have as many directives and other angular objects as you wish.
    });
});
