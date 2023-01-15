'use strict';
/**
 * This widget displays a 2D GForce map.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-gforce&gt;&lt;/sra-gforce&gt;<br />
 * </b>
 * <img src="../widgets/GForce/icon.png" />
 * @ngdoc directive
 * @name sra-gforce
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Gary Prince
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2023 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/GForce/GForce'],
function(SIMRacingApps) {

    var self = {
        name:            "sraGForce",
        url:             'GForce',
        template:        'GForce.html',
        defaultWidth:    480,
        defaultHeight:   480,
        defaultInterval: 100   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$rootScope',
    function(sraDispatcher,   $filter,   $rootScope) {
        return {
            restrict:    'EA',
            $scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                //load translations, if you have any un-comment this
//                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
//                    $scope.translations = sraDispatcher.getTranslation(path);
//                });

                /** your code goes here **/				
				
				// urls to sim data
			    // http://your-ip/SIMRacingApps/Data/iRacing/Vars
			    // http://your-ip/SIMRacingApps/Data/iRacing/Vars/LongAccel	
                // http://your-ip/SIMRacingApps/Data/iRacing/Vars/LatAccel

                // very cool g-force graphic
				// set background to actual car image from sim and set a custom g-force range
				// design a 3-D G-Force widget --> tilt graphic like a 3-d chess board and add heave
				// https://jalopnik.com/see-how-much-more-intense-the-g-forces-are-in-f1s-new-c-1793888742				
				
				// calculate g-force and new dot location
				// center = 240,240 (+/- 80 for each ring)
                // longitude CY --> inner ring = 160 & 320, outer ring = 80	& 400 (dot up & down)
                // latitude CX --> inner ring = 160 & 320, outer ring = 80& 400 (dot left & right)			
				// g-force sim telemetry --> float, m/s^2, lat & lon accel w/gravity, disk & live
				// g-force range to use = 0.0 to 3.0 (can spike beyond this range)
				// dot xy movement has a range from 80 to 400 (240 center, 160 to outer ring)
				// inner ring = 1.5 Gs, outer ring = 3.0 Gs (might need to adjust to 2 & 4 for Indy & F1 cars)
				// positive g-force number = acceleration (dot down) & turning left (dot right)
				// negative g-force number = braking (dot up) & turning right (dot left)			
				// 1 m/s^2 = 0.101971621 g
                // 1 g = 9.806650028 m/s^2				
				
				// move the dot and update the labels
				$scope.MoveDotAndUpdateLabels = function() { 
		
		            // get m/s^2 sim telemetry and convert to g-force
					var myLongG = $scope.data.Car.REFERENCE.LongitudeAcceleration.GF.Value;
                    var myLatG = $scope.data.Car.REFERENCE.LatitudeAcceleration.GF.Value;
					
					// update the labels
					// display only positive g-force numbers rounded to 1 decimal
					// myLongGpos --> positive longitude number --> acceleration (dot moves down)
					// myLongGneg --> negative longitude number --> braking (dot moves up)
					// myLatGpos  --> positive latitude number --> turning left (dot moves right)				
					// myLatGneg  --> negative latitude number --> turning right (dot moves left)
					var myLongGpos = 0, myLongGneg = 0, myLatGpos = 0, myLatGneg = 0;
					if (myLongG >= 0) { myLongGpos = myLongG; }
					if (myLongG < 0) { myLongGneg = Math.abs(myLongG); }
					if (myLatG >= 0) { myLatGpos = myLatG; }
					if (myLatG < 0) { myLatGneg = Math.abs(myLatG); }					
					$scope.LongGpos = myLongGpos.toFixed(1);
					$scope.LongGneg = myLongGneg.toFixed(1);
					$scope.LatGpos = myLatGpos.toFixed(1);
					$scope.LatGneg = myLatGneg.toFixed(1);
					
					// move the dot
					// G range = 0 to 3, dot range = 80 to 400, center = 240
					// dot has range of 160 from center -- adjust according to G % of 3
					function moveDot(myG) {					
						var myXY = ((myG / 3) * 160) + 240;
						if (myXY > 400) {myXY = 400};
						if (myXY < 80) {myXY = 80};
						return myXY;
					}
					$scope.CY = moveDot(myLongG);
					$scope.CX = moveDot(myLatG);  
				};
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
				$scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");

                /** your code goes here **/				
				
		        // add sim telemetry
				$attrs.sraArgsData += ";Car/REFERENCE/LongitudeAcceleration/GF";
				$attrs.sraArgsData += ";Car/REFERENCE/LatitudeAcceleration/GF";			

				// watch for changes, then call function
				$scope.$watch("data.Car.REFERENCE.LongitudeAcceleration.GF.Value",$scope.MoveDotAndUpdateLabels);
				$scope.$watch("data.Car.REFERENCE.LatitudeAcceleration.GF.Value",$scope.MoveDotAndUpdateLabels);

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));
                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher				
            }
        };
    }]);

    return self;
});
