'use strict';
/**
 * This widget displays a TV style banner showing the standings.
 * Designed to be used as an overlay with OBS.
 * 
 * By default, the session type is displayed as the title.
 * The default sponsor is SIMRacingApps.
 * To change either, create a file called "StandingsBanner.json" in the "Documents/SIMRacingApps" folder 
 * with the following entries.
 * <pre>
 * {
 *   "title":            "DAYTONA 500",
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
 *    Documents\SIMRacingApps\StandingsBanner.json
 *    Documents\SIMRacingApps\Sponsors\Sponsor1.png
 *    Documents\SIMRacingApps\Sponsors\Sponsor2.png
 * </pre>
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-standings-banner&gt;&lt;/sra-standings-banner&gt;<br />
 * </b>
 * <img src="../widgets/StandingsBanner/icon.png" alt="Image goes here"/>
 * @ngdoc directive
 * @name sra-standings-banner
 * @param show-short-name Set to true to show the short name. Default is false.
 * @param show-team-name Set to false to not show the team name. Default is true.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2024 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps'
       ,'css!widgets/StandingsBanner/StandingsBanner'
       ,'widgets/LapsBanner/LapsBanner'
       ,'widgets/CarNumber/CarNumber'
],function(SIMRacingApps) {

    var self = {
        name:            "sraStandingsBanner",
        url:             'StandingsBanner',
        template:        'StandingsBanner.html',
        defaultWidth:    800,
        defaultHeight:   106,
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

                $scope.showShortName      = false;
                $scope.numberOfPages      = 10;   //need enough for 60 cars
                $scope.numberOfBoxes      = 3;    //must match number of tables in the HTML
                $scope.numberOfLines      = 4;    //This must match what's in the HTML table rows repeat
                $scope.numberOfGreenPages = 16;   //need enough for 60 cars
                $scope.numberOfGreenBoxes = 1;
                $scope.numberOfGreenLines = 4;    //This must match what's in the HTML table rows repeat
                $scope.pageDelay          = 10000;
                $scope.boxDelay           = 1000;
                $scope.currentPage        = 0;
                $scope.boxes              = [];
                $scope.showBox            = [];
                $scope.greenBoxes         = [];
                $scope.showGreenBox       = [];
                $scope.showLeaders        = false;
                $scope.showTeamName       = true;
                $scope.displayTeamName    = false;
                
                for (var i=0; i < ($scope.numberOfPages * $scope.numberOfBoxes); i++) {
                    $scope.boxes.push(i);
                    $scope.showBox.push(false);
                }
                
                for (var i=0; i < ($scope.numberOfGreenPages * $scope.numberOfGreenBoxes); i++) {
                    $scope.greenBoxes.push(i);
                    $scope.showGreenBox.push(false);
                }
                
                $scope.showTeams = function() {
                    if ($scope.showTeamName)
                        $scope.displayTeamName = true;
                };
                
                $scope.updateYellowPages = function() {
                    $scope.prevPage = $scope.currentPage;
                    
                    //go to the next page
                    if (++$scope.currentPage >= $scope.numberOfPages )
                        $scope.currentPage = 0;
                    
                    //but only if there are drivers on that page
                    if ((($scope.currentPage * $scope.numberOfLines * $scope.numberOfBoxes) + 1) > $scope.data.Session.Cars.Value
                    ||  !$scope.data.Car['P'+(($scope.currentPage * $scope.numberOfLines * $scope.numberOfBoxes) + 1)]
                    ||  !$scope.data.Car['P'+(($scope.currentPage * $scope.numberOfLines * $scope.numberOfBoxes) + 1)].Number.Value
                    )
                        $scope.currentPage = 0;

                    if ($scope.prevPage != $scope.currentPage) {
                        for (var i=0; i < $scope.numberOfBoxes; i++) {
                            $timeout( function(scope,prevPage,currentPage,box,numberOfBoxes) {
                                scope.showBox[(currentPage * numberOfBoxes) + box] = true;
                                scope.showBox[(prevPage    * numberOfBoxes) + box] = false;
                            },$scope.boxDelay * i,true,$scope,$scope.prevPage,$scope.currentPage,i,$scope.numberOfBoxes);
                        }
                    }
                    
                    $scope.displayTeamName = false;
                    $timeout($scope.showTeams,$scope.pageDelay / 2);
                    $scope.yellowTimer = $timeout($scope.updateYellowPages,$scope.pageDelay);
                };

                $scope.startYellowPages = function() {
                    if ($scope.greenTimer) {
                        $timeout.cancel($scope.greenTimer);
                        $scope.greenTimer = null;
                    }
                    
                    $scope.showLeaders = false;
                    for (var i=0; i < $scope.showGreenBox.length; i++)
                        $scope.showGreenBox[i] = false;
                    
                    if (!$scope.yellowTimer) {
                        $scope.currentPage = 0;
                        $scope.displayTeamName = false;
                        
                        //initially turn on the boxes on the first page
                        for (var i=0; i < $scope.numberOfBoxes; i++)
                            $scope.showBox[i] = true;
                        
                        $timeout($scope.showTeams,$scope.pageDelay / 2);
                        $scope.yellowTimer = $timeout($scope.updateYellowPages,$scope.pageDelay);
                    }
                };
                
                $scope.updateGreenPages = function() {
                    $scope.prevPage = $scope.currentPage;
                    
                    //go to the next page
                    if (++$scope.currentPage >= ($scope.numberOfGreenPages * $scope.numberOfGreenBoxes) )
                        $scope.currentPage = 0;
                    
                    //but only if there are drivers on that page
                    if ((($scope.currentPage * $scope.numberOfGreenLines * $scope.numberOfGreenBoxes) + 1 + 3/*NumLeaders*/) > $scope.data.Session.Cars.Value
                    ||  !$scope.data.Car['P'+(($scope.currentPage * $scope.numberOfGreenLines * $scope.numberOfGreenBoxes) + 1 + 3/*NumLeaders*/)]
                    ||  !$scope.data.Car['P'+(($scope.currentPage * $scope.numberOfGreenLines * $scope.numberOfGreenBoxes) + 1 + 3/*NumLeaders*/)].Number.Value
                    )
                        $scope.currentPage = 0;

                    if ($scope.prevPage != $scope.currentPage) {
                        for (var i=0; i < $scope.numberOfGreenBoxes; i++) {
                            $timeout( function(scope,prevPage,currentPage,box,numberOfGreenBoxes) {
                                scope.showGreenBox[(currentPage * numberOfGreenBoxes) + box] = true;
                                scope.showGreenBox[(prevPage    * numberOfGreenBoxes) + box] = false;
                            },$scope.boxDelay * i,true,$scope,$scope.prevPage,$scope.currentPage,i,$scope.numberOfGreenBoxes);
                        }
                    }
                    
                    $scope.displayTeamName = false;
                    $timeout($scope.showTeams,$scope.pageDelay / 4);
                    $scope.greenTimer = $timeout($scope.updateGreenPages,$scope.pageDelay / 2);
                };

                $scope.startGreenPages = function() {
                    if ($scope.yellowTimer) {
                        $timeout.cancel($scope.yellowTimer);
                        $scope.yellowTimer = null;
                    }
                    for (var i=0; i < $scope.showBox.length; i++)
                        $scope.showBox[i] = false;
                    if (!$scope.greenTimer) {
                        $scope.currentPage = 0;
                        $scope.displayTeamName = false;
                        
                        //initially turn on the leaders and the first box
                        $scope.showLeaders = true;
                        $scope.showGreenBox[0] = true;
                        
                        $timeout($scope.showTeams,$scope.pageDelay / 4);
                        $scope.greenTimer = $timeout($scope.updateGreenPages,$scope.pageDelay / 2);
                    }
                };

                $scope.updateFlag = function() {
/**
if ($scope.data.Car.REFERENCE.Messages.Value.indexOf(";REPAIR;") >= 0) {
    $scope.data.Session.IsCautionFlag.Value = true;
}
/**/
                    if ($scope.data.Session.IsGreenFlag.Value) {
                    	$scope.startGreenPages();
                    }
                    else
                    if ($scope.data.Session.IsCautionFlag.Value) {
                        $scope.startYellowPages();
                    }
                    else
                    if ($scope.data.Session.IsCheckeredFlag.Value) {
                        $scope.startGreenPages();
                    }
                    else
                    if ($scope.data.Session.IsWhiteFlag.Value) {
                        $scope.startGreenPages();
                    }
                    else
                    if ($scope.data.Session.IsRedFlag.Value) {
                        $scope.startYellowPages();
                    }
                    else {
                        $scope.startGreenPages();
                    }
                };
                
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                $scope.showShortName = sraDispatcher.getBoolean($scope.sraArgsSHOWSHORTNAME,$attrs.sraArgsShowShortName,$scope.showShortName);
                $scope.showTeamName  = sraDispatcher.getBoolean($scope.sraArgsSHOWTEAMNAME,$attrs.sraArgsShowTeamName,$scope.showTeamName);

                /** your code goes here **/

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
