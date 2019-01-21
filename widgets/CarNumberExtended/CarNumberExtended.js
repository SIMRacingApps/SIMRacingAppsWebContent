'use strict';
/**
 * This widget displays the car number along with the drivers name.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-car-number-extended data-sra-car-number-extended="REFERENCE"&gt;&lt;/sra-car-number-extended&gt;<br />
 * </b>
 * <img src="../widgets/CarNumberExtended/icon.png" />
 * 
 * @ngdoc directive
 * @name sra-car-number-extended
 * @param {carIdentifier} data-sra-car-number-extended The <a href="../JavaDoc/com/SIMRacingApps/Session.html#getCar-java.lang.String-" target="_blank">Car Identifier</a> to get the number from. Defaults to REFERENCE.
 * @param show-short-name Set to false to show the long name. Default is true.
 * @param {function} data-sra-args-on-click (Optional) A function to call when this widget is clicked.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 100.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2019 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','widgets/CarNumber/CarNumber','css!widgets/CarNumberExtended/CarNumberExtended'],
function(SIMRacingApps) {

    var self = {
        name:            "sraCarNumberExtended",
        url:             'CarNumberExtended',
        template:        'CarNumberExtended.html',
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
            scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                $scope.showShortName   = true;
                $scope.sraOnClick      = "";
                $scope.clickedState    = 'none'; //either none or clicked
                $scope.getClickedState = function() { return $scope.clickedState; };
                $scope.setClickedState = function(state) { $scope.clickedState = state || 'none'; };
                
                $scope.sraCarNumber    = "";
                $scope.sraCarDriverName= "";
                
                $scope.onClickListener = function() {
                    $scope.sraCarNumber = $scope.data.Car[$scope.value].Number.ValueFormatted;
                    $scope.sraCarDriverName = $scope.data.Car[$scope.value].DriverName.ValueFormatted;
                    
                    if ($scope.$parent[$scope.sraOnClick] && angular.isFunction($scope.$parent[$scope.sraOnClick]))
                        $scope.$parent[$scope.sraOnClick]($scope,$scope.data.Car[$scope.value].Number.ValueFormatted);
                }
                
                //load translations, if you have any un-comment this
//                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
//                    $scope.translations = sraDispatcher.getTranslation(path);
//                });
                /** your code goes here **/
                
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs.sraArgsCarNumberExtended, $attrs[self.name], $attrs.sraArgsValue, "REFERENCE");
                $scope.showShortName = sraDispatcher.getBoolean($scope.sraArgsSHOWSHORTNAME,$attrs.sraArgsShowShortName,$scope.showShortName);
                $scope.sraOnClick = $attrs.sraArgsOnClick;
                
                /** your code goes here **/
                $attrs.sraArgsData += ";Car/"+$scope[self.name]+"/Number";
                $attrs.sraArgsData += ";Car/"+$scope[self.name]+"/DriverName";
                $attrs.sraArgsData += ";Car/"+$scope[self.name]+"/DriverNameShort";
                $attrs.sraArgsData += ";Car/"+$scope[self.name]+"/StatusClass";
                $attrs.sraArgsData += ";Car/"+$scope[self.name]+"/ClassColor";
                $attrs.sraArgsData += ";Session/NumberOfCarClasses";
                $attrs.sraArgsData += ";Session/DiffCars/LEADER/"+$scope[self.name];


                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                sraDispatcher.onClick($scope,$element,$scope.onClickListener);
                
                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
