'use strict';
/**
 * This widget displays a TV style banner title and lap counter with sponsor images.
 * 
 * By default, the session type is displayed as the title.
 * The default sponsor is SIMRacingApps.
 * To change either, create a file called "LapsBanner.json" in the "Documents/SIMRacingApps" folder 
 * with the following entries.
 * <pre>
 * {
 *   "title":            "TALLADEGA 500",
 *   "fontSize":         "100%",
 *   "sponsorImageUrls": ["Sponsors/Sponsor1.png","Sponsors/Sponsor2.png","sra"],
 *   "sponsorSeconds":   [60,120,60]
 * }
 * </pre>
 * In the example, the sponsor logos is an array of files that are stored in the "Documents/SIMRacingApps/Sponsors" folder.
 * The ratio of a sponsor file should be 4x1. The default window size calculates that to be 200x50 pixels, but it will scale up and down.
 * Each sponsor can have their own display time using the seconds array.
 * The first sponsor will be displayed for 60 seconds, the second for 120 seconds, then start over.
 * You can add more sponsors and seconds to display as needed.
 * Any image that cannot be found will be replaced with the stock SRA logo.
 * <p>
 * Example list of the files.
 * <pre>
 *    Documents\SIMRacingApps\LapsBanner.json
 *    Documents\SIMRacingApps\Sponsors\Sponsor1.png
 *    Documents\SIMRacingApps\Sponsors\Sponsor2.png
 * </pre>
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-laps-banner&gt;&lt;/sra-laps-banner&gt;<br />
 * </b>
 * <img src="../widgets/LapsBanner/icon.png" alt="Image goes here"/>
 * @ngdoc directive
 * @name sra-laps-banner
 * @param {string} data-sra-args-title-filename The name of the file to read the title and sponsors from. Defaults to "LapsBanner".
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam, Robert Moyer Jr.
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2017 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps'
       ,'css!widgets/LapsBanner/LapsBanner'
],function(SIMRacingApps) {

    var self = {
        name:            "sraLapsBanner",
        url:             'LapsBanner',
        template:        'LapsBanner.html',
        defaultWidth:    200,
        defaultHeight:   100,
        defaultInterval: 500   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$rootScope', '$timeout', '$http',
    function(sraDispatcher,   $filter,   $rootScope,   $timeout,   $http) {
        return {
            restrict:    'EA',
            scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                //load translations, if you have any comment out if you do not so it will not look for them
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });

                /** your code goes here **/

                $scope.titleFilename    = "LapsBanner";
                $scope.showShortName    = false;
                $scope.flag             = "green"; //green, yellow, white, checkered, red
                $scope.title            = "";
                $scope.titleFontSize    = 100;
                $scope.sponsorImageUrl  = null;
                $scope.sponsorImageUrls = ['SRA-Logo-with-URL.png'];
                $scope.sponsorSeconds   = [60];
                $scope.sponsorCurrent   = 0;
                
                $scope.updateFlag = function() {
/**
if ($scope.data.Car.REFERENCE.Messages.Value.indexOf(";REPAIR;") >= 0) {
    $scope.data.Session.IsCautionFlag.Value = true;
}
/**/
                    if ($scope.data.Session.IsCautionFlag.Value) {
                        $scope.flag = "yellow";
                    }
                    else
                    if ($scope.data.Session.IsCheckeredFlag.Value) {
                        $scope.flag = "checkered";
                    }
                    else
                    if ($scope.data.Session.IsWhiteFlag.Value) {
                        $scope.flag = "white";
                    }
                    else
                    if ($scope.data.Session.IsRedFlag.Value) {
                        $scope.flag = "red";
                    }
                    else {
                        $scope.flag = "green";
                    }
                };
                
                $scope.updateSponsor = function() {
                    var prevSponsor = $scope.sponsorCurrent;
                    
                    if (++$scope.sponsorCurrent >= $scope.sponsorImageUrls.length)
                        $scope.sponsorCurrent = 0;
                    
                    $scope.sponsorImageUrl = $scope.sponsorImageUrls[$scope.sponsorCurrent];
                    
                    $timeout($scope.updateSponsor,($scope.sponsorCurrent < $scope.sponsorSeconds.length ? $scope.sponsorSeconds[$scope.sponsorCurrent] : $scope.sponsorSeconds[0])*1000);
                };
                
                $timeout($scope.updateSponsor,($scope.sponsorCurrent < $scope.sponsorSeconds.length ? $scope.sponsorSeconds[$scope.sponsorCurrent] : $scope.sponsorSeconds[0])*1000);
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name]     = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                $scope.titleFilename  = sraDispatcher.getTruthy($scope.sraArgsTITLEFILENAME,$attrs.sraArgsTitleFilename,$scope.titleFilename);
                $scope.byClass        = sraDispatcher.getBoolean($scope.sraArgsBYCLASS,$attrs.sraArgsByClass,false);

                /** your code goes here **/

                $http({
                    method:  'GET',
                    url:     '/SIMRacingApps/'+$scope.titleFilename+'.json',
                    cache:   false,
                    timeout: 5000,
                    params: {
                        cacheBuster:   Date.now()  //to help the browser to stop caching
                    }
                })
                .then(
                    function(request) {
                        console.log($scope.titleFilename+".json = "+JSON.stringify(request.data));
                        $scope.title            = request.data.title            || "";
                        $scope.sponsorImageUrls = request.data.sponsorImageUrls || ['SRA-Logo-with-URL.png'];
                        $scope.sponsorSeconds   = request.data.sponsorSeconds   || [60];
                        $scope.titleFontSize    = request.data.fontSize         || "100%";
                        
                        if ($scope.sponsorImageUrls.length > 0)
                            $scope.sponsorImageUrl = $scope.sponsorImageUrls[$scope.sponsorCurrent]; 
                    },
                    function error(request) {
                        //fallback to the old filename
                        $http({
                            method:  'GET',
                            url:     $scope.titleFilename == 'LapsBanner' ? '/SIMRacingApps/StandingsBanner.json' : '/SIMRacingApps/LapsBanner.json',
                            cache:   false,
                            timeout: 5000,
                            params: {
                                cacheBuster:   Date.now()  //to help the browser to stop caching
                            }
                        })
                        .then(function(request) {
                            console.log($scope.titleFilename+".json = "+JSON.stringify(request.data));
                            $scope.title            = request.data.title            || "";
                            $scope.sponsorImageUrls = request.data.sponsorImageUrls || ['SRA-Logo-with-URL.png'];
                            $scope.sponsorSeconds   = request.data.sponsorSeconds   || [60];
                            $scope.titleFontSize    = request.data.fontSize         || "100%";
                            
                            if ($scope.sponsorImageUrls.length > 0)
                                $scope.sponsorImageUrl = $scope.sponsorImageUrls[$scope.sponsorCurrent]; 
                        });
                    }
                );
                
/**                
//For testing, Since I don't have a yellow flag in my test file
//I will simulate it here when I get the meat-ball.                
$attrs.sraArgsData += ";Car/REFERENCE/Messages";
$scope.$watch("data.Car.REFERENCE.Messages.Value",$scope.updateFlag);
/**/
                
                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                /**watches go here **/
                $scope.$watch("data.Session.IsCautionFlag.Value",$scope.updateFlag);
                $scope.$watch("data.Session.IsCheckeredFlag.Value",$scope.updateFlag);
                $scope.$watch("data.Session.IsWhiteFlag.Value",$scope.updateFlag);
                $scope.$watch("data.Session.IsRedFlag.Value",$scope.updateFlag);
                $scope.$watch("data.Session.IsGreenFlag.Value",$scope.updateFlag);
            }
        };
    }]);

    return self;
});
