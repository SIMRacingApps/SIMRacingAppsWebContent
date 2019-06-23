'use strict';
/**
 * This widget displays various driver inputs.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-compteur&gt;&lt;/sra-compteur&gt;<br />
 * </b>
 * <img src="../widgets/Compteur/icon.png" />
 * @ngdoc directive
 * @name sra-compteur
 * @param {boolean} data-sra-args-show-f1-compteur Show the F1 version of Compteur. Defaults to false.
 * @param {boolean} data-sra-args-show-clutch-f1-compteur Show the clutch on the F1 version of Compteur. Defaults to false.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Gary Prince
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2019 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/Compteur/Compteur'],
function(SIMRacingApps) {

    /* Moved these to $scope
	// Compteur Widget Settings
	var showSteeringWheel = true;
	var showGforceMapAndDot = true;
	var gforceMax = 3; 	
	var showKPH = false;
	var showRPMLines = true;
	var showPedalText = true;
	var showLapTime = true;
	var showCarImage = true;
	var showClutchF1Compteur = false;
	
	// CompteurF1 Widget Settings
	var showF1Compteur = true;
	var showSteeringWheel = false;
	var showGforceMapAndDot = false;
	var gforceMax = 3; 	
	var showKPH = false;
	var showRPMLines = true;
	var showPedalText = true;
	var showLapTime = true;
	var showCarImage = true;
	var showClutchF1Compteur = false;
	*/

    var self = {
        name:            "sraCompteur",
        url:             'Compteur',
        template:        'Compteur.html',
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

                // load translations, if you have any un-comment this
				sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
				$scope.translations = sraDispatcher.getTranslation(path);
				});

                /** your code goes here **/					
			    $scope.showF1Compteur = false;
			    $scope.showSteeringWheel = true;
			    $scope.showGforceMapAndDot = true;
			    $scope.gforceMax = 3;  
