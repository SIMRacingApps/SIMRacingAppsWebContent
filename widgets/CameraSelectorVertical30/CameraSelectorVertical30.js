'use strict';
/**
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-camera-selector-Vertical30&gt;&lt;/sra-camera-selector-Vertical30&gt;<br />
 * </b>
 * <img src="../widgets/CameraSelectorVertical30/icon.png" alt="Image goes here"/>
 * @ngdoc directive
 * @name sra-camera-selector-vertical30
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 300.
 * @author Jeffrey Gilliam
 * @since 1.7
 * @copyright Copyright (C) 2015 - 2018 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps'
        ,'css!widgets/CameraSelectorVertical30/CameraSelectorVertical30'
        ,'widgets/CarSelector64/CarSelector64'
        ,'widgets/ReplayControl/ReplayControl'],
function(SIMRacingApps) {

    var self = {
        name:            "sraCameraSelectorVertical30",
        url:             'CameraSelectorVertical30',
        template:        'CameraSelectorVertical30.html',
        defaultWidth:    480,
        defaultHeight:   880,
        defaultInterval: 300   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$rootScope', '$timeout',
    function(sraDispatcher,   $filter,   $rootScope,   $timeout) {
        return {
            restrict:    'EA',
            scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName    = self.name;
                $scope.defaultWidth     = self.defaultWidth;
                $scope.defaultHeight    = self.defaultHeight;
                $scope.defaultInterval  = self.defaultInterval;

                $scope.translations     = {};
                $scope.clickDelay       = 2000;
                $scope.numRows          = 10;
                $scope.numColumns       = 3;
                $scope.rows             = [1,2,3,4,5,6,7,8,9,10];
                $scope.cols             = [1,2,3];
                $scope.sraButtons       = {};
                $scope.clickedStatus    = 'N';
                $scope.currentCamera    = '';

                //load translations, if you have any comment out if you do not so it will not look for them
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });

                $scope.sendCommand = function(command) {
                    sraDispatcher.sendCommand(command);
                    console.log(command);
                };
                
                $scope.updateText = function(value) {
                    var row=1;
                    var col=1;
                    
                    console.log('updateText() called = '+$scope.data.Session.Cameras.Value);
                    $scope.sraButtons = {};

                    //for formatting buttons
                    if (false) {
                        $scope.sraButtons = {
                        "row1-col1": { text: "empty", camera: "1" },
                        "row2-col1": { text: "empty", camera: "2" },
                        "row3-col1": { text: "empty", camera: "3" },
                        "row4-col1": { text: "empty", camera: "4" },
                        "row5-col1": { text: "empty", camera: "5" },
                        "row6-col1": { text: "empty", camera: "6" },
                        "row7-col1": { text: "empty", camera: "7" },
                        "row8-col1": { text: "empty", camera: "8" },
                        "row9-col1": { text: "empty", camera: "9" },
                        "row10-col1": { text: "empty", camera: "10" },
                        "row1-col2": { text: "empty", camera: "11" },
                        "row2-col2": { text: "empty", camera: "12" },
                        "row3-col2": { text: "empty", camera: "13" },
                        "row4-col2": { text: "empty", camera: "14" },
                        "row5-col2": { text: "empty", camera: "15" },
                        "row6-col2": { text: "empty", camera: "16" },
                        "row7-col2": { text: "empty", camera: "17" },
                        "row8-col2": { text: "empty", camera: "18" },
                        "row9-col2": { text: "empty", camera: "19" },
                        "row10-col2": { text: "empty", camera: "20" },
                        "row1-col3": { text: "empty", camera: "21" },
                        "row2-col3": { text: "empty", camera: "22" },
                        "row3-col3": { text: "empty", camera: "23" },
                        "row4-col3": { text: "empty", camera: "24" },
                        "row5-col3": { text: "empty", camera: "25" },
                        "row6-col3": { text: "empty", camera: "26" },
                        "row7-col3": { text: "empty", camera: "27" },
                        "row8-col3": { text: "empty", camera: "28" },
                        "row9-col3": { text: "empty", camera: "29" },
                        "row10-col3": { text: "empty", camera: "30" }
                        };
                    }
                    else {
                        //load the cameras
                        for (var i=0; $scope.data.Session.Cameras.Value != '' 
                                   && i < $scope.data.Session.Cameras.Value.length 
                                   && row <= $scope.numRows 
                                   && col <= $scope.numColumns; 
                             i++
                        ) {
                            var camera = $scope.data.Session.Cameras.Value[i];
                            
                            var buttonIdx = 'row'+row+'-col'+col;
                            
                            $scope.sraButtons[buttonIdx] = {
                                "text":  sraDispatcher.getDefined($scope.translations[camera],camera),
                                "camera": camera
                            };
                            
                            if (row == $scope.numRows) {
                                row = 1;
                                col++;
                            }
                            else
                                row++;
                        }
                    }   
                    
                    //call updateCurrent. The camera's may not have loaded when it update it.
                    $scope.updateCurrent();
                };
                
                $scope.updateCurrent = function(value) {
                    console.log('updateCurrent() called = ('+$scope.data.Session.Camera.Value+')');
                    $scope.currentCamera = $scope.data.Session.Camera.Value;
                };
                
                $scope.onButtonClick = function(scope,value,buttonIdx) {
                    console.log('CameraSelector.onButtonClick('+buttonIdx+') = '+$scope.sraButtons[buttonIdx].camera);
                    scope.clickedStatus = 'Y';
                    
                    $scope.sendCommand("Session/setCamera/" + $scope.sraButtons[buttonIdx].camera);

                    $timeout(function(scope) {
                        scope.clickedStatus = 'N';
                    }, $scope.clickDelay,null,scope);
                };

                $scope.onClickCarSelector = function($clickedScope,name) {
                    console.log("Spectator.setReferenceCar("+name+")");
                    $clickedScope.setClickedState('clicked');
                    sraDispatcher.sendCommand("Session/setReferenceCar/"+name);
                    //delay a little, then clear the clicked state.
                    $timeout(function () {
                        $clickedScope.setClickedState('none');
                    }, $scope.clickDelay);
                };
                
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                
                /** your code goes here **/
                $attrs.sraArgsData += ";Session/Cameras";
                $attrs.sraArgsData += ";Session/Camera";


                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                $scope.$watch('data.Session.Cameras.Value',$scope.updateText);
                $scope.$watch('data.Session.Camera.Value',$scope.updateCurrent);
            }
        };
    }]);

    return self;
});
