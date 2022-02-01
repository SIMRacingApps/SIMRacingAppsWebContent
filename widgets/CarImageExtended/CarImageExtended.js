'use strict';
/**
 * This widget displays the car image if the SIM provides one with the driver's name under it.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-car-image-extended&gt;&lt;/sra-car-image-extended&gt;<br />
 * </b>
 * <img src="../widgets/CarImageExtended/icon.png" />
 * @ngdoc directive
 * @name sra-car-image-extended
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Jeffrey Gilliam
 * @since 16.0
 * @copyright Copyright (C) 2015 - 2022 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/CarImageExtended/CarImageExtended'
],function(SIMRacingApps) {

    var self = {
        name:            "sraCarImageExtended",
        url:             'CarImageExtended',
        template:        'CarImageExtended.html',
        defaultWidth:    800,
        defaultHeight:   480,
        defaultInterval: 1000   //initialize with the default interval
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

                $scope.showShortName   = false;
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
                
                //load translations
//                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
//                    $scope.translations = sraDispatcher.getTranslation(path);
//                });

            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "REFERENCE");
                $scope.showShortName = sraDispatcher.getBoolean($scope.sraArgsSHOWSHORTNAME,$attrs.sraArgsShowShortName,$scope.showShortName);
                $scope.sraOnClick = $attrs.sraArgsOnClick;

                /** your code goes here **/
                console.log("CarImageExtended="+$scope[self.name]);
                $attrs.sraArgsData += ";Car/"+$scope[self.name]+"/ImageUrl";
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

                /** watches go here **/
            }
        };
    }]);

    return self;
});
