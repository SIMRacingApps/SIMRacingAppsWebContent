'use strict';

/**
 * This is the Crew Chief App.
 * It displays some extra information beside the {@link sra-pit-commander PitCommander} widget.
 * Be default, it will run in read-only mode and not send commands to the SIM. 
 * See the PITCOMMANDSSIMCONTROLLER parameter below to change it.
 * 
 * <img src="../apps/CrewChief/icon.png" />
 * 
 * NOTE: All parameters are specified in the URL.
 * @ngdoc apps
 * @name CrewChief
 * @param {boolean} PITCOMMANDSSIMCONTROLLER If true, then this widget can send changes to the SIM. Defaults to false. 
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
        ,'widgets/DataTable/DataTable'
        ,'widgets/WeatherInfo/WeatherInfo'
        ,'widgets/PitCommander/PitCommander'
        ,'widgets/CarNumber/CarNumber'
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

            sraDispatcher.loadTranslations("/SIMRacingApps/apps/CrewChief","text",function(path) {
                $scope.translations = sraDispatcher.getTranslation(path,"auto");
            });
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
