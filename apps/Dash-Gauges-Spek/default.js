'use strict';
/**
 * This is the Spek Gauges App.
 * It uses the following widgets: 
 * {@link sra-analog-gauge-spek-fuel-level AnalogGauge/Spek/FuelLevel},
 * {@link sra-analog-gauge-spek-fuel-pressure AnalogGauge/Spek/FuelPressure},
 * {@link sra-analog-gauge-spek-oil-level AnalogGauge/Spek/OilLevel},
 * {@link sra-analog-gauge-spek-oil-pressure AnalogGauge/Spek/OilPressure},
 * {@link sra-analog-gauge-spek-oil-temp AnalogGauge/Spek/OilTemp},
 * {@link sra-analog-gauge-spek-tachometer AnalogGauge/Spek/Tachometer},
 * {@link sra-analog-gauge-spek-voltage AnalogGauge/Spek/Voltage},
 * {@link sra-analog-gauge-spek-water-level AnalogGauge/Spek/WaterLevel},
 * {@link sra-analog-gauge-spek-water-pressure AnalogGauge/Spek/WaterPressure},
 * {@link sra-analog-gauge-spek-water-temp AnalogGauge/Spek/WaterTemp}
 * {@link sra-analog-gauge-spek-brake-pressure AnalogGauge/Spek/BrakePressure}
 * 
 * <img src="../apps/Dash-Gauges-Spek/icon.png" />
 * 
 * @ngdoc apps
 * @name Dash-Gauges-Spek
 * @param {boolean} showFPS When any value is seen in the URL for this attribute, the Frames Per Second(FPS) will be shown. Defaults to not show.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2016 Jeffrey Gilliam
 * @license Apache License 2.0
 */
require(SIMRacingAppsRequireConfig,
        ['angular'
        ,'SIMRacingApps'
        ,'css!default'
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

        SIMRacingApps.start(angular.element(document.body),1280,768,16);

        //once angular is booted, your controller will get called.
        //it is not recommended to have multiple controllers in SIMRacingApps because of how the $scope is transversed from child to parent.
        //You can have as many directives and other angular objects as you wish.
    });
});
