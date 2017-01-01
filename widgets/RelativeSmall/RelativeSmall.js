'use strict';
/**
 * This widget displays the cars that are physically close to you on the track.
 * The cars are color coded as Red(At least a lap ahead), Blue (At least a lap behind), White (Same lap as you), Cyan (Off track).
 * A blink counter is shown before the Club Name.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-relative-small&gt;&lt;/sra-relative-small&gt;<br />
 * </b>
 * <img src="../widgets/RelativeSmall/icon.png" />
 * @ngdoc directive
 * @name sra-relative-small
 * @param {boolean} data-sra-args-by-location true, displays cars relative to your location. Default false.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2017 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/RelativeSmall/RelativeSmall','widgets/CarNumber/CarNumber'],
function(SIMRacingApps) {

    var self = {
        name:            'sraRelativeSmall',
        url:             'RelativeSmall',
        template:        'RelativeSmall.html',
        defaultWidth:    800,
        defaultHeight:   480,
        defaultInterval: 300, //initialize with the default interval
        module:          angular.module('SIMRacingApps') //get the main module
    };

    self.module.directive(self.name,
           ['sraDispatcher',
    function(sraDispatcher) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: ['$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                //load translations
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });
            }]
            , link: function($scope,$element,$attrs) {
                $scope.sraArgsBYLOCATION = sraDispatcher.getBoolean($scope.sraArgsBYLOCATION, $attrs.sraArgsByLocation, false);
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
