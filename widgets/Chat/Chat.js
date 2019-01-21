'use strict';
/**
 * The Chat Widget sends predefined messages with a click of a button.
 * You can also send private messages directly to a specific car.
 * You can also select LEADER, AHEAD, BEHIND, or REPLY to let the system determine the car to send to.
 * Just click the button or car first, then click the text. 
 * Here is a list of the predefined messages.
 * <dl>
 *      <dt>ALL ME</dt><dd>[#[CARNUMBER]] All Me</dd>
 *      <dt>GOOD LUCK</dt><dd>[#[CARNUMBER]] Good Luck from SIMRacingApps.com</dd>
 *      <dt>GOOD RACE</dt><dd>[#[CARNUMBER]] Good Race from SIMRacingApps.com</dd>
 *      <dt>GOOD WIN - Sends to Leader by default.</dt><dd>/LEADER [#[CARNUMBER]] Good Win</dd>
 *      <dt>HELLO</dt><dd>[#[CARNUMBER]] Hello</dd>
 *      <dt>LOL</dt><dd>[#[CARNUMBER]] LoL</dd>
 *      <dt>NO PROBLEM</dt><dd>[#[CARNUMBER]] No Problem</dd>
 *      <dt>OK</dt><dd>[#[CARNUMBER]] Ok</dd>
 *      <dt>PASS LEFT - Sends to Car BEHIND by default.</dt><dd>/RL-1 [#[CARNUMBER]] Pass Left</dd>
 *      <dt>PASS RIGHT - Sends to Car BEHIND by default.</dt><dd>/RL-1 [#[CARNUMBER]] Pass Right</dd>
 *      <dt>PITTING IN</dt><dd>[#[CARNUMBER]] Pitting In</dd>
 *      <dt>PITTING OUT</dt><dd>[#[CARNUMBER]] Pitting Out</dd>
 *      <dt>RACING DEAL</dt><dd>[#[CARNUMBER]] Racing Deal</dd>
 *      <dt>SORRY</dt><dd>[#[CARNUMBER]] Sorry</dd>
 *      <dt>SWITCH IN 1</dt><dd>[#[CARNUMBER]] Switch In 1</dd>
 *      <dt>SWITCH IN 3</dt><dd>[#[CARNUMBER]] Switch In 3</dd>
 *      <dt>THANKS - Sends to Car BEHIND by default.</dt><dd>/RL-1 [#[CARNUMBER]] Thanks</dd>
 *      <dt>YOU'RE WELCOME - Sends to the Car AHEAD by default.</dt><dd>/RL1 [#[CARNUMBER]] You're Welcome</dd>
 *      <dt>@ALLTEAMS</dt><dd>@transmit ALLTEAMS</dd>
 *      <dt>@DRIVERS</dt><dd>@transmit DRIVERS</dd>
 *      <dt>@TEAM</dt><dd>@transmit TEAM</dd>
 *      <dt>@CLUB</dt><dd>@transmit CLUB</dd>
 *      <dt>@RACE CONTROL</dt><dd>@transmit RACECONTROL</dd>
 *      <dt>@PRIVATE</dt><dd>@transmit PRIVATE</dd>
 *      <dt>@ADD CH - adds a radio channel using the selected car number. CHxxx</dt><dd>@add CH[CARORME]</dd>
 *      <dt>JOIN ME @CH - Invite others to join your channel</dt><dd>[#[CARNUMBER]] Join Me @ADD CH[CARNUMBER]</dd>
 *      <dt>@CH</dt><dd>@transmit CH[CARORME]</dd>
 *      <dt>?</dt><dd>[#[CARNUMBER]] ?</dd>
 * </dl>
 * The default messages can be changed in the settings.txt file using the following variables.
 * There are 6 rows and 4 columns that you can reference for 24 possible predefined messages.
 * The text is optional, and will use the default text if the button name is one of the predefined ones.
 * The predefined text puts your car number at the beginning of all messages.
 * <pre>
 *    chat-row1-col1-name = Button Name
 *    chat-row1-col1-text = Text To Send
 * </pre>
 * You can have multiple instances of chat with a different name. 
 * See the parameter data-sra-args-chat-instance.
 * Just replace the word "chat" in the variable to your instance name, in this example, "chat2".
 * <pre>
 *    chat2-row1-col1-name = Button Name
 *    chat2-row1-col1-text = Text To Send
 * </pre>
 * 
 * The text can also have variables embedded with it. The following variables are allowed.
 * <ul>
 *   <li>[CAR] - The car number that the message will be sent to.</li>
 *   <li>[CARORME] - The car number selected or ME if no car selected</li>
 *   <li>[CARNUMBER] - Your Car Number</li>
 *   <li>[DRIVERNAME] - Your Name</li>
 * </ul>
 * You can also embed any SendKeys sequence in the text. See <a href='../../../JavaDoc/com/SIMRacingApps/Util/SendKeys.html'>SendKeys</a>.
 * 
 * If the text begins with a slash, then the "word" following the slash will be used to send the message to that car identifier.
 * It will also accept "REPLY" as a car identifier to send the message to the last person to send you a private message.
 * If you have already selected a car to send to, then that car will override. Think of '/' as a way to define a default car.
 * As a convention, I also put a slash at the beginning of the name followed with the car number.  
 * For Example, Pass Left almost always applies to the car behind you. Why send to all cars?:
 * <pre>
 *    chat-row1-col1-name = /[CAR]<br />PASS LEFT
 *    chat-row1-col1-text = /RL-1 [#[CARNUMBER]] Pass Left
 * </pre>
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-chat&gt;&lt;/sra-chat&gt;<br />
 * </b>
 * <img src="../widgets/Chat/icon.png" alt="Image goes here"/>
 * @ngdoc directive
 * @name sra-chat
 * @param {string} data-sra-args-chat-instance The name of this instance for the settings.txt variable prefix. Defaults to "chat".
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2019 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/Chat/Chat','widgets/CarSelector64/CarSelector64'],
function(SIMRacingApps) {

    var self = {
        name:            "sraChat",
        url:             'Chat',
        template:        'Chat.html',
        defaultWidth:    800,
        defaultHeight:   480,
        defaultInterval: 500   //initialize with the default interval
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
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                $scope.translations     = {};
                $scope.clickDelay       = 2000;
                $scope.chatInstance     = 'chat';
                $scope.carClickedScope  = null;
                $scope.car              = "";
                $scope.rows             = [1,2,3,4,5,6];
                $scope.cols             = [1,2,3,4];
                $scope.sraButtonsOriginal={};
                $scope.sraButtons       = {};
                $scope.clickedStatus    = 'N';
                $scope.sraButtonDefaults= {
                    "row1-col1": "PASS LEFT",
                    "row2-col1": "PASS RIGHT",
                    "row3-col1": "NO PROBLEM",
                    "row4-col1": "SORRY",
                    "row5-col1": "ALL ME",
                    "row6-col1": "THANKS",

                    "row1-col2": "GOOD LUCK",
                    "row2-col2": "GOOD WIN",
                    "row3-col2": "RACING DEAL",
                    "row4-col2": "OK",
                    "row5-col2": "GOOD RACE",
                    "row6-col2": "YOU'RE WELCOME",

                    "row1-col3": "@ADD CH",
                    "row2-col3": "JOIN ME @CH",
                    "row3-col3": "LOL",
                    "row4-col3": "HELLO",
                    "row5-col3": "SWITCH IN 1",
                    "row6-col3": "SWITCH IN 3",

                    "row1-col4": "@CH",
                    "row2-col4": "@TEAM",
                    "row3-col4": "@CLUB",
                    "row4-col4": "@ALLTEAMS",
                    "row5-col4": "PITTING IN",
                    "row6-col4": "PITTING OUT",
                };

                $scope.updateVariables = function(button,defaultCar) {
                    if (button) {
                        var car  = $scope.car || defaultCar || "";
                        var name = $scope.sraButtonsOriginal[button].name;
                        var text = $scope.sraButtonsOriginal[button].text;
                        
                        while (name.indexOf("[CARORME]") >= 0)
                            name = name.replace("[CARORME]", $scope.car || $scope.data.Car.ME.Number.ValueFormatted);
                        while (name.indexOf("[CAR]") >= 0)
                            name = name.replace("[CAR]", car);
                        while (name.indexOf("[CARNUMBER]") >= 0)
                            name = name.replace("[CARNUMBER]", $scope.data.Car.ME.Number.ValueFormatted);
                        while (name.indexOf("[DRIVERNAME]") >= 0)
                            name = name.replace("[DRIVERNAME]",$scope.data.Car.ME.DriverName.ValueFormatted);

                        while (text.indexOf("[CARORME]") >= 0)
                            text = text.replace("[CARORME]", $scope.car || $scope.data.Car.ME.Number.ValueFormatted);
                        while (text.indexOf("[CAR]") >= 0)
                            text = text.replace("[CAR]", car);
                        while (text.indexOf("[CARNUMBER]") >= 0)
                            text = text.replace("[CARNUMBER]", $scope.data.Car.ME.Number.ValueFormatted);
                        while (text.indexOf("[DRIVERNAME]") >= 0)
                            text = text.replace("[DRIVERNAME]",$scope.data.Car.ME.DriverName.ValueFormatted);
                        
                        $scope.sraButtons[button].name = name;
                        $scope.sraButtons[button].text = text;
                    }
                };
                
                $scope.carClicked = function($clickedScope,car) {
                    if (car) {
                        console.log("Chat.carClicked("+car+")");
                        
                        //See if the car passed in is an alias and retrieve the actual car number
                        if ($scope.data.Car[car] && $scope.data.Car[car].Number)
                            car = $scope.data.Car[car].Number.ValueFormatted;
                        
                        //if a previous car was already selected, unselect it
                        if ($scope.carClickedScope && car != $scope.car) {
                            $scope.carClickedScope.setClickedState('none');
                        }
                        
                        if ($clickedScope.getClickedState() == 'clicked') {
                            $clickedScope.setClickedState('none');
                            $scope.carClickedScope  = null;
                            $scope.car              = "";
                        }
                        else {
                            $clickedScope.setClickedState('clicked');
                            $scope.carClickedScope  = $clickedScope;
                            $scope.car              = car;
                        }
                        
                        //now update all the buttons in case they are bound to the selected car
                        for (var v in $scope.sraButtonsOriginal) {
                            $scope.updateVariables(v,$scope.data.Car[$scope.sraButtonsOriginal[v].car] ? $scope.data.Car[$scope.sraButtonsOriginal[v].car].Number.ValueFormatted : "");
                        }
                    }
                };
                
                $scope.onButtonClick = function(scope,value,button) {
                    console.log('Chat.onButtonClick('+button+') = '+$scope.car+' '+$scope.sraButtons[button].text);
                    if ($scope.sraButtons[button].name && $scope.sraButtons[button].text) {
                        scope.clickedStatus = 'Y';

                        var car  = $scope.car || $scope.sraButtonsOriginal[button].car;
                        
                        $scope.updateVariables(button,$scope.data.Car[car] ? $scope.data.Car[car].Number.ValueFormatted : "");
                        
                        
                        if (car 
                        &&  car != "ALL"                                           //all cars
                        &&  car != $scope.data.Car.ME.Number.ValueFormatted        //myself
                        &&  $scope.sraButtons[button].text.substring(0,1) != '@'   //radio commands
                        &&  $scope.sraButtons[button].text.substring(0,1) != '!'   //admin commands
                        &&  $scope.sraButtons[button].text.substring(0,1) != '#'   //pit commands
                        ) {
                            if (car == "REPLY") {
                                $scope.sendCommand("Session/setChatReply/" + $scope.sraButtons[button].text);
                            }
                            else {
                                $scope.sendCommand("Car/" + car + "/setChat/" + $scope.sraButtons[button].text);
                            }
                        }
                        else {
                            $scope.sendCommand("Session/setChat/" + $scope.sraButtons[button].text);
                        }
                        
                        //unselect the car any time a button is clicked.
                        if ($scope.carClickedScope)
                            $scope.carClickedScope.setClickedState('none');
                        $scope.carClickedScope = null;
                        $scope.car = "";
                        
                        //now update all the buttons in case they are bound to the selected car
                        for (var v in $scope.sraButtonsOriginal) {
                            $scope.updateVariables(v,$scope.data.Car[$scope.sraButtonsOriginal[v].car] ? $scope.data.Car[$scope.sraButtonsOriginal[v].car].Number.ValueFormatted : "");
                        }
                        
                        $timeout(function(scope) {
                            scope.clickedStatus = 'N';
                        }, $scope.clickDelay,null,scope);
                    }
                };
                
                $scope.sendCommand = function(command) {
                    sraDispatcher.sendCommand(command);
                    console.log(command);
                };
                
                $scope.updateName = function(button,value) {
                    //if a non blank value is passed in, the user has overridden the button in the settings.txt file.
                    if (value && value !== 'undefined' && value !== '__default') {
                        $scope.sraButtonsOriginal[button].name = value;
                    }
                };
                
                $scope.updateText = function(button,value) {
                    //if a non blank value is passed in, the user has overridden the button in the settings.txt file.
                    if (value) {
                        
                        //if the text starts with a slash, parse the car identifier off and subscribe to it's number
                        if (value.substring(0,1) == '/') {
                            //take the next word and use it as the car identifier to send the text to
                            $scope.sraButtonsOriginal[button].car  = value.substring(1).split(" ")[0];
                            $scope.sraButtonsOriginal[button].text = value.substring($scope.sraButtonsOriginal[button].car.length+2);
                            
                            sraDispatcher.subscribe($scope,{
                                sraArgsData: "Car/"+$scope.sraButtonsOriginal[button].car+"/Number"
                            },self.defaultInterval);
                            
                            //Now watch for changes to this car and update the name
                            $scope.$watch(
                                    "data.Car['"+$scope.sraButtonsOriginal[button].car+"'].Number.ValueFormatted",
                                    new Function('newValue','oldValue','$scope','$scope.updateVariables("'+button+'",newValue);')
                            );
                        }
                        else {
                            $scope.sraButtonsOriginal[button].car  = "";
                            $scope.sraButtonsOriginal[button].text = value;
                            $scope.updateVariables(button,"");

                            $scope.$watch(
                                    "data.Car['ME'].Number.ValueFormatted",
                                    new Function('newValue','oldValue','$scope','$scope.updateVariables("'+button+'",newValue);')
                            );
                            $scope.$watch(
                                    "data.Car['ME'].DriverName.ValueFormatted",
                                    new Function('newValue','oldValue','$scope','$scope.updateVariables("'+button+'",newValue);')
                            );
                            $scope.$watch(
                                    "data.Car['LEADERCLASS'].Number.ValueFormatted",
                                    new Function('newValue','oldValue','$scope','$scope.updateVariables("'+button+'",newValue);')
                            );
                            $scope.$watch(
                                    "data.Car['RL1'].Number.ValueFormatted",
                                    new Function('newValue','oldValue','$scope','$scope.updateVariables("'+button+'",newValue);')
                            );
                            $scope.$watch(
                                    "data.Car['RL-1'].Number.ValueFormatted",
                                    new Function('newValue','oldValue','$scope','$scope.updateVariables("'+button+'",newValue);')
                            );
                        }
                    }
                };
                
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                $scope.chatInstance = sraDispatcher.getTruthy($scope.sraArgsCHATINSTANCE,$attrs.sraArgsChatInstance,"chat");
                
                /** your code goes here **/
                $attrs.sraArgsData += ";Car/ME/Number;Car/ME/DriverName";
                //These are buttons from CarSelector that I have enabled.
                $attrs.sraArgsData += ";Car/LEADERCLASS/Number";
                $attrs.sraArgsData += ";Car/RL1/Number";
                $attrs.sraArgsData += ";Car/RL-1/Number";

                for (var row=0; row < $scope.rows.length; row++) {
                    for (var col=0; col < $scope.cols.length; col++) {
                        var button = 'row'+$scope.rows[row]+'-col'+$scope.cols[col];
                        
                        $attrs.sraArgsData += ";Setting/"+$scope.chatInstance+"-"+button+"-name/__default;Setting/"+$scope.chatInstance+"-"+button+"-text";
                            
                        $scope.sraButtonsOriginal[button] = {};
                        $scope.sraButtonsOriginal[button].name = $scope.sraButtonDefaults[button] || "";
                        $scope.sraButtonsOriginal[button].text = "";  //This comes from the translations when it loads them
                        $scope.sraButtonsOriginal[button].car  = "";
                        
                        $scope.sraButtons[button] = {};
                        $scope.sraButtons[button].name = "";
                        $scope.sraButtons[button].text = "";
                        
                        $scope.$watch(
                                "data.Setting['"+$scope.chatInstance+"-"+button+"-name'].__default.ValueFormatted",
                                new Function('newValue','oldValue','$scope','$scope.updateName("'+button+'",newValue,$scope);')
                        );
                        $scope.$watch(
                                "data.Setting['"+$scope.chatInstance+"-"+button+"-text'].ValueFormatted",
                                new Function('newValue','oldValue','$scope','$scope.updateText("'+button+'",newValue,$scope);')
                        );
                    }
                }

                

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                //load translations, if you have any comment out if you do not so it will not look for them
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                    
                    //since the translations could load after the buttons have been sent from the server
                    //we need to update them if the button is not already assigned.
                    for (var button in $scope.sraButtonsOriginal) {
                        var name = $scope.sraButtonsOriginal[button].name;
                        if (name && !$scope.sraButtonsOriginal[button].text && $scope.translations[name]) {
                            $scope.updateName(button,$scope.translations[name].name);
                            $scope.updateText(button,$scope.translations[name].text);
                        }
                    }
                });

            }
        };
    }]);

    return self;
});