//			    $scope.showKPH = false;
			    $scope.showRPMLines = true;
			    $scope.showPedalText = true;
			    $scope.showLapTime = true;
			    $scope.showCarImage = true;
			    $scope.showClutchF1Compteur = false;
				
				// -------------------------------------------------------------
				// -- RPM Ticks and Numbers ------------------------------------
				// -------------------------------------------------------------
				
				$scope.startAngle       = 120;
                $scope.endAngle         = 420;
                $scope.ringSize         = -36; // number ring
				$scope.ringSizeTicks    = 45; // tick ring
                $scope.majorSize        = 30;
                $scope.majorBuffer      = 3;
				$scope.majorSizeTicks   = 18; // tick length
                $scope.majorBufferTicks = 2; // tick radius
                $scope.majorTextBuffer  = 30; 
                $scope.majorFontSize    = 30;
                $scope.roundTo          = 1;
                $scope.decimals         = 0;

                $scope.majorMaxText = 3;
				$scope.majorScale  = [
                        { angle: 120, text: '0' },
                        { angle: 150, text: '1' },
                        { angle: 180, text: '2' },
                        { angle: 210, text: '3' },
                        { angle: 240, text: '4' },
                        { angle: 270, text: '5' },
                        { angle: 300, text: '6' },
                        { angle: 330, text: '7' },
                        { angle: 360, text: '8' },
                        { angle: 390, text: '9' },
                        { angle: 420, text: '10' }
                ];
                
                $scope.buildScales = function() {
                    var Minimum        = $scope.data.Car.REFERENCE.Gauge.Tachometer.Minimum.Value || 0;
                    var Maximum        = $scope.data.Car.REFERENCE.Gauge.Tachometer.Maximum.Value || 100;
                    var MajorIncrement = $scope.data.Car.REFERENCE.Gauge.Tachometer.MajorIncrement.Value || 10;
                    var range          = ($scope.endAngle - $scope.startAngle);

                    // Major scale
					//changed on 7/11/2018 to track the floored min and only create it once
                    if (Minimum !== "" && Maximum !== "" && MajorIncrement !== "") {
                        //console.log($scope.sraAnalogGauge + ': AnalogGauge.buildScales.major('+Minimum+','+Maximum+','+MajorIncrement+')');
                        $scope.majorScale  = [];

                        var angle          = $scope.startAngle;
                        var inc   = range / ((Maximum - Minimum) / MajorIncrement);
                        var minFloored = -1;
                        for (var min = Minimum; MajorIncrement > 0 && min <= Maximum; min += MajorIncrement) {
                            if (minFloored != Math.floor(min)) {
                                minFloored = Math.floor(min);
                                
                                //calculate the angle based on the floored value, else needle will not be accurate.
                                var v = minFloored;
            
                                if (v <= Minimum)
                                    angle = $scope.startAngle;
                                else
                                if (v >= Maximum)
                                    angle = $scope.endAngle;
                                else {
                                    var percentage = (v - Minimum) / (Maximum - Minimum);
                                    angle = $scope.startAngle + (percentage * range);
                                }
                                $scope.majorScale.push({angle: angle, text: minFloored});
                            }
                            //angle += inc;
                        }
                    }
                };
				
				
				// -------------------------------------------------------------
				// -- GForce ---------------------------------------------------
				// -------------------------------------------------------------
				
				// move the dot and update the labels
                $scope.myLongG=null;
                $scope.myLatG=null;
                $scope.myLongGReplayPaused=null;
                $scope.myLatGReplayPaused=null;
                $scope.replayState=null;
				$scope.MoveDotAndUpdateLabels = function() { 	                
		            
				    $scope.replayState = $scope.data.Session.Replay.Value;
					if ($scope.replayState != "||") { 
						
						// get current Gs
					    $scope.myLongG = $scope.data.Car.REFERENCE.LongitudeAcceleration.GF.Value;
					    $scope.myLatG = $scope.data.Car.REFERENCE.LatitudeAcceleration.GF.Value;
						
						// save Gs for when replay is paused					
					    $scope.myLongGReplayPaused = $scope.myLongG;
					    $scope.myLatGReplayPaused = $scope.myLatG;
					}
					
					// set Gs to the previous frame's Gforce data
				    if ($scope.replayState == "||") {
				        $scope.myLongG	= $scope.myLongGReplayPaused;				
				        $scope.myLatG = $scope.myLatGReplayPaused;
					}
					
					// check gforceMax
					if ($scope.gforceMax > 5) { $scope.gforceMax = 5; }
					if ($scope.gforceMax < 3) { $scope.gforceMax = 3; }
					
					// move the dot
					// G range = 0 to gforceMax, dot range = 80 to 400, center = 240
					// dot has range of 160 from center -- adjust according to G % of gforceMax
					// gforceMax = 3 (default setting)
					function moveDot(myG) {					
						var myXY = ((myG / $scope.gforceMax) * 160) + 240;
						if (myXY > 400) { myXY = 400; }
						if (myXY < 80) { myXY = 80; }
						return myXY;
					}
					$scope.CY = moveDot($scope.myLongG);
					$scope.CX = moveDot($scope.myLatG);
					
					// get gforce path length and set dasharray
					var myGforcePath = $scope.myGforcePathS;
					var gforceDasharrayPathLength = Math.round(myGforcePath.getTotalLength());
					$scope.gforceDasharray = gforceDasharrayPathLength;

                    // GForce arc and label --> display strongest gforce					
					var myGforce = Math.max(Math.abs($scope.myLongG), Math.abs($scope.myLatG));
					var myGforceMin = Math.min(myGforce, $scope.gforceMax); // keep arc fill from spilling into brake
					$scope.gforcePct = gforceDasharrayPathLength - ((myGforceMin / $scope.gforceMax) * gforceDasharrayPathLength);						 
					$scope.gforceTextOpacity = 0.0;
					if ($scope.showPedalText) { 
					    $scope.gforceNumber = myGforce;
                        $scope.gforceTextOpacity = 0.55;						
					}
					
					//show gforce background map and dot
					$scope.gforceDotOpacity = 0.0;
				    $scope.gforceLineOpacity = 0.0;
					if ($scope.showGforceMapAndDot) { 
					    $scope.gforceDotOpacity = 0.5;
						$scope.gforceLineOpacity = 0.15;
					}
					
					// show gforce label f1 compteur
					$scope.GforceLabelOpacityF1 = 0.0;
					if ($scope.showGforceMapAndDot && $scope.showF1Compteur) {
						$scope.GforceLabelOpacityF1 = 0.7;
						$scope.GforceNumberF1 = myGforce;
					}
					
				};
				
                // -------------------------------------------------------------
				// -- RPM ------------------------------------------------------
				// -------------------------------------------------------------
				
				// fill the rpm arc and update labels				
				$scope.UpdateRPM = function() {
					
					// get rpm values
					var myRPM = $scope.data.Car.REFERENCE.Gauge.Tachometer.ValueCurrent.Value;
					var myRPMState = $scope.data.Car.REFERENCE.Gauge.Tachometer.ValueCurrent.State;
					var myRPMMin = $scope.data.Car.REFERENCE.Gauge.Tachometer.Minimum.Value * 1000;
                    var myRPMMax = $scope.data.Car.REFERENCE.Gauge.Tachometer.Maximum.Value * 1000;
					
					// set rpm color
					// SHIFTLIGHTS - indicates the shift lights should be turned on
					// SHIFT - indicates it is time to shift to the next gear
					// SHIFTBLINK - Blink is after Shift and it's where the light will blink
					// CRITICAL - indicates it has red-lined					
					if (myRPMState == "SHIFTLIGHTS") { $scope.RPMColor = "yellow"; }
					else if (myRPMState == "SHIFT" || myRPMState == "SHIFTBLINK" || myRPMState == "CRITICAL") { $scope.RPMColor = "red"; }
                    else { $scope.RPMColor = "blue"; }
					
					// get rpm path length and set dasharray
					var myRPMPath = $scope.myRPMPathS;					
					var rpmDasharrayPathLength = Math.round(myRPMPath.getTotalLength());
					$scope.rpmDasharray = rpmDasharrayPathLength;
					
					// set rpm arc pct and update display
					// https://codepen.io/xgad/post/svg-radial-progress-meters
					// stroke-dasharray = get path length
					// stroke-dashoffset = % of stroke-dasharray to stroke/display					                    
					$scope.RPMPct = rpmDasharrayPathLength + ((myRPM / (myRPMMax - myRPMMin)) * rpmDasharrayPathLength);
					$scope.RPMNumber = myRPM;
					
					//show rpm lines
					$scope.rpmLineOpacity = 0.0;
					if ($scope.showRPMLines) { $scope.rpmLineOpacity = 0.15; }
				};

				// -------------------------------------------------------------
				// -- Speed ----------------------------------------------------
				// -------------------------------------------------------------
				
				// update the speed label
				$scope.UpdateSpeed = function() {
					
					// Speed = GPS vehicle speed, m/s, float
					var mySpeed = $scope.data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.Value;					
					//if ($scope.showKPH) { mySpeed = $scope.data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.KPH.Value; } 					
                    $scope.SpeedNumber = mySpeed;			
                    $scope.SpeedLabel = $scope.data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.UOMAbbr;
				};
				
				// set the speed label
