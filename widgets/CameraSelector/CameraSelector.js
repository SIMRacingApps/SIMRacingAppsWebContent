'use strict';
/**
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-camera-selector&gt;&lt;/sra-camera-selector&gt;<br />
 * </b>
 * <img src="../widgets/CameraSelector/icon.png" alt="Image goes here"/>
 * @ngdoc directive
 * @name sra-camera-selector
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 300.
 * @author Jeffrey Gilliam
 * @since 1.3
 * @copyright Copyright (C) 2015 - 2023 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps'
        ,'css!widgets/CameraSelector/CameraSelector'
        ,'widgets/CarSelector64/CarSelector64'
        ,'widgets/ReplayControl/ReplayControl'],
function(SIMRacingApps) {

    var self = {
        name:            "sraCameraSelector",
        url:             'CameraSelector',
        template:        'CameraSelector.html',
        defaultWidth:    800,
        defaultHeight:   480,
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
                $scope.numColumns       = 2;
                $scope.rows             = [1,2,3,4,5,6,7,8,9,10];
                $scope.cols             = [1,2];
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
/**/
$scope.sraButtons = {
"row1-col1": "empty",
"row2-col1": "empty",
"row3-col1": "empty",
"row4-col1": "empty",
"row5-col1": "empty",
"row6-col1": "empty",
"row7-col1": "empty",
"row8-col1": "empty",
"row9-col1": "empty",
"row10-col1": "empty",
"row11-col1": "empty",
"row12-col1": "empty",
"row1-col2": "empty",
"row2-col2": "empty",
"row3-col2": "empty",
"row4-col2": "empty",
"row5-col2": "empty",
"row6-col2": "empty",
"row7-col2": "empty",
"row8-col2": "empty",
"row9-col2": "empty",
"row10-col2": "empty",
"row11-col2": "empty",
"row12-col2": "empty"
};
/**/
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
