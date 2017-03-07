'use strict';

require(SIMRacingAppsRequireConfig,
['angular','angular-sanitize'],
function( angular,angularSanitize ) {
    angular.element(document).ready(function() {

        var module = angular.module('SIMRacingApps',['ngSanitize']);

        //call modules configuration function
        module.config(
               ['$locationProvider',
        function($locationProvider) {
            $locationProvider.html5Mode(true);  //this is for the $location service to work right.
        }]);
        
        module.controller("SIMRacingApps-Controller",
        ['$scope', '$http', '$window', '$location', '$document','$locale',
        function($scope,$http,$window,$location,$document,$locale) {

            $scope.headers = {};
            $scope.listings = {};
            $scope.version = {};
            $scope.websiteVersion = {};
            $scope.websiteBETAVersion = {};
            $scope.versionString = "";
            $scope.updateString = "";

            $scope.translations = {};
            $scope.lang = "";
            $scope.country = "";
            $scope.locale = "";
            
            var args = $location.search();
            
            $scope.args = "";
            for (var arg in args) {
                $scope.args += '&'+arg+'='+args[arg];
                if (arg == "lang")
                    $scope.lang = args[arg];
                if (arg == "country")
                    $scope.country = args[arg];
                if (arg == "locale")
                    $scope.locale = args[arg];
            }

            //if user did not pass in a lang, then use the default one.
            if ($scope.lang.length == 0 && $scope.country.length == 0) {
                //if the browser sets the navigator.language, then use it instead of $locale.id
                console.log("$locale = "+JSON.stringify($locale));
                var l = ($locale.id).split(/[-_@;]/);
                if (l.length > 1) {
                    $scope.lang    = l[0];
                    $scope.country = l[1];
                }
                else
                if (l.length > 0) {
                    $scope.lang    = l[0];
                }
            }
            
            if ($scope.locale.length == 0) {
                $scope.locale = $scope.country.length > 0 
                              ? $scope.lang + "-" + $scope.country 
                              : $scope.lang;
            }
            
//            sraDispatcher.loadTranslations("/SIMRacingApps","text",function(path) {
//                $scope.translations = sraDispatcher.getTranslation(path,"auto");
//            });
            
            $scope.launch = function(url,width,height) {
                    var useWidth  = width  || 800;
                    var useHeight = height || 480;
                    
                    //if the url doesn't have any parameters, then make our first parameter a question mark
                    if (url.indexOf('?') < 0 && $scope.args)
                        $scope.args = "?" + $scope.args.substring(1);

                    var eventWin  = $window.open(url + $scope.args, "_blank", 'width=' + useWidth + ', height=' + useHeight + ', resizable=1, scrollbars=1, status=0, toolbar=0, location=0, menubar=0');
                    //var eventWin  = $window.open(url + $scope.args, url + $scope.args, 'width=' + useWidth + ', height=' + useHeight + ', resizable=1, scrollbars=1, status=0, toolbar=0, location=0, menubar=0');
                    eventWin.focus();
            };
            
            $scope.checkVersion = function() {
                if ($scope.version.major && $scope.websiteVersion.major && $scope.websiteBETAVersion.major) {

//$scope.version.major = 1;                    
//$scope.version.minor = 1;
//$scope.version.build = "BETA-2016.04.01";
//$scope.websiteVersion.major = 1;                    
//$scope.websiteVersion.minor = 0;
//$scope.websiteVersion.build = "2016.05.01";
//$scope.websiteBETAVersion.major = 1;                    
//$scope.websiteBETAVersion.minor = 1;
//$scope.websiteBETAVersion.build = "RC-2016.05.15";

                    $scope.version.major *= 1;
                    $scope.version.minor *= 1;
                    $scope.websiteVersion.major *= 1;
                    $scope.websiteVersion.minor *= 1;
                    $scope.websiteBETAVersion.major *= 1;
                    $scope.websiteBETAVersion.minor *= 1;
                    $scope.translations = $scope.version.translations;
                    
                    $scope.versionString = $scope.translations.VERSION+": "+$scope.version.major+"."+$scope.version.minor+"-"+$scope.version.build + ' [' + $scope.locale + ']';
                    var websiteBETABuild = "";
                    var a = $scope.websiteBETAVersion.build.split(/[-.]/);
                    for (var i=0;i < a.length;i++) {
                        if (a[i].match(/[0-9]/))
                            websiteBETABuild += "" + a[i];
                    }
                    websiteBETABuild *= 1;
                    
                    var websiteBuild = "";
                    var a = $scope.websiteVersion.build.split(/[-.]/);
                    for (var i=0;i < a.length;i++) {
                        if (a[i].match(/[0-9]/))
                            websiteBuild += "" + a[i];
                    }
                    websiteBuild *= 1;
                    
                    var build = "";
                    a = $scope.version.build.split(/[-.]/);
                    for (var i=0;i < a.length;i++) {
                        if (a[i].match(/[0-9]/))
                            build += "" + a[i];
                    }
                    build *= 1;
                    
                    //if the main version on the website is newer, post it as the update
                    if ($scope.version.major <  $scope.websiteVersion.major
                    || ($scope.version.major == $scope.websiteVersion.major && $scope.version.minor <  $scope.websiteVersion.minor)
                    || ($scope.version.major == $scope.websiteVersion.major && $scope.version.minor == $scope.websiteVersion.minor && build < websiteBuild)
                    ) {
                        $scope.updateString += "(UPDATE Available: "+$scope.websiteVersion.major+"."+$scope.websiteVersion.minor+"-"+$scope.websiteVersion.build+")";
                    }
                    else //if this is a BETA/RC version, then post the new BETA/RC as the update
                    if (($scope.version.build.match(/^BETA-/) || $scope.version.build.match(/^RC-/))
                    && ($scope.version.major <  $scope.websiteBETAVersion.major
                    || ($scope.version.major == $scope.websiteBETAVersion.major        && $scope.version.minor <  $scope.websiteBETAVersion.minor)
                    || ($scope.version.major == $scope.websiteBETAVersion.major        && $scope.version.minor == $scope.websiteBETAVersion.minor && build < websiteBETABuild))
                    ) {
                        $scope.updateString += "(UPDATE Available: "+$scope.websiteBETAVersion.major+"."+$scope.websiteBETAVersion.minor+"-"+$scope.websiteBETAVersion.build+")";
                    }
                        
                }
            };
            
            var request = {
                method:  'GET',
                url:     '/SIMRacingApps/listings' + ($scope.locale.length > 0 ? '?lang='+$scope.locale : ''),
                cache:   false,
                timeout: 5000
            };
            
            $http(request)
                .success(function(data, status, headers, config) {
                    $scope.version = data.version;
                    $scope.headers = data.headers;
                    
                    $document[0].title = 'SIMRacingApps '+ $scope.version.major+'.'+$scope.version.minor+'_'+$scope.version.build + ' [' + $scope.locale + ']';
                    ga('set','av',$scope.version.major+'.'+$scope.version.minor+'_'+$scope.version.build);
                    ga('send', 'pageview', '/SIMRacingApps');

                    $scope.checkVersion();
                    
                    for (var headeridx in data.headers) {
                        var header = data.headers[headeridx];
                        $scope.listings[header] = [];
                        
                        for (var itemidx in data[header]) {
                            var item = data[header][itemidx];
                            var count = 0;
                            var newitem = {};
                            newitem.url  = '/SIMRacingApps/'+item.url;
                            newitem.doc  = '/SIMRacingApps/'+item.doc;
                            newitem.width = item.width;
                            newitem.height = item.height;
                            newitem.description = item.description;
                            newitem.icon = item.icon;
                            newitem.name = item.name;
                            if (item.args) {
                                if (newitem.url.indexOf('?') < 0)
                                    newitem.url += '?' + item.args;
                                else
                                    newitem.url += item.args;
                            }
                         
                            console.log(header+"."+newitem.name+" = "+JSON.stringify(newitem))
                            $scope.listings[header].push(newitem);
                        }
                    }
                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("error - "+status);
                });

            $http({
                method:  'GET',
                url:     'http://SIMRacingApps.com/version.json',
                cache:   false,
                timeout: 5000
            })
                .success(function(data, status, headers, config) {
                    console.log("SIMRacingApps.com/version.json: " + JSON.stringify(data));
                    $scope.websiteVersion = data;
                    $scope.checkVersion();
                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("version.json: error - "+status);
                });
            
            $http({
                method:  'GET',
                url:     'http://SIMRacingApps.com/BETA-version.json',
                cache:   false,
                timeout: 5000
            })
                .success(function(data, status, headers, config) {
                    console.log("SIMRacingApps.com/BETA-version.json: " + JSON.stringify(data));
                    $scope.websiteBETAVersion = data;
                    $scope.checkVersion();
                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("version.json: error - "+status);
                });
        }]);
        
        var i18n = 'i18n/angular-locale_';
        //this method confirmed with IE
        if (window.navigator.userLanguage)
            i18n += window.navigator.userLanguage.toLowerCase().split(/[-_]/).join('-');
        else
        if (window.navigator.language)
            //this method confirmed with FireFox, Chrome, Safari iOS8
            i18n += window.navigator.language.toLowerCase().split(/[-_]/).join('-');
        else
            i18n += 'en';
        
        var search = window.location.search;
        if (search) {
            //now parse the URL search string for arguments we need before bootstrapping angular
            search = search.split(/[\?&]/);

            for (var i=0; i < search.length; i++) {
                var s = search[i].split("=");
                if (s.length > 1) {
                    if (s[0].toLowerCase() == "lang") {
                        i18n = 'i18n/angular-locale_'+s[1].toLowerCase().split(/[-_]/).join('-');
                    }
                }
            }
        }
        

        require([i18n],
        function(vi18n) {
            angular.bootstrap(document.body,['SIMRacingApps']);
        }, function(err) {
            console.log(err.toString());
            angular.element(document.body).prepend( "<div class='SIMRacingAppsError'>"+err.toString()+"</div>" );
        });
            
    });
});