//				var mySpeedLabel = "mph";
//				if ($scope.showKPH) { mySpeedLabel = "kph"; } 
//                $scope.SpeedLabel = mySpeedLabel;
				
				
				// -------------------------------------------------------------
				// -- Gear -----------------------------------------------------
				// -------------------------------------------------------------
				
				// update the gear
				$scope.UpdateGear = function() {
					var myGear = $scope.data.Car.REFERENCE.Gauge.Gear.ValueCurrent.Value;
					$scope.GearNumber = myGear;
				};
				
				
				// -------------------------------------------------------------
				// -- Steering Wheel -------------------------------------------
				// -------------------------------------------------------------
				
				// update steering wheel
				$scope.UpdateSteeringWheel = function() {
					var mySteeringWheel = $scope.data.Car.REFERENCE.Gauge.Steering.ValueCurrent.DEG.Value;					
					$scope.SteeringAngle = mySteeringWheel;
				};

				// -------------------------------------------------------------
				// -- Throttle Arc and Label -----------------------------------
				// -------------------------------------------------------------
				
				// update the throttle
				$scope.UpdateThrottle = function() {
					
					// get throttle path length and set dasharray
					var myThrottlePath = $scope.myThrottlePathS;
					var throttleDasharrayPathLength = Math.round(myThrottlePath.getTotalLength());
					$scope.throttleDasharray = throttleDasharrayPathLength;	
					
					var myThrottle = $scope.data.Car.REFERENCE.Gauge.Throttle.ValueCurrent.Value;
                    $scope.throttlePct = throttleDasharrayPathLength + ((myThrottle / 100) * throttleDasharrayPathLength);
					$scope.throttleTextOpacity = 0.0;
					if ($scope.showPedalText) { 
					    $scope.throttleNumber = myThrottle;
                        $scope.throttleTextOpacity = 0.55;						
					}

                    // F1 compteur
                    if ($scope.showF1Compteur)	{
                        $scope.throttlePctF1 = myThrottle;
						$scope.throttleOpacityContF1 = 1.0;
						$scope.throttleOpacityBkgdF1 = 0.25;
						$scope.throttleOpacityFillF1 = 0.99;

                        // pedal text
                        $scope.throttleTextOpacityF1 = 0.0;
						if ($scope.showPedalText) { 
							$scope.throttleNumberF1 = myThrottle;
							$scope.throttleTextOpacityF1 = 0.5;				
						}

                        // move throttle down a bit if clutch is hidden
						if ($scope.showClutchF1Compteur) { $scope.throttleTopF1 = 61; }
						else { $scope.throttleTopF1 = 65; }					
				    }

				};
				
				
				// -------------------------------------------------------------
				// -- Brake Arc and Label --------------------------------------
				// -------------------------------------------------------------
				
				// update the brake
				$scope.UpdateBrake = function() {
					
					// get brake path length and set dasharray
					var myBrakePath = $scope.myBrakePathS;
					var brakeDasharrayPathLength = Math.round(myBrakePath.getTotalLength());
					$scope.brakeDasharray = brakeDasharrayPathLength;	
					
					var myBrake = $scope.data.Car.REFERENCE.Gauge.Brake.ValueCurrent.Value;
                    $scope.brakePct = brakeDasharrayPathLength - ((myBrake / 100) * brakeDasharrayPathLength);
					$scope.brakeTextOpacity = 0.0;
					if ($scope.showPedalText) { 
					    $scope.brakeNumber = myBrake;
                        $scope.brakeTextOpacity = 0.55;						
					}

                    // F1 compteur
                    if ($scope.showF1Compteur)	{
                        $scope.brakePctF1 = myBrake;
						$scope.brakeOpacityContF1 = 1.0;
						$scope.brakeOpacityBkgdF1 = 0.15;
						$scope.brakeOpacityFillF1 = 0.65;
						
						// pedal text
                        $scope.brakeTextOpacityF1 = 0.0;
						if ($scope.showPedalText) { 
							$scope.brakeNumberF1 = myBrake;
							$scope.brakeTextOpacityF1 = 0.5;						
						}
						
						// move brake down a bit if clutch is hidden
						if ($scope.showClutchF1Compteur) { $scope.brakeTopF1 = 68.5; }
						else { $scope.brakeTopF1 = 73; }
				    }

				};
				
				// -------------------------------------------------------------
				// -- Clutch Arc and Label -------------------------------------
				// -------------------------------------------------------------
				
				// update the clutch
				$scope.UpdateClutch = function() {
					
					// get clutch path length and set dasharray
					var myClutchPath = $scope.myClutchPathS;
					var clutchDasharrayPathLength = Math.round(myClutchPath.getTotalLength());
					$scope.clutchDasharray = clutchDasharrayPathLength;	
					
					var myClutch = 100 - $scope.data.Car.REFERENCE.Gauge.Clutch.ValueCurrent.Value;
                    $scope.clutchPct = clutchDasharrayPathLength + ((myClutch / 100) * clutchDasharrayPathLength);
                    $scope.clutchTextOpacity = 0.0;
					if ($scope.showPedalText) { 
					    $scope.clutchNumber = myClutch;
                        $scope.clutchTextOpacity = 0.55;						
					}
                     
                    // F1 compteur
                    if ($scope.showF1Compteur)	{
                        $scope.clutchPctF1 = myClutch;
						$scope.clutchOpacityContF1 = 1.0;
						$scope.clutchOpacityBkgdF1 = 0.15;
						$scope.clutchOpacityFillF1 = 0.65;
						
						// pedal text
                        $scope.clutchTextOpacityF1 = 0.0;
						if ($scope.showPedalText) { 
							$scope.clutchNumberF1 = myClutch;
							$scope.clutchTextOpacityF1 = 0.5;						
						}
						
						// hide clutch
						if (!$scope.showClutchF1Compteur) { 
						    $scope.clutchOpacityContF1 = 0.0;
						    $scope.clutchOpacityBkgdF1 = 0.0;
						    $scope.clutchOpacityFillF1 = 0.0;
						    $scope.clutchTextOpacityF1 = 0.0;
						}
				    }

				};  
				
				// -------------------------------------------------------------
				// -- Lap Time -------------------------------------------------
				// -------------------------------------------------------------
				
				/*
				#####################################################################
				### Accurate 'current lap time' is found in 'ibt' and 'live' data
				### Replay lap time needs to be estimated
				###	Replay lap time will have a few limitations:
				###	    will only start when you cross the start/finish line
				###		will always be off a few tenths compared to live or ibt data
				###		lap time count breaks if you rewind past the start/finish line
				#####################################################################
				*/
				
				// update lap time
				$scope.myNextLap = 0;
				$scope.lapStartTime=null;
				$scope.updateLapTime = function() {	                                
					
					var myLapTime = $scope.data.Car.REFERENCE.LapTime.Current.Value;
					var myIsReplay = $scope.data.Session.IsReplay.Value;					
					$scope.lapTimeOpacity = 0.0;
					
					if (myIsReplay) {
						
						var myCurrentLap = $scope.data.Car.REFERENCE.Lap.Value;
						var myReplaySessionTime = $scope.data.Session.TimeElapsed.Value;
						
						// check next lap -- if replay jumps a few laps, reset myNextLap
						if ($scope.myNextLap < myCurrentLap || $scope.myNextLap > myCurrentLap + 1) {
						    $scope.myNextLap = myCurrentLap;
						}
						
						// these two vars will be equal at start of new lap 
						if (myCurrentLap == $scope.myNextLap) { 
							
							// reset lap start time
						    $scope.lapStartTime = myReplaySessionTime;
							
							// increment next lap
						    $scope.myNextLap = myCurrentLap + 1;	
						}
						
						//show lap time						
						if ($scope.showLapTime) {
							$scope.lapTimeOpacity = 0.65;	
                            $scope.lapTime = myReplaySessionTime - $scope.lapStartTime;							
						}
					}
                    else {
						
						// show lap time						
						if ($scope.showLapTime) {
							$scope.lapTimeOpacity = 0.65;
							$scope.lapTime = myLapTime;
						}						
					}
					
				};
				
				
				// -------------------------------------------------------------
				// -- Arc Functions --------------------------------------------
				// -------------------------------------------------------------
				
				/* These 2 functions were found at:
				 * http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
				 */
				$scope.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
					var angleInRadians = (angleInDegrees) * Math.PI / 180.0;

					return {
					  x: centerX + (radius * Math.cos(angleInRadians)),
					  y: centerY + (radius * Math.sin(angleInRadians))
					};
				}
				
				$scope.describeArc = function (centerX, centerY, radius, startAngle, endAngle){

				    var start = $scope.polarToCartesian(centerX, centerY, radius, endAngle);
				    var end = $scope.polarToCartesian(centerX, centerY, radius, startAngle);
				  
				    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

				    var d = [
					    "M", start.x, start.y,
					    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
				    ].join(" ");

				    return d;
				}

				// set the desired flags -- 0,1 for clockwise -- 1,0 for counter-clockwise 
				$scope.describeArcFlags = function (centerX, centerY, radius, startAngle, endAngle, largeArcFlag, sweepFlag){

				    var start = $scope.polarToCartesian(centerX, centerY, radius, endAngle);
				    var end = $scope.polarToCartesian(centerX, centerY, radius, startAngle);

				    var d = [
					    "M", start.x, start.y,
					    "A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y
				    ].join(" ");

				    return d;
				}
				
				
				// -------------------------------------------------------------
				// -- What browser Function ------------------------------------
				// -------------------------------------------------------------

                // Edge returns 'Chrome'
				// https://stackoverflow.com/questions/10505966/determine-what-browser-being-used-using-javascript
                $scope.getBrowser = function () {
				  if( navigator.userAgent.indexOf("Chrome") != -1 ) {
					return "Chrome";
				  } else if( navigator.userAgent.indexOf("Opera") != -1 ) {
					return "Opera";
				  } else if( navigator.userAgent.indexOf("Firefox") != -1 ) {
					return "Firefox";
				  } else {
					return "unknown";
				  }
				}		
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
				$scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
				$scope.showF1Compteur = sraDispatcher.getBoolean($scope.sraArgsSHOWF1COMPTEUR, $attrs.sraArgsShowF1Compteur, $scope.showF1Compteur);

				if ($scope.showF1Compteur) {
				    $scope.showSteeringWheel = false;
				    $scope.showGforceMapAndDot = false;
				    $scope.gforceMax = 3;  
				    $scope.showRPMLines = true;
				    $scope.showPedalText = true;
				    $scope.showLapTime = true;
				    $scope.showCarImage = true;
				    $scope.showClutchF1Compteur = false;
				}

                $scope.showClutchF1Compteur = sraDispatcher.getBoolean($scope.sraArgsSHOWCLUTCHF1COMPTEUR, $attrs.sraArgsShowClutchF1Compteur, $scope.showClutchF1Compteur);
				
                /** your code goes here **/					
				
		        // add sim telemetry				
				$attrs.sraArgsData += ";Car/REFERENCE/LongitudeAcceleration/GF";
				$attrs.sraArgsData += ";Car/REFERENCE/LatitudeAcceleration/GF";	
				$attrs.sraArgsData += ";Car/REFERENCE/Gauge/Tachometer/ValueCurrent";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/Tachometer/Minimum";
				$attrs.sraArgsData += ";Car/REFERENCE/Gauge/Tachometer/Maximum";				
				$attrs.sraArgsData += ";Car/REFERENCE/Gauge/Tachometer/MajorIncrement";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/Tachometer/Multiplier";				
				$attrs.sraArgsData += ";Car/REFERENCE/Gauge/Speedometer/ValueCurrent";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/Speedometer/ValueCurrent/KPH";				
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/Gear/ValueCurrent";
                $attrs.sraArgsData += ";Car/REFERENCE/Gauge/Steering/ValueCurrent/DEG";				
				$attrs.sraArgsData += ";Car/REFERENCE/Gauge/Throttle/ValueCurrent";
				$attrs.sraArgsData += ";Car/REFERENCE/Gauge/Brake/ValueCurrent";		
				$attrs.sraArgsData += ";Car/REFERENCE/Gauge/Clutch/ValueCurrent";	
                $attrs.sraArgsData += ";Car/REFERENCE/ImageUrl";
				$attrs.sraArgsData += ";Car/REFERENCE/LapTime/Current";
                $attrs.sraArgsData += ";Session/Replay";
				$attrs.sraArgsData += ";Session/IsReplay";
				$attrs.sraArgsData += ";Car/REFERENCE/Lap";
                $attrs.sraArgsData += ";Session/TimeElapsed";

				// watch for changes, then call function
				$scope.$watch("data.Car.REFERENCE.LongitudeAcceleration.GF.Value", $scope.MoveDotAndUpdateLabels);
				$scope.$watch("data.Car.REFERENCE.LatitudeAcceleration.GF.Value", $scope.MoveDotAndUpdateLabels);
				$scope.$watch("data.Car.REFERENCE.Gauge.Tachometer.ValueCurrent.Value", $scope.UpdateRPM);
				$scope.$watch("data.Car.REFERENCE.Gauge.Tachometer.Minimum.Value", $scope.buildScales);
				$scope.$watch("data.Car.REFERENCE.Gauge.Tachometer.Maximum.Value", $scope.buildScales);				
				$scope.$watch("data.Car.REFERENCE.Gauge.Tachometer.MajorIncrement.Value", $scope.buildScales);
				$scope.$watch("data.Car.REFERENCE.Gauge.Tachometer.Multiplier.Value", $scope.buildScales);
				$scope.$watch("data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.Value", $scope.UpdateSpeed);
				$scope.$watch("data.Car.REFERENCE.Gauge.Speedometer.ValueCurrent.KPH.Value", $scope.UpdateSpeed);
				$scope.$watch("data.Car.REFERENCE.Gauge.Gear.ValueCurrent.Value", $scope.UpdateGear);
				$scope.$watch("data.Car.REFERENCE.Gauge.Steering.ValueCurrent.DEG.Value", $scope.UpdateSteeringWheel);
				$scope.$watch("data.Car.REFERENCE.Gauge.Throttle.ValueCurrent.Value", $scope.UpdateThrottle);
				$scope.$watch("data.Car.REFERENCE.Gauge.Brake.ValueCurrent.Value", $scope.UpdateBrake);
				$scope.$watch("data.Car.REFERENCE.Gauge.Clutch.ValueCurrent.Value", $scope.UpdateClutch);
				$scope.$watch("data.Car.REFERENCE.LapTime.Current.Value", $scope.updateLapTime);
				$scope.$watch('data.Session.Replay.Value', $scope.MoveDotAndUpdateLabels);
				$scope.$watch('data.Session.IsReplay.Value', $scope.updateLapTime);
				$scope.$watch("data.Car.REFERENCE.Lap.Value", $scope.updateLapTime);
				$scope.$watch("data.Session.TimeElapsed.Value", $scope.updateLapTime);
				
				// get path length for curved text
				$scope.myGforcePathS = $element[0];
				$scope.myGforcePathS = $scope.myGforcePathS.querySelector('.myGforcePathFill');
				$scope.myRPMPathS = $element[0];
				$scope.myRPMPathS = $scope.myRPMPathS.querySelector('.myRPMPathFill');
				$scope.myThrottlePathS = $element[0];
				$scope.myThrottlePathS = $scope.myThrottlePathS.querySelector('.myThrottlePathFill');
				$scope.myBrakePathS = $element[0];
				$scope.myBrakePathS = $scope.myBrakePathS.querySelector('.myBrakePathFill');
				$scope.myClutchPathS = $element[0];				
				$scope.myClutchPathS = $scope.myClutchPathS.querySelector('.myClutchPathFill');				

                //show major numbers for F1 compteur
                $scope.tickNumberOpacity = 0.0;
                if ($scope.showF1Compteur) {
                    $scope.tickNumberOpacity = 0.7;
                }
                
                //show major ticks
                $scope.tickOpacity = 0.0;
                if ($scope.showRPMLines) {
                    $scope.tickOpacity = 0.35;
                }
                
                // -------------------------------------------------------------
                // -- Old Style F1 Compteur ------------------------------------
                // -------------------------------------------------------------
                
                $scope.F1StyleOpacity = 1.0;
                if ($scope.showF1Compteur) {
                    $scope.F1StyleOpacity = 0.0; // hide pedal arcs
                }

                // calculate the gforce arc paths
                $scope.gforcePathFillBkgd = $scope.describeArc(240,240,212,380,420);
                $scope.gforcePathFill = $scope.describeArc(240,240,212,380,420); 
                $scope.gforcePathNumber = $scope.describeArc(240,240,217,374,414);
                
                // calculate the rpm arc paths
                $scope.rpmPathStroke = $scope.describeArc(240,240,193,120,420);
                $scope.rpmPathFillBkgd = $scope.describeArc(240,240,183,120,420);
                $scope.rpmPathFill = $scope.describeArc(240,240,183,120,420);
                $scope.rpmPathx1000 = $scope.describeArc(240,240,188,166,466);
                
                
                // -------------------------------------------------------------
                // -- RPM x1000Label -------------------------------------------
                // -------------------------------------------------------------
                
                $scope.tapepath = $scope.describeArc(240,240,177,268,275);
                $scope.steeringTapeOpacity = 0.0;
                if($scope.showSteeringWheel) { $scope.steeringTapeOpacity = 0.7; }

                // calculate the throttle arc paths         
                $scope.throttlePathFillBkgd = $scope.describeArc(240,240,212,160,245); 
                $scope.throttlePathFill = $scope.describeArc(240,240,212,160,245);
                $scope.throttlePathNumber = $scope.describeArcFlags(240,240,204,275,185,0,1);

                // calculate the brake arc paths
                $scope.brakePathFillBkgd = $scope.describeArc(240,240,212,295,380);
                $scope.brakePathFill = $scope.describeArc(240,240,212,295,380);
                $scope.brakePathNumber = $scope.describeArcFlags(240,240,204,415,325,0,1);             
                
                // calculate the clutch arc paths
                $scope.clutchPathFillBkgd = $scope.describeArc(240,240,212,120,160);
                $scope.clutchPathFill = $scope.describeArc(240,240,212,120,160);
                $scope.clutchPathNumber = $scope.describeArc(240,240,217,112,152,0,1);
                
                
                // -------------------------------------------------------------
                // -- Car Image ------------------------------------------------
                // -------------------------------------------------------------
                
                $scope.carImageOpacity = 0.0;
                if ($scope.showCarImage && !$scope.showF1Compteur) {
                    $scope.carImageOpacity = 0.75;
                }

                $scope.lapTimePath = $scope.describeArcFlags(240,240,204,320,620,0,1);

                //Sad we have to do this
                if ($scope.getBrowser() == "Firefox") {
                    $scope.rpmx1000url = "http://" + document.location.hostname + "/SIMRacingApps/apps/WidgetLoader?widget=Compteur#rpmCurve"+$scope.$id;
                    $scope.gforceurl = "http://" + document.location.hostname + "/SIMRacingApps/apps/WidgetLoader?widget=Compteur#gforceCurve"+$scope.$id;
                    $scope.throttleurl = "http://" + document.location.hostname + "/SIMRacingApps/apps/WidgetLoader?widget=Compteur#throttleCurve"+$scope.$id;
                    $scope.brakeurl = "http://" + document.location.hostname + "/SIMRacingApps/apps/WidgetLoader?widget=Compteur#brakeCurve"+$scope.$id;
                    $scope.clutchurl = "http://" + document.location.hostname + "/SIMRacingApps/apps/WidgetLoader?widget=Compteur#clutchCurve"+$scope.$id;
					$scope.laptimeurl = "http://" + document.location.hostname + "/SIMRacingApps/apps/WidgetLoader?widget=Compteur#lapTimeCurve"+$scope.$id;
                }
                else {
                    $scope.rpmx1000url = '#rpmCurve'+$scope.$id;
                    $scope.gforceurl = '#gforceCurve'+$scope.$id;
                    $scope.throttleurl = '#throttleCurve'+$scope.$id;
                    $scope.brakeurl = '#brakeCurve'+$scope.$id;
					$scope.clutchurl = '#clutchCurve'+$scope.$id;
                    $scope.laptimeurl = '#lapTimeCurve'+$scope.$id;
                }               

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));
                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher				
            }
        };
    }]);

    return self;
});
