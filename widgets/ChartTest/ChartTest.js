'use strict';
/**
 * This widget ...
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-chart-test&gt;&lt;/sra-chart-test&gt;<br />
 * </b>
 * <img src="../widgets/ChartTest/icon.png" alt="Image goes here"/>
 * @ngdoc directive
 * @name sra-chart-test
 * @param {type} data-sra-args-value A value that changes the widget's behavior...
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 16.0
 * @copyright Copyright (C) 2015 - 2023 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','angular-chart','css!widgets/ChartTest/ChartTest'],
function(SIMRacingApps) {

    var self = {
        name:            "sraChartTest",
        url:             'ChartTest',
        template:        'ChartTest.html',
        defaultWidth:    800,
        defaultHeight:   480,
        defaultInterval: 500   //initialize with the default interval
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

                //load translations, if you have any comment out if you do not so it will not look for them
                $scope.translations = {};
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });

                /** your code goes here **/

/* from github example, https://github.com/jtblin/angular-chart.js */
                //I'm putting these all in it's own name space
                $scope.chart_labels = ["January", "February", "March", "April", "May", "June", "July"];
                $scope.chart_series = ['Series A', 'Series B'];
                $scope.chart_data   = [
                        [65, 59, 80, 81, 56, 55, 40],
                        [28, 48, 40, 19, 86, 27, 90]
                    ];
                $scope.chart_onClick = function (points, evt) {
                        console.log(points, evt);
                    };
                $scope.chart_datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
                $scope.chart_options = {
                	      scales: {
                	        yAxes: [
                	          {
                	            id: 'y-axis-1',
                	            type: 'linear',
                	            display: true,
                	            position: 'left'
                	          },
                	          {
                	            id: 'y-axis-2',
                	            type: 'linear',
                	            display: true,
                	            position: 'right'
                	          }
                	        ]
                	      }
                	    };
            }]
            , link: function($scope,$element,$attrs) {

                //copy arguments to our scope. First if using attribute, second tag, else default to something.
                $attrs.sraArgsData = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");

                /** your code goes here **/
                $attrs.sraArgsData += ";Car/REFERENCE/Description";

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher

                /**watches go here **/
//                $scope.$watch("data.xxx.Value",function(value,oldvalue) {
//                });

            }
        };
    }]);

    return self;
});
