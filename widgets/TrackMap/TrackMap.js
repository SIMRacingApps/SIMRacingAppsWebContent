'use strict';
/**
 * This widget displays an image of the track and where each car is on the track.
 * It also displays the weather both as text and as a wind gauge.
 * It uses the following widgets: 
 *      {@link sra-track-map-car TrackMap/Car}, 
 *      {@link sra-track-map-finish-line TrackMap/FinishLine},
 *      {@link sra-weather-info WeatherInfo},
 *      {@link sra-wind-gauge WindGauge}.
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-track-map&gt;&lt;/sra-track-map&gt;<br />
 * </b>
 * <img src="../widgets/TrackMap/icon.png" atl="Image goes here"/>
 * @ngdoc directive
 * @name sra-track-map
 * @param {String} data-sra-args-track-map-cars A semicolon list of cars to show.
 *                 If you want to see the PITSTALL and PACECAR, you must include them in this list.
 *                 Defaults to PITSTALL and all cars in the session.
 *                 URL argument is TRACKMAPCARS.
 * @param {String} data-sra-args-car-text-type Passed down to the {@link sra-track-map-car TrackMap/Car} widget.
 * @param {String} data-sra-args-map-layer The type of map to show, "map", "osm", "mapquest". 
 *                 Defaults to "map".
 * @param {boolean} data-sra-args-show-flags false turns the flags on/off. Defaults to true.
 * @param {boolean} data-sra-args-show-wind-gauge false turns on/off the wind gauge. Defaults to true
 * @param {boolean} data-sra-args-show-weather false turns on/off the weather information box. Defaults to true.
 * @param {boolean} data-sra-args-show-title false turns on/off the title box. Defaults to true.
 * @param {boolean} data-sra-args-show-info false turns off the track information box. Defaults to true.
 * @param {boolean} data-sra-args-show-map true turns on/off the track layer. Defaults to true.
 * @param {boolean} data-sra-args-show-path true turns on/off the current track path. Defaults to true.
 * @param {boolean} data-sra-args-show-sectors true turns on/off the sector dots. Defaults to true. Since 1.19.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 100.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2022 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps',
        'openlayers/ol',
        'css!widgets/TrackMap/TrackMap',
        'widgets/TrackMap/Car/Car',
        'widgets/TrackMap/FinishLine/FinishLine',
        'widgets/TrackMap/MergePoint/MergePoint',
        'widgets/TrackMap/Sector/Sector',
        'widgets/DataTable/DataTable',
        'widgets/Flags/Flags',
        'widgets/WeatherInfo/WeatherInfo',
        'widgets/WindGauge/WindGauge',
       ],
function(SIMRacingApps,ol) {

    var self = {
        name:            "sraTrackMap",
        url:             'TrackMap',
        template:        'TrackMap.html',
        defaultWidth:    800,
        defaultHeight:   480,
        defaultInterval: 100   //initialize with the default interval to how fast the cars will update

      , maxcars:         64
      , maxsectors:      15     //nurburgring long has 14 sectors.
    };

    self.module = angular.module('SIMRacingApps'); //get the main module


    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$rootScope', '$document',
    function(sraDispatcher,   $filter,   $rootScope,   $document) {
        return {
            restrict:    'EA',
            scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.width  = $scope.defaultWidth    = self.defaultWidth;
                $scope.height = $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                //load translations
                sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url),'text',function(path) {
                    $scope.translations = sraDispatcher.getTranslation(path);
                });
                
                $scope.pathCounter = 0;
                $scope.sectorCounter = 0;

                //initialize the $scope variables
                $scope.imageUrl      = "";
                $scope.center     = -10000;
                $scope.resolution = -10000;
                $scope.rotation   = -10000;
                $scope.cars       = {};
                $scope.carsQueue  = [];

                $scope.finishLeft    = -10000;
                $scope.finishTop     = -10000;
                $scope.finishDegrees = '0';

                $scope.mergePointLeft= -10000;
                $scope.mergePointTop = -10000;
                
                $scope.sectors    = {};
                
                $scope.map           = null;
                
                $scope.dateformat = 'shortDate';
                $scope.format = 'mediumTime';
                $scope.tz = '';
                $scope.time = 0;
                
                $scope.arrayEqual = function (array1,array2) {
                    // if the other array is a falsy value, return
                    if (!array1 || !array2)
                        return false;

                    // compare lengths - can save a lot of time 
                    if (array1.length != array2.length)
                        return false;

                    for (var i = 0, l=array1.length; i < l; i++) {
                        // Check if we have nested arrays
                        if (array1[i] instanceof Array && array2[i] instanceof Array) {
                            // recurse into the nested arrays
                            if (!array1[i].equals(array2[i]))
                                return false;       
                        }           
                        else if (array1[i] != array2[i]) { 
                            // Warning - two different object instances will never be equal: {x:20} != {x:20}
                            return false;   
                        }           
                    }       
                    return true;
                };
                
                $scope.createMap = function($element) {
                    var _lat        = $scope.data.Track.Latitude.Value;
                    var _lng        = $scope.data.Track.Longitude.Value;
                    var _north      = $scope.data.Track.North.Value;
                    var _resolution = $scope.data.Track.Resolution.Value;
                    
                    if (!$scope.map) {
                        var children = $element.find('div');
                        
                        for (var i=0; i < children.length; i++) {
                            if (angular.element(children[i]).hasClass("SIMRacingApps-Widget-TrackMap-map")) {
                                //create the map. 
                                $scope.map = new ol.Map({
                                  layers: [
                                    new ol.layer.Tile({
                                      source: $scope.sraMapLayer.toUpperCase() == 'OSM' 
                                              ? new ol.source.OSM()
                                              : $scope.sraMapLayer.toUpperCase() == 'MAPQUEST'
                                                ?  new ol.source.MapQuest({layer: 'sat'})
                                                : null
                                    })
                                  ],
                                  target: children[i],
                                  controls: ol.control.defaults({
                                    zoom: false,
                                    rotate: false,
                                    attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                                      collapsible: false
                                    })
                                  }),
                                  view: new ol.View({
                                    center:     ol.proj.fromLonLat([_lng,_lat]),
                                    rotation:   ((_north + 90) / 360.0) * (Math.PI * 2),
                                    resolution: (_resolution * (1/($scope.height/384)))
                                  })
                                });
                                
                                //we want a completely static map, so remove all user interactions
                                $scope.map.getInteractions().forEach(function(interaction) {
                                  $scope.map.removeInteraction(interaction);
                                }, this);
                                
                            }
                        }
                    }
                        
                    if ($scope.map && _lng && _lat && _north) {
                    //if ($scope.map && (lng != $scope.lng || lat != $scope.lat || north != $scope.north)) {
                        //console.log("map("+lat+","+lng+","+resolution+","+north+")");
                        $scope.map.updateSize();
                        var center     = ol.proj.fromLonLat([_lng,_lat]);
                        var resolution = (_resolution * (1/($scope.height/384)));
                        var rotation   = (((_north + 90) / 360.0) * (Math.PI * 2));
                        
                        if ($scope.center[0]  != center[0]
                        ||  $scope.center[1]  != center[1]
                        ||  $scope.resolution != resolution
                        ||  $scope.rotation   != rotation
                        ) {
                            $scope.map.getView().setCenter($scope.center = center);
                            $scope.map.getView().setResolution($scope.resolution = resolution);
                            $scope.map.getView().setRotation($scope.rotation = rotation);
                        }
                    }
                    
                    //if we got a map and there are cars to move, move them
                    if ($scope.map && $scope.carsQueue.length > 0) {
                        for (var i=0; i < $scope.carsQueue.length; i++)
                            $scope.moveCar($scope.carsQueue[i].carid,$scope.carsQueue.scope);
                        $scope.carsQueue = [];
                    }
                };

                $scope.getLocation = function(longitude,latitude,scope) {
                    if (scope.map) {
                        var location  = scope.map.getPixelFromCoordinate(ol.proj.fromLonLat([longitude,latitude]));
                        
                        //note: if map has not been rendered, the location returns NaN.
                        //TODO: This means cars will not get drawn until they move. Can we queue them up and keep retrying? Retry after the map renders? 
                        if (location && !isNaN(location[0]) && !isNaN(location[1])) {
                            return location;
                        }
                    }
                    return null;
                };
                
                $scope.moveCar = function(carid,scope) {
                    if (!scope) 
                        return;
                    
                    if (!scope.map) {
                        //if the map is not drawn yet, save the cars we need to move in a queue.
                        $scope.carsQueue.push({ carid: carid, scope: scope});
                    }
                    else {
                        var longitude = scope.data.Car[carid].Longitude.Value;
                        var latitude  = scope.data.Car[carid].Latitude.Value;
                        var location  = scope.getLocation(longitude,latitude,scope);
                        
                        //note: if map has not been rendered, the location returns NaN.
                        //TODO: This means cars will not get drawn until they move. Can we queue them up and keep retrying? Retry after the map renders? 
                        if (location) {
                            scope.cars[carid].left = location[0];
                            scope.cars[carid].top  = location[1];
                        }
                        else {
                            $scope.carsQueue.push({ carid: carid, scope: scope});
                        }

                        //draw the merge point
                        if (scope.data.Car.REFERENCE.MergePointLatitude) {
                            latitude         = scope.data.Car.REFERENCE.MergePointLatitude.Value;
                            longitude        = scope.data.Car.REFERENCE.MergePointLongitude.Value;
                            location         = scope.getLocation(longitude,latitude,scope);
                        }
                            
                        if (location) {
                            scope.mergePointLeft    = location[0];
                            scope.mergePointTop     = location[1];
                        }
                        
                        //move the finish line and Pit Stall every time because we can't get the coordinates until the map renders
                        //TODO: Try and do this only when needed.
                        if (scope.data.Car.PITSTALL) {
                            longitude = scope.data.Car.PITSTALL.Longitude.Value;
                            latitude  = scope.data.Car.PITSTALL.Latitude.Value;
                            location  = scope.getLocation(longitude,latitude,scope);
                            
                            if (location) {
                                scope.cars.PITSTALL.left = location[0];
                                scope.cars.PITSTALL.top  = location[1];
                            }
                        }
                        
                        //note: the pixel location returned is the center of the finish line
                        //we will set the Left/Top location to the center in the scope and then move it with CSS to center it.
                        latitude         = scope.data.Track.Latitude.ONTRACK['100.0'].Value;
                        longitude        = scope.data.Track.Longitude.ONTRACK['100.0'].Value;
                        location         = scope.getLocation(longitude,latitude,scope);
                        if (location) {
                            var rotate          = scope.data.Track.FinishLineRotation.Value;
                            scope.finishDegrees = rotate;
                            scope.finishLeft    = location[0];
                            scope.finishTop     = location[1];
                        }
                    }
                };
                
                $scope.moveSectors = function(newCoordinates, oldCoordinates) {
                    if ($scope.sraShowSectors) {
                        if (arguments.length == 3) {
                            if ($scope.arrayEqual(newCoordinates, oldCoordinates))
                                return;
                        }
                        if( Object.prototype.toString.call( newCoordinates ) === '[object Array]' ) {
                            //console.log((++$scope.sectorCounter)+" moveSectors("+(newCoordinates.length/4)+")");
                            for (var sector=0; sector < self.maxsectors; sector++) {
                                //first move them off screen in case they're not visible
                                $scope.sectors[sector].left = -100000;
                                $scope.sectors[sector].top  = -100000;
                                
                                //move sector if it's visible to it's location on the path
                                if ((sector*4) < newCoordinates.length) {
                                    var latitude         = newCoordinates[(sector*4)];
                                    var longitude        = newCoordinates[(sector*4)+1];
                                    var location         = $scope.getLocation(longitude,latitude,$scope);
                                        
                                    if (location) {
                                        $scope.sectors[sector].left = location[0];
                                        $scope.sectors[sector].top  = location[1];
                                    }
                                }
                            }
                        }
                    }
                };

                $scope.getPath = function(path,oldPath) {
                    if ($scope.map) {
                        if (arguments.length == 3) {
                            if ($scope.arrayEqual(path,oldPath))
                                return;
                        }
                        if( Object.prototype.toString.call( path ) === '[object Array]' ) {
                            //console.log((++$scope.pathCounter)+" getPath("+path.length+")");
                            var d = "";
                            for (var point=0; point < path.length; point++) {
                                var longitude = path[point].Lon;
                                var latitude  = path[point].Lat;
                                var location  = $scope.getLocation(longitude,latitude,$scope);
                                
                                //note: if map has not been rendered, the location returns NaN.
                                if (location) {
                                    if (path[point].Type == -1.0) //Start
                                        d += " M" + Math.round(location[0]) + " " + Math.round(location[1]);
                                    else
                                    if (path[point].Type == 0.0)  //line to
                                        d += " L" + Math.round(location[0]) + " " + Math.round(location[1]);
                                    else
                                    if (path[point].Type == 1.0)  //end
                                        d += " Z";
                                }
                            }
                            
                            $scope.moveSectors($scope.data.Track.Sectors.COORDINATES.DEG.Value);
                            return d;
                        }
                    }
                    return "";
                };
            }]
            , link: function($scope,$element,$attrs) {
                //copy arguments to our $scope
                $attrs.sraArgsData      = $attrs.sraArgsData || "";
                $scope.value = 
                $scope[self.name] = sraDispatcher.getTruthy($scope.sraArgsVALUE, $attrs[self.name], $attrs.sraArgsValue, "DefaultValue");
                
                $scope.sraInterval      = $attrs.sraInterval;
                $scope.sraCarTextType   = sraDispatcher.getTruthy($scope.sraArgsCARTEXTTYPE, $attrs.sraArgsCarTextType,"number");
                $scope.sraShowFlags     = sraDispatcher.getBoolean($scope.sraArgsSHOWFLAGS, $attrs.sraArgsShowFlags, true);
                $scope.sraShowWindGauge = sraDispatcher.getBoolean($scope.sraArgsSHOWWINDGAUGE, $attrs.sraArgsShowWindGauge,true);
                $scope.sraShowWeather   = sraDispatcher.getBoolean($scope.sraArgsSHOWWEATHER, $attrs.sraArgsShowWeather, true);
                $scope.sraShowTitle     = sraDispatcher.getBoolean($scope.sraArgsSHOWTITLE, $attrs.sraArgsShowTitle, true);
                $scope.sraShowInfo      = sraDispatcher.getBoolean($scope.sraArgsSHOWINFO, $attrs.sraArgsShowInfo, true);
                $scope.sraShowMap       = sraDispatcher.getBoolean($scope.sraArgsSHOWMAP, $attrs.sraArgsShowMap, true);
                $scope.sraShowPath      = sraDispatcher.getBoolean($scope.sraArgsSHOWPATH, $attrs.sraArgsShowPath, true);
                $scope.sraShowSectors   = sraDispatcher.getBoolean($scope.sraArgsSHOWSECTORS, $attrs.sraArgsShowSectors, false);
                $scope.sraMapLayer      = sraDispatcher.getTruthy($scope.sraArgsMAPLAYER, $attrs.sraArgsMapLayer, 'map').toUpperCase();
                $scope.sraCars          = sraDispatcher.getTruthy($scope.sraArgsTRACKMAPCARS, $attrs.sraArgsTrackMapCars, '');

                //put everything off screen, out of view, until we get the coordinates of where to put them
                //TODO: Get a list of the cars from the server
                if ($scope.sraCars) {
                    var aCars = $scope.sraCars.split(";");
                    for (var carid=0; carid < aCars.length; carid++) {
                        $scope.cars[aCars[carid]]      = {};
                        $scope.cars[aCars[carid]].id   = aCars[carid];
                        $scope.cars[aCars[carid]].left = -10000;
                        $scope.cars[aCars[carid]].top  = -10000;
                    }
                }
                else {
                    $scope.cars.PITSTALL      = {};
                    $scope.cars.PITSTALL.id   = 'PITSTALL';
                    $scope.cars.PITSTALL.left = -10000;
                    $scope.cars.PITSTALL.top  = -10000;

                    for (var carid=0; carid < self.maxcars; carid++) {
                        $scope.cars['I'+carid]      = {};
                        $scope.cars['I'+carid].id   = 'I'+carid;
                        $scope.cars['I'+carid].left = -10000;
                        $scope.cars['I'+carid].top  = -10000;
                    }
                }
                
                //register for movement for all cars, including pit stall
                for (var carid in $scope.cars) {
                    $attrs.sraArgsData += ";Car/"+carid+"/Latitude;Car/"+carid+"/Longitude";
                    $attrs.sraArgsData += ";Car/"+carid+"/Status";
                    $attrs.sraArgsData += ";Car/"+carid+"/IsEqual/REFERENCE";
                    $attrs.sraArgsData += ";Car/"+carid+"/IsEqual/PACECAR";
                    $attrs.sraArgsData += ";Car/"+carid+"/IsEqual/LEADER";
                    $attrs.sraArgsData += ";Car/"+carid+"/IsEqual/TRANSMITTING";
                    $attrs.sraArgsData += ";Car/"+carid+"/IsEqual/PITSTALL";
                    
                    $scope.$watch("data.Car['"+carid+"'].Latitude.Value",  new Function('newValue','oldValue','$scope','$scope.moveCar("'+carid+'",$scope);'));
                    $scope.$watch("data.Car['"+carid+"'].Longitude.Value", new Function('newValue','oldValue','$scope','$scope.moveCar("'+carid+'",$scope);'));
                }
                
                //setup for sector dots
                $attrs.sraArgsData += ";Track/Sectors/COORDINATES/DEG";
                
                for (var sector=0; sector < self.maxsectors; sector++) {
                    $scope.sectors[sector]        = {};
                    $scope.sectors[sector].number = sector + 1;
                    $scope.sectors[sector].left   = -10000;
                    $scope.sectors[sector].top    = -10000;
                }
                
                $scope.$watch("data.Track.Sectors.COORDINATES.DEG.Value", $scope.moveSectors);

                //now watch for track changes and move the finish line                
                $attrs.sraArgsData += ";Session/Time;Track/Latitude;Track/Longitude;Track/Resolution;Track/North;Track/Image/"+$scope.sraMapLayer;
                
                $scope.$watch('data.Track.Latitude.Value',   function() {$scope.createMap($element);});
                $scope.$watch('data.Track.Longitude.Value',  function() {$scope.createMap($element);});
                $scope.$watch('data.Track.North.Value',      function() {$scope.createMap($element);});
                $scope.$watch('data.Track.Resolution.Value', function() {$scope.createMap($element);});
                $scope.$watch("data.Session.Time.Value",function(value,oldvalue) {
                    $scope.time = new Date();
                    $scope.time.setTime((value*1000));
                    $scope.tz = $scope.data.Session.Time.State;
                });
                
                $scope.$watch('data.Track.Image["'+$scope.sraMapLayer+'"].Value',function(image) {
                    if (image) {
                        $scope.imageUrl = "/SIMRacingApps/Resource/"+image;
                    }
                    else {
                        $scope.imageUrl = "";
                    }
                });
                
                $attrs.sraArgsData += ";Track/FinishLineRotation;Track/Latitude/ONTRACK/100.0;Track/Longitude/ONTRACK/100.0";
                $attrs.sraArgsData += ";Car/REFERENCE/MergePointLatitude;Car/REFERENCE/MergePointLongitude";

                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
                
                //now setup to watch for path changes
                if ($scope.sraShowPath) {
                    //register with the dispatcher
                    $attrs.sraArgsData = "Track/Path/ONTRACK;Track/Path/ONPITROAD";
                    $scope.names = sraDispatcher.subscribe($scope,$attrs,5000); //register subscriptions and options to the dispatcher
                    
                    $scope.$watch('data.Track.Path.ONTRACK.Value', function(path) {
                        $scope.trackpath = $scope.getPath($scope.data.Track.Path.ONTRACK.Value);
                    });
                    
                    $scope.$watch('data.Track.Path.ONPITROAD.Value', function(path) {
                        $scope.pitroadpath = $scope.getPath($scope.data.Track.Path.ONPITROAD.Value);
                    });
                }
                
                $rootScope.$on('sraResize', function() {
                    sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight);
                    $scope.createMap($element);
                    if ($scope.sraShowPath) {
                        $scope.trackpath   = $scope.getPath($scope.data.Track.Path.ONTRACK.Value);
                        $scope.pitroadpath = $scope.getPath($scope.data.Track.Path.ONPITROAD.Value);
                    }
                    $scope.moveSectors($scope.data.Track.Sectors.COORDINATES.DEG.Value);
                });
            }
        };
    }]);

    return self;
});
