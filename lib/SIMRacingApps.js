'use strict';
define(['angular','angular-sanitize','css!SIMRacingApps'],
function(angular) {
    /**
     * SIMRacingApps Angular Module
     * <p>
     * Defines Angular Filters
     * <p>
     * Defines Angular Directives
     * <p>
     * starts the Angular bootstrap process 
     * @requires angular
     * @requires angular-sanitize
     * @exports SIMRacingApps
     * @author Jeffrey Gilliam
     */
    var app = {module: angular.module('SIMRacingApps',['ngSanitize'])};

    //call modules configuration function
    app.module.config(
           ['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode(true);  //this is for the $location service to work right.
    }]);

    /******************************************************************************************************/
    /********************************************* Filters ************************************************/
    /******************************************************************************************************/
    
    /**
     * The sraCeil filter simply calls Math.ceil. 
     * @ngdoc filter
     * @since 1.0
     * @param {Object} value The value piped into the filter
     * @return {Object} The results of calling Math.ceil
     * @author Jeffrey Gilliam
     */
    app.sraCeil = function() {
        return function(value) {
            return Math.ceil(value);
        }
    };
    app.module.filter('sraCeil', [app.sraCeil] );
    
    /**
     * The sraDebug Filter will give you a place to put a break-point to stop the debugger 
     * so you can inspect the value being processed.
     * It can be passed up to 3 arguments that you can inspect as well.
     * It does not modify the value.
     * @ngdoc filter
     * @since 1.0
     * @param {Object} value The value piped into the filter
     * @param {Object} arg1 An additional argument that can optionally be passed in for inspection
     * @param {Object} arg2 An additional argument that can optionally be passed in for inspection
     * @param {Object} arg3 An additional argument that can optionally be passed in for inspection
     * @return {Object} The value passed in
     * @author Jeffrey Gilliam
     */
    app.sraDebug = function() {
        return function(value,arg1,arg2,arg3) {
            return value;
        }
    };
    app.module.filter('sraDebug', [app.sraDebug] );

    //create a new html document (doesn't execute script tags in child elements)
    app.doc = document.implementation.createHTMLDocument("");
    app.element = app.doc.createElement('div');

    /**
     * The sraDecodeEntities Filter encoded HTML and decodes it into a text string.
     * <p>
     * For example: &amp;lt; gets converted to &lt;
     * @ngdoc filter
     * @param {String} str The string to decode
     * @return {String} A string with entities decoded. 
     * @author Jeffrey Gilliam
     */
    app.sraDecodeEntities = function() {
        return function(str) {
        
            function getText(str) {
                app.element.innerHTML = str;
                str = app.element.textContent;
                app.element.textContent = '';
                return str;
            }
    
            if (str && typeof str === 'string') {
                //called twice because initially text might be encoded like this: &lt;img src=fake onerror=&quot;prompt(1)&quot;&gt;
                return getText(getText(str));
            }
            return "";
        }
    };
    app.module.filter('sraDecodeEntities',[ app.sraDecodeEnties ]);

    /**
     * The sraDuration Filter formats the number of seconds to days:hours:minutes:seconds.milliseconds{UOM}.
     * "value" can either be a decimal number or a Data object.
     * If it is a Data object, then the Unit of Measure is appended.
     * @ngdoc filter
     * @param  {number}  time The number of seconds or Data object containing seconds to format
     * @param  {number}  precision (Optional) The number of decimal places for displaying the milliseconds, default 3.
     * @param  {boolean} showPositive If true, prefix the positive symbol, default false.
     * @param  {boolean} blankIfZero (Optional) true to return a blank if zero, default false.
     * @param  {boolean} showMinutes (Optional) true will always show minutes, even if less than 1 minute, default false.
     * @param  {boolean} showApproximateOnly (Optional) true will only show the tilde(~) if the value is estimated, default false.
     * @return {String}  A string with the formatted as days:hours:minutes:seconds.milliseconds{UOM}.
     * @author Jeffrey Gilliam
     */
    app.sraDuration = function($filter,  $locale) {
        return function(time,precision,showPositive,blankIfZero,showMinutes,showApproximateOnly) {
            var dur;
            var uom = "";
            var pre = precision;
            
            if (time && angular.isDefined(time.Value)) {
                dur = time.Value;
                uom = time.UOMAbbr;
                pre = time.UOM == "lap" ? 0 : pre;
                if (showApproximateOnly) {
                    if (time.UOM.substring(0,1) == "~")
                        uom = "~";
                    else
                        uom = "";
                }
                    
                //if UOM is a lap, then just return the number not formatted as time.
                if (time.UOM.toUpperCase() == "LAP")
                    return dur.toFixed(0)+uom;
            }
            else
                dur = time;

            if (isNaN(dur) || (String(blankIfZero) === 'true' && !dur))
                return "";

//dur = (60*60*24*5) + (60*60*4) + (60*3) + 2;

            var v_precision = angular.isDefined(pre) ? pre * 1 : 3;
            var v_time = Math.abs(dur).toFixed(v_precision) * 1.0;
            var sign    = dur < 0 ? -1 : 1;
            //v_time = Math.abs((1 * 24*60*60) + (2 * 60*60) + (3 * 60) + 4 + 0.05678901234).toFixed(v_precision) * 1.0;
            var i       = Math.floor(v_time);
            var ms      = Math.round((v_time - i) * Math.pow(10,v_precision));
            var days    = Math.floor(i / (60*60*24));
            var hours   = Math.floor((i - (60*60*24*days)) / (60*60));
            var minutes = Math.floor((i - (60*60*24*days) - (60*60*hours)) / (60));
            var seconds = i - (60*60*24*days) - (60*60*hours) - (60*minutes);

            while (ms.toString().length < v_precision)
                ms = "0" + ms;

            var decimal  = $locale.NUMBER_FORMATS ? $locale.NUMBER_FORMATS.DECIMAL_SEP : $filter('number')(-1.1,1).toString()[2];
            var negative = $filter('number')(-1.1,1).toString()[0];
            var positive = '+';
            var separator = ':';

            var ret = v_precision == 0 ? seconds : (seconds + decimal + ms);
            if (days || hours || minutes || String(showMinutes) === 'true')
                    ret = minutes + separator + (seconds < 10 ? "0" : "") + ret;
            if (days || hours)
                    ret = hours + separator + (minutes < 10 ? "0" : "") + ret;
            if (days)
                ret = days + separator + (hours < 10 ? "0" : "") + ret;
            ret = (sign < 0 ? negative : (String(showPositive) === 'true' || showPositive === '+' ? positive : '')) + ret;

            return ret+uom;
        };
    }
    app.module.filter('sraDuration', ['$filter','$locale', app.sraDuration]);

    /**
     * The sraFloor filter simply calls Math.floor. 
     * @ngdoc filter
     * @since 1.0
     * @param {Object} value The value piped into the filter
     * @return {Object} The results of calling Math.ceil
     * @author Jeffrey Gilliam
     */
    app.sraFloor = function() {
        return function(value) {
            return Math.floor(value);
        }
    };
    app.module.filter('sraFloor', [app.sraFloor] );
    
    /**
     * The sraHex Filter converts a number to a hex string.
     * @ngdoc filter
     * @param {number}  value   The number to convert.
     * @param {integer} length  (Optional) The minimum length of the resulting string left padded with zeros, default 0.
     * @param {String}  prepend (Optional) A string to prepend to the result after padding. Example "0x" or "#".
     * @return {String} A String formatted in hex.
     * @author Jeffrey Gilliam
     */
    app.sraHex = function($filter) {
        return function(value,length,prepend) {
            if (isNaN(value))
                return "";
            var h = (value*1).toString(16);
            h = $filter('sraLPad')(h,length,'0');
            if (prepend)
                h = prepend + h;
            return h;
        };
    }
    app.module.filter('sraHex',['$filter', app.sraHex]);

    /**
     * The sraLPad Filter will take any value, convert it to a string and prefix the 
     * string with either the char passed in or the space entity "&amp;nbsp;" according to the length passed in.
     * @ngdoc filter
     * @param {Object}  value The value to prefix the characters to.
     * @param {integer} length The number of characters to prefix, default 0.
     * @param {String}  char The string to prefix, default to "&amp;nbsp;".
     * @return {String} A String that is left padded.
     * @author Jeffrey Gilliam
     */
    app.sraLPad = function() {
        return function(value,length,char) {
            var r = String(value) || "";
            var l = r.length;
            while (length && l < length) {
                r = (char ? char : '&nbsp;') + r;
                l++;
            }
            return r;
        };  
    }
    app.module.filter('sraLPad',[app.sraLPad]);

    /**
     * The sraNumber Filter formats a number according to the current locale.
     * "value" can either be a decimal number or a Data object.
     * If it is a Data object, then the Unit of Measure is appended.
     * @ngdoc filter
     * @param  {number}  value       The number or Data object containing a number to format
     * @param  {integer} decimals    (Optional) The number of decimal places to round to, default see Angular's number filter.
     * @param  {boolean} blankIfZero (Optional) true to return a blank if zero, default false.
     * @param  {boolean} showPositive (Optional) Set to true or a string to show when positive. Defaults to false.
     * @param  {boolean} showThousandsSeparator (Optional) Set to true to show the thousands separator.
     * @param  {boolean} showApproximateOnly (Optional) true will only show the tilde(~) if the value is estimated, default false.
     * @return {String}  The formatted number as a string.
     * @author Jeffrey Gilliam
     */
    app.sraNumber = function($filter,  $locale) {
        return function(value,decimals,blankIfZero,showPositive,showThousands,showApproximateOnly) {
            var v;
            var uom = "";
            if (value && angular.isDefined(value.Value)) {
                v = value.Value;
                uom = value.UOMAbbr;

                if (showApproximateOnly) {
                    if (value.UOM.substring(0,1) == "~")
                        uom = "~";
                    else
                        uom = "";
                }
            }
            else
                v = value;

            if (uom.toUpperCase() == 'STRING')
                return v;
            
            if (isNaN(v) || (String(blankIfZero) === 'true' && !v))
                return "";

            var separater = $filter('number')(1000,0)[1];
            
            var ret = $filter('number')(v,decimals);
            
            if (!(typeof(showThousands) != 'undefined' && String(showThousands) == 'true'))
                ret = ret.replace(separater,"");
            
            if (v >= 0.0 && (String(showPositive) === 'true' || showPositive === '+'))
                ret = '+' + String(ret);
            return ret + uom;
        };
    }
    app.module.filter('sraNumber',['$filter','$locale', app.sraNumber ]);


    /**
     * The sraRGB Filter converts a color as a decimal number to a rgb() or rgba() string.
     * 
     * @see https://en.wikipedia.org/wiki/RGBA_color_space
     * @ngdoc filter
     * @param {number}  value   The color to convert. This can be a Data object.
     * @param {string}  UOM     (Optional) The UOM of the value. Defaults to RGB.
     * @param {integer} opacity (Optional) The opacity value to apply. Default is 1 or use value.UOM.
     * @return {String} A String formatted in either rgb() or rgba().
     * @author Jeffrey Gilliam
     */
    app.sraRGB = function($filter) {
        return function(value,UOM,opacity) {
            var v = value;
            var u = UOM ? UOM : 'RGB';
            var o = opacity;
            
            if (typeof(v) != 'undefined' && typeof(v.Value) != 'undefined') {
                u = v.UOM.toUpperCase();
                v = v.Value;
            }
            
            if (typeof(v) == 'undefined' || isNaN(v))
                return "";
            
            var h = (v*1);
            var r,g,b,rgb;
            if (u == "RGBA") {
                r = (h >> 24) & 0xFF;
                g = (h >> 16) & 0xFF;
                b = (h >> 8)  & 0xFF;
                if (typeof(o) == 'undefined')
                    o = (h) & 0xFF;
            }
            else
            if (u == "ARGB") {
                r = (h >> 16) & 0xFF;
                g = (h >> 8) & 0xFF;
                b = (h >> 0)  & 0xFF;
                if (typeof(o) == 'undefined')
                    o = (h >> 24) & 0xFF;
            }
            else {
                //assume UOM == RGB
                r = (h >> 16) & 0xFF;
                g = (h >> 8)  & 0xFF;
                b = (h >> 0)  & 0xFF;
            }
            
            if (typeof(o) != 'undefined') {
                rgb = 'rgba(' + r + ',' + g + ',' + b + ',' + o + ')';
            }
            else {
                rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
            }
            return rgb;
        };
    }
    app.module.filter('sraRGB',['$filter', app.sraRGB]);
    
    /**
     * The sraRound filter simply calls Math.round after shifting the value for the number of decimal places and then shifting it back. 
     * @ngdoc filter
     * @since 1.0
     * @param {Object} value The value piped into the filter
     * @param {int} decimalPlaces The number of decimal places to round to. Defaults to zero.
     * @return {Object} The results of calling Math.round
     * @author Jeffrey Gilliam
     */
    app.sraRound = function() {
        return function(value,decimalPlaces) {
            var multiplier = decimalPlaces ? decimalPlaces * 10 : 1;
            return Math.round(value * multiplier) / multiplier ;
        }
    };
    app.module.filter('sraRound', [app.sraRound] );

    /**
     * The sraRPad Filter will take any value, convert it to a string and append the 
     * string with either the char passed in or the space entity "&amp;nbsp;" according to the length passed in.
     * @ngdoc filter
     * @param {Object}  value The value to append the characters to.
     * @param {integer} length The number of characters to append, default 0.
     * @param {String}  char The string to append, default to "&amp;nbsp;".
     * @return {String} A String that is right padded.
     * @author Jeffrey Gilliam
     */
    app.sraRPad = function() {
        return function(value,length,char) {
            var r = String(value) || "";
            var l = r.length;
            while (length && l < length) {
                r = r + (char ? char : '&nbsp;');
                l++;
            }
            return r;
        };
    }
    app.module.filter('sraRPad',[app.sraRPad]);

    /**
     * The sraUpperCase Filter will take any value, convert it to uppercase 
     * @ngdoc filter
     * @param {Object}  value The value to append the characters to.
     * @param {integer} length The number of characters to append, default 0.
     * @param {String}  char The string to append, default to "&amp;nbsp;".
     * @return {String} A String that is right padded.
     * @author Jeffrey Gilliam
     */
    app.sraUpperCase = function() {
        return function(value) {
            return value.toUpperCase();
        };
    }
    app.module.filter('sraUpperCase',[app.sraUpperCase]);
    
    /**
     * The sraLowerCase Filter will take any value, convert it to Lowercase 
     * @ngdoc filter
     * @param {Object}  value The value to append the characters to.
     * @param {integer} length The number of characters to append, default 0.
     * @param {String}  char The string to append, default to "&amp;nbsp;".
     * @return {String} A String that is right padded.
     * @author Jeffrey Gilliam
     */
    app.sraLowerCase = function() {
        return function(value) {
            return value.toLowerCase();
        };
    }
    app.module.filter('sraLowerCase',[app.sraLowerCase]);
    /******************************************************************************************************/
    /***************************************** End Of Filters *********************************************/
    /******************************************************************************************************/
    
    /**
     * This class provides the functionality needed to communicate with the SIMRacingApps Server. 
     * Only one instance of this class should exist and that is controlled by keeping the singleton instance stored on the $rootScope.
     * It is recommended that you gain access to the instance by injecting it into your directive instead of accessing it from the $rootScope.
     * <p>
     * It also provides some common functionality that all directives can use when it is injected to them.
     * @ngdoc factory
     * @name sraDispatcher
     * @author Jeffrey Gilliam
     */
    app.sraDispatcher = function($rootScope,   $locale,   $timeout,   $http,   $filter,   $location,   $document,   $window) {

        function sraDispatcher() {
            var self=this;
            
            /**
             * Defines the different ways it is possible to communicate with the SIMRacingApps Server.
             * @memberof sraDispatcher 
             * @name InterfaceTypes 
             * @public
             */
            self.InterfaceTypes = {
                "HTTP":      "/Data",
                "WEBSOCKET": "/DataSocket",
                "STREAMING": "/DataStreaming",
                "WEBEVENT":  "/DataEvent"
            };

            self.windowWidth    = null;
            self.windowHeight   = null;
            self.windowFontSize = null;
            self.onClickQueue   = [];
            self.lastResize     = 0;

            //private properties
            self._private = {
                interval:       null,
//                interfaceType:  self.InterfaceTypes.HTTP,
                interfaceType:  self.InterfaceTypes.WEBSOCKET,
//                interfaceType:  self.InterfaceTypes.STREAMING,
//                interfaceType:  self.InterfaceTypes.WEBEVENT,
                websocket:      null,
                webevent:       null,
                lowestInterval: null,
                play:           null,
                record:         null,
                method:         'POST',
                datanodes:      {},
                virtualnodes:   {},
                translationTable: { 'pathsLoaded': {}, '/SIMRacingApps/lib': { 'en': {} } },
//don't need since dispatcher has to read directly from the translationTable to support multiple languages in the same session
//this would be for the default language only
//                translations: { "Data": {}, "UOMAbbr": {}, "UOMDesc": {} },
                lang:           'en',
                country:        'us',
                locale:         'en-us',
                post:           {},
                postjson:       '{}',
                sessionid:      $document[0].title + " - " + Date.now(),
                counter:        Date.now(),
                FPS:            0,
                FPSCounter:     0,
                FPSTime:        Date.now(),
                time:           new Date(),
                timeoutid:      null,
                zoom:           1,
                errorsLogged:   {},
                saveData:       function(targetdata,name,data) {
                    //first store it as is
//                    self.extendDeep(targetdata[name],data);
//if (name.substr(0,6) == 'CarLap')
//    debugger;
                    //then break it down by each argument if there is more than one argument store as separate objects
                    //the leading slash is optional, so it must be removed if present.
                    var args = (name.substring(0,1) == '/' ? name.substring(1) : name).split(/\//);
//                    if (args.length > 1) {
                        var t = targetdata;
                        for (var arg=0; arg < args.length; arg++) {
                            if (!(args[arg] in t))
                                t[args[arg]] = {};
                            t = t[args[arg]];
                        }
                        self.extendDeep(t,data);
						t.valueOf = function() {
							return this.Value;
						};
						t.toString = function() {
							return this.ValueFormatted;
						};
//                    }
                },
                processData: function(data) {
                    //calculate the FPS
                    self._private.time.setTime(Date.now());  //update the time first
                    if ((self._private.time.getTime() - self._private.FPSTime) > 1000) {
                        self._private.FPS        = self._private.FPSCounter;
                        self._private.FPSCounter = 0;
                        self._private.FPSTime    = self._private.time.getTime();
                    }
                    
                    self._private.FPSCounter++;
                    
                    //call resize so alignment directives will work.
                    //sometimes, they need to be called after the browser has completed laying out the page.
                    //TODO: Find a way to only call sraOnResize when needed. For now only call once per second
                    
                    if ($rootScope.sraOnResize && (self.lastResize + 1000) < Date.now()) {
                        $rootScope.sraOnResize();
                        self.lastResize = Date.now();
                    }

                    if (data) {
                        for (var dataid in data) {
                            for (var name in data[dataid]) {
                                //before processing, make sure it's something we sent the server by checking our datanodes
                                //then only if it's not null and not in error, notify the watches by updating the data attribute on the node

                                if (self._private.datanodes[dataid]                     //if we sent this one to the server
                                &&  name in self._private.datanodes[dataid].names       //and we know about the name
                                &&  data[dataid][name].Value != null                    //and the server didn't send us a null
                                ) {
                                    if (self.State.isERROR(data[dataid][name].State)) {
                                        //only log the error once, as it will be requested every tick and fill up the log
                                        if (!self._private.errorsLogged[data[dataid][name].Value]) {
                                            self._private.errorsLogged[data[dataid][name].Value] = data[dataid][name].ValueFormatted;
                                            console.log(name+"("+data[dataid][name].Format+"): "+data[dataid][name].ValueFormatted);
                                        }
                                    }
                                    else {
                                        //self._private.datanodes[dataid].data[name] = data[dataid][name];

                                        //add a hook to override server side translations by translating the formatted value
                                        var lang = data[dataid][name].Lang;

                                        data[dataid][name].ValueFormatted = self.getTranslation(
                                                "/SIMRacingApps/lib",
                                                lang,
                                                "Data",
                                                "COMMON",
                                                data[dataid][name].ValueFormatted
                                        );

                                        data[dataid][name].ValueFormatted = self.getTranslation(
                                            "/SIMRacingApps/lib",
                                            lang,
                                            "Data",
                                            name.split(/\//)[0].toUpperCase(),  //translate based on base of the name, not by arguments
                                            data[dataid][name].ValueFormatted
                                        );

                                        //also, go ahead and translate the UOM client side as well.
                                        data[dataid][name].UOMAbbr = self.getTranslation(
                                            "/SIMRacingApps/lib",
                                            lang,
                                            "UOMAbbr",
                                            data[dataid][name].UOMAbbr
                                        );

                                        data[dataid][name].UOMDesc = self.getTranslation(
                                            "/SIMRacingApps/lib",
                                            lang,
                                            "UOMDesc",
                                            data[dataid][name].UOMDesc
                                        );

                                        self._private.saveData(self._private.datanodes[dataid].data,name,data[dataid][name]);
                                        
                                        //if called from WebSocket or some other external data feed, need to call $apply(), else not
                                        //$timeout was too slow, not sure why and we don't need to do it all the time.
                                        
                                        //$timeout(function() {
                                        //    if (!self._private.datanodes[dataid].scope.$$phase)
                                        //        self._private.datanodes[dataid].scope.$apply();
                                        //});
                                    }
                                }
                            }
                        }
                    }

                    //now update our virtual names
                    for (var dataid in self._private.virtualnodes) {
                        for (var name in self._private.virtualnodes[dataid].data) {
                            if (name == 'FPS') {
                                self._private.virtualnodes[dataid].data[name].Value =
                                self._private.virtualnodes[dataid].data[name].ValueFormatted =
                                self.getInterval() + "ms" + "/" + self._private.FPS + "fps";
                            }
                            else
                            if (name == 'interval') {
                                self._private.virtualnodes[dataid].data[name].Value =
                                self._private.virtualnodes[dataid].data[name].ValueFormatted =
                                self.getInterval();
                            }
                            else
                            if (name == 'date') {
                                //no need to update Value, it is a Date object
                                self._private.virtualnodes[dataid].data[name].ValueFormatted = $filter('date')(self._private.virtualnodes[dataid].data[name].Value,'shortDate');
                            }
                            else
                            if (name == 'time') {
                                //no need to update Value, it is a Date object
                                self._private.virtualnodes[dataid].data[name].ValueFormatted = $filter('date')(self._private.virtualnodes[dataid].data[name].Value,'mediumTime');
                            }
                        }
                    }
                }
            };

            //$document[0].title = self._private.sessionid;

            //format locale according to the java standard
            var l = $locale.id.split(/[-_@;]/);
            if (l.length > 1) {
                self._private.lang    = l[0];
                self._private.country = l[1];
                self._private.locale  = self._private.lang + "-" + self._private.country;
            }
            else
            if (l.length > 0) {
                self._private.lang    = l[0];
                self._private.country = '';
                self._private.locale  = self._private.lang;
            }

            /**
             * Returns the URL to a Widget.
             * @method  getWidgetURL
             * @memberof SIMRacingApps~sraDispatcher
             * @param   {String} widget The name of the widget relative to the "widgets" folder
             * @returns {String} URL.
             * @author Jeffrey Gilliam
             */
            self.getWidgetUrl = function(widget) {
                //TODO: Tried using widgets and defined in angular.config.js, but doesn't work for locating templates
                return "/SIMRacingApps/widgets/"+widget;
            };

            //public Interfaces
            self.getInterval = function() {
                //the dispatcher main interval is the value set by the user or the lowest value by a Directive or default to 16ms
                return self._private.interval || self._private.lowestInterval || 200;
            };
            
            self.setInterfaceType = function(value) {
                self._private.interfaceType = self.InterfaceTypes[value.toUpperCase()] || self._private.interfaceType;
            };

            self.setInterval = function(value) {
                if (value) {
                    self._private.interval = value;

                    //now set any nodes faster than this to this interval
                    //otherwise, the server will be updating the cache fast than we're reading it
                    var dirty = false;
                    for (var dataid in self._private.post) {
                        for (var name in self._private.post[dataid]) {
                            if (self._private.post[dataid][name].Interval < value) {
                                console.log("sraDispatcher().setInterval() - changing ["+dataid+"]["+name+"].Interval from "+self._private.post[dataid][name].Interval+" to  "+value);
                                self._private.post[dataid][name].Interval = value;
                                dirty = true;
                            }
                        }
                    }

                    if (dirty) {
                        self._private.method = 'POST';
                        self._private.postjson = angular.toJson(self._private.post);
                    }
                }
                return self;
            };

            self.getPlay     = function() {
                return self._private.play;
            };
            self.setPlay     = function(value) {
                self._private.play     = value;
                return self;
            };

            self.getRecord   = function() {
                return self._private.record;
            };
            self.setRecord   = function(value) {
                self._private.record   = value;
                return self;
            };

            /**
             * Returns the first defined value that is truthy.
             * That means if it's a string, it's not blank. A number that's not zero. 
             * @memberof sraDispatcher 
             * @name getTruthy
             * @public
             */
            self.getTruthy = function() {
                for (var i=0; i < arguments.length; i++) {
                    if (typeof(arguments[i]) !== 'undefined')
                        if (arguments[i])
                            return arguments[i];
                }
                return "";
            };

            /**
             * Returns the first defined value that is falsy.
             * That means if it's a string, it's blank. A number that's zero. 
             * @memberof sraDispatcher 
             * @name getFalsy
             * @public
             */
            self.getFalsy = function() {
                for (var i=0; i < arguments.length; i++) {
                    if (typeof(arguments[i]) !== 'undefined')
                        if (!arguments[i])
                            return arguments[i];
                }
                return "";
            };
            
            /**
             * Returns the first defined value.
             * @memberof sraDispatcher 
             * @name getDefined
             * @public
             */
            self.getDefined = function() {
                for (var i=0; i < arguments.length; i++) {
                    if (typeof(arguments[i]) !== 'undefined')
                        return arguments[i];
                }
                return "";
            };
            
            /**
             * Returns the first defined value that evalulates to true or false.
             * Returns false if no defined values found.
             * @memberof sraDispatcher 
             * @name getBoolean
             * @public
             */
            self.getBoolean = function() {
                for (var i=0; i < arguments.length; i++) {
                    if (typeof(arguments[i]) !== 'undefined') {
                        if (String(arguments[i]).toLowerCase() === 'true' || String(arguments[i]) === '1' || String(arguments[i]).toLowerCase() === 'y')
                            return true;
                        if (String(arguments[i]).toLowerCase() === 'false' || String(arguments[i]) === '0' || String(arguments[i]).toLowerCase() === 'n')
                            return false;
                    }
                }
                return false;
            };
            
//            self.getZoom     = function() {
//                return self._private.zoom;
//            };
//            self.setZoom     = function(value) {
//                self._private.zoom     = value;
//                return self;
//            };

//            self.getWidth    = function(element,args) {
//
//                if (!args)
//                    args = {};
//
//                if (!args.percent)
//                    args.percent = 1;
//
//                //walk up the DOM tree until we find an element with a fixed width in px
//                var width = element.css('width');
//                if (!args.pixels && width.match(/px$/))
//                    args.pixels = width.match(/[0-9]/)[0];
//                else
//                if (width.match(/%$/)) {
//                    args.percent = (width.match(/[0-9]/)[0]/100.0);
//                }
//                var parent = element.parent();
//                parent.forEach( function(parent) {
//                    if (parent != document) {
//                        self.getWidth(parent,args);
//                    }
//                });
//                return args.pixels ? args.percent * args.pixels * self.getZoom() : args.percent * 800;
//            };

            self.resize = function ($scope,$element,defaultWidth,defaultHeight) {
                //add this to the top level div in the template to get IE to respond to the correct height as a percentage
                //when SVG object is used inside the template. Tested with Chrome 39, Firefox 35, Safari iOS8
                //ng-attr-style="height: {{height}}px;"
                var style        = null;
                var name         = $scope.directiveName;

                if (!angular.equals($scope.width,$element.prop('offsetWidth'))
                ||  !angular.equals($scope.parentWidth,$element.parent().prop('offsetWidth'))
                ) {
                    $scope.width     = $element.prop('offsetWidth');

                    $scope.parentWidth  = $element.parent().prop('offsetWidth');

                    if ($scope.horizontalAlign == "center") {
                        style = style || {};
                        style.left =  Math.round(($scope.parentWidth - $scope.width) / 2)+'px';
                        style.position = 'absolute';
                    }
                    else
                    if ($scope.horizontalAlign == "right") {
                        style = style || {};
                        style.left = Math.round($scope.parentWidth - $scope.width)+'px';
                        style.position = 'absolute';
                    }
                    else
                    if ($scope.horizontalAlign == "left") {
                        style = style || {};
                        style.left = (0)+'px';
                        style.position = 'absolute';
                    }
                }

                //to keep aspect ratios in balance with the width, always set these
                $scope.height    = ($scope.width / defaultWidth) * defaultHeight;
                $scope.fontSize  = ($scope.width / defaultWidth) * 100.0;
                
                if (!angular.equals($scope._height, $element.prop('offsetHeight'))
                ||  !angular.equals($scope._height, $scope.height)
                ||  !angular.equals($scope.parentHeight, $element.parent().prop('offsetHeight'))
                ) {
                    
                    $scope._height = $element.prop('offsetHeight');

                    $scope.parentHeight = $element.parent().prop('offsetHeight');

                    if ($scope.verticalAlign == "middle") {
                        style = style || {};
                        //use the real height in case the element is not using it.
                        style.top = Math.round(($scope.parentHeight - $scope._height) / 2)+'px';
                        style.position = 'absolute';
                    }
                    else
                    if ($scope.verticalAlign == "bottom") {
                        style = style || {};
                        style.top = Math.round($scope.parentHeight - $scope._height)+'px';
                        style.position = 'absolute';
                    }
                    else
                    if ($scope.verticalAlign == "top") {
                        style = style || {};
                        style.top = (0)+'px';
                        style.position = 'absolute';
                    }
                }

                if (style)
                    $element.css(style);

                return function($event) {
                    self.resize($scope, $element, defaultWidth, defaultHeight);
                };
            };


            self.State = {
                isOFF:              function (v) { return v === "OFF"; },
                isERROR:            function (v) { return v === "ERROR"; },
                isNORMAL:           function (v) { return v === "NORMAL";},
                isAPPROACHINGLIMIT: function (v) { return v === "APPROACHINGLIMIT";},
                isLIMIT:            function (v) { return v === "LIMIT";},
                isOVERLIMIT:        function (v) { return v === "OVERLIMIT";},
                isWAYOVERLIMIT:     function (v) { return v === "WAYOVERLIMIT";},
                isWARNING:          function (v) { return v === "WARNING";},
                isSHIFTLIGHTS:      function (v) { return v === "SHIFTLIGHTS";},
                isSHIFT:            function (v) { return v === "SHIFT";},
                isSHIFTBLINK:       function (v) { return v === "SHIFTBLINK";},
                isCRITICAL:         function (v) { return v === "CRITICAL";}
            };

            self.uniq = function(a) {
                var seen = {};
                var out = [];
                var len = a.length;
                var j = 0;
                for(var i = 0; i < len; i++) {
                     var item = a[i];
                     if(seen[item] !== 1) {
                           seen[item] = 1;
                           out[j++] = item;
                     }
                }
                return out;
            };

            self.getTranslation = function(path,lang/*,key1 [,key2]...*/) {
                if (!lang) lang="auto";

                var baselanguage = lang.split(/[-_]/)[0].toLowerCase();
                var languages = self.uniq([lang.toLowerCase(),baselanguage,self._private.locale,self._private.lang,'en-us','en']);
                var value = null;
                if (self._private.translationTable[path]) {
                    for (var i=0; i < languages.length; i++) {
                        var language = languages[i];
                        if (self._private.translationTable[path][language]) {
                            var newvalue = self._private.translationTable[path][language];
                            for (var argc=2; argc < arguments.length; argc++) {
                                newvalue = newvalue[arguments[argc]];
                                if (!newvalue)
                                    break;
                            }
                            //if we alreay have a value and it is an object
                            //and the new value is an object, then merge the objects preserving the value if it already exists
                            //this will enable translations as a group to fall back to the defaults if a key is missing
                            if (angular.isObject(value) && angular.isObject(newvalue)) {
                                for (var v in newvalue) {
                                    if (!value[v])
                                        value[v] = newvalue[v];
                                }
                            }
                            else {
                                if (!value)
                                    value = newvalue;
                            }
                        }
                    }
                }
                return value ? value : arguments[arguments.length-1];
            };

            self.extendDeep = function extendDeep(dst) {
                angular.forEach(arguments, function(obj) {
                  if (obj !== dst) {
                    angular.forEach(obj, function(value, key) {
                      if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                        extendDeep(dst[key], value);
                      } else {
                        dst[key] = value;
                      }
                    });
                  }
                });
                return dst;
            };

            self._loadTranslation = function(path,prefix,lang,callback) {
                var request = {
                        method:  "GET",
                        cache:   false,
                        timeout: 6000,
                        url:     path + '/nls/' + prefix + '-' + lang + '.json?cacheblocker='+SIMRacingAppsCache
                };

                if (self._private.translationTable.pathsLoaded[request.url]) {
                    if (callback && angular.isFunction(callback))
                        callback();
                    return;
                }

                $http(request)
                .success(function(data, status, headers, config) {
                    if (data) {
                        var v = {};
                        v[path] = {};
                        v[path][lang] = data;
                        self.extendDeep(self._private.translationTable,v);
                    }
                    self._private.translationTable.pathsLoaded[request.url] = 'success';
                    if (callback && angular.isFunction(callback))
                        callback();
                })
                .error(function() {
                    self._private.translationTable.pathsLoaded[request.url] = 'error';
                    if (callback && angular.isFunction(callback))
                        callback();
                });
            };

            self.loadTranslations = function(path,prefix,callback) {
                if (callback && angular.isObject(callback)) {
                    self._loadTranslation(path, prefix, callback.lang);
                }
                else {
                    self._loadTranslation(path, prefix, self._private.locale,function() {
                        self._loadTranslation(path, prefix, self._private.lang,function() {
                            self._loadTranslation(path, prefix, 'en-us',function() {
                                self._loadTranslation(path, prefix, 'en',function() {
                                    if (callback && angular.isFunction(callback))
                                        callback(path);
                                });
                            });
                        });
                    });
                }
            };

            self.offsetLeft = function(element,offset) {
                if (element) {
                    offset += element.offsetLeft;
                    return self.offsetLeft(element.offsetParent,offset);
                }
                return offset;
            };

            self.offsetTop = function(element,offset) {
                if (element) {
                    offset += element.offsetTop;
                    return self.offsetTop(element.offsetParent,offset);
                }
                return offset;
            };

            self.onClick = function($scope,element,callback) {

//Warning: these are commented out because they cause rendering problems.                
//                $element[0].style.userSelect = "none";
//                $element[0].style.msUserSelect = "none";
//                $element[0].style.webkitUserSelect = "none";
//                $element[0].onselectstart = 'return false;';
//                $element[0].unselectable='on'; //for Opera

                if (self.onClickQueue.length == 0) {

                    //don't let touch screens select the text
                    $document[0].body.style.userSelect = "none";
                    $document[0].body.style.msUserSelect = "none";  //IE
                    $document[0].body.style.webkitUserSelect = "none";
                    $document[0].body.onselectstart = 'return false;';
                    $document[0].body.unselectable='on'; //for Opera
                    $document[0].body.style.cursor = "pointer"; //iOS Safari
                    
                    //TODO: fix ng-click doesn't work on the element. Workaround is to catch event on the body and simulate it.
                    $document[0].body.ontouchstart = $document[0].body.onclick = function(event) {
                        var x = event.x || event.clientX || event.offsetX || event.layerX;
                        var y = event.y || event.clientY || event.offsetY || event.layerY;
                        
                        console.log("onclick("+x+","+y+")");
                        for (var i=0; i < self.onClickQueue.length; i++) {
                            var e = self.onClickQueue[i].element[0];
                            var left   = self.offsetLeft(e,0);
                            var top    = self.offsetTop(e,0);
                            var width  = e.offsetWidth;
                            var height = e.offsetHeight;
                            var myEvent = {
                                    offsetWidth:  e.offsetWidth,
                                    offsetHeight: e.offsetHeight,
                                    offsetX: x - left,
                                    offsetY: y - top
                                };
//$document[0].getElementById("FPS").innerHTML = "body.offset = "+myEvent.offsetX+","+myEvent.offsetY;
//$document[0].getElementById("FPS").style.display = "block";
                            //adjust these to be relative to our element and only pass in what we're using for now.
                            //Firefox doesn't have offsetX and Y, therefore use layerX and Y. Not sure what the standard is.
                            if (myEvent.offsetX >= 0 && myEvent.offsetY >= 0 && myEvent.offsetX < width && myEvent.offsetY < height)
                                self.onClickQueue[i].callback(myEvent);
                        }
                        $scope.$apply();
                    };
                }

                //this didn't work because the element is within the webview tag and it needs to be outside somehow.
                //leaving here commented out to document it
                //element.css({ "-webkit-app-region": "no-drag" });
                
                self.onClickQueue.push({ element: element, callback: callback});
                
            };

            self._commandQueue = {};

            self.sendCommand = function(command) {
                var request = {
                    method:  'GET',
                    url:     '/SIMRacingApps/Data',
                    cache:   false,
                    timeout: 15000,
                    params: {
                        sessionid: Date.now(),
                        data: command
                    }
                };

                if (!(command in self._commandQueue) || self._commandQueue[command] !== "queued") {

                    self._commandQueue[request.params.data] = "queued";

                    $http(request)
                    .success(function(data, status, headers, config) {
                        console.log("sraDispatcher.sendCommand("+config.params.data+"): success, data = " + data);
                        self._commandQueue[config.params.data] = "success";
                     })
                    .error(function(data, status, headers, config) {
                        console.log("sraDispatcher.sendCommand("+config.params.data+"): error - "+status+', data = ' + data);
                        self._commandQueue[config.params.data] = "error";
                    });
                }
            };

            self.subscribe = function($scope,$attrs,defaultInterval) {
                if (!$scope || !$attrs)
                    return [];

                var p_id       = $attrs.id ? $attrs.id : $scope.$id;
                var p_name     = $scope.sraArgsDATA   || $attrs.sraArgsData         || $attrs.sraData   || "";
                var p_format   = $scope.sraArgsFORMAT || $attrs.sraArgsFormat       || $attrs.sraFormat || "";
                var p_uom      = $scope.sraArgsUOM    || $attrs.sraArgsUom          || $attrs.sraUom    || "";
                var p_lang     = $scope.sraArgsLANG   || $attrs.sraArgsLang         || $attrs.sraLang   || "";
                var p_interval = ($scope.sraInterval = $scope.sraArgsINTERVAL || $attrs.sraArgsInterval || $attrs.sraInterval || defaultInterval) || 200;

                //clean up the name and remove leading and trailing semi-colons
                p_name = p_name.replace(/^;/,"").replace(/;$/,"");

                //create the data object if not already there
                if (!$scope.data)
                    $scope.data = {};

                if (p_id)
                    p_id += "-";

                if (!p_interval || p_interval == "undefined")
                    p_interval=self.getInterval();
                else
                if (!self._private.lowestInterval || p_interval < self._private.lowestInterval)
                    self._private.lowestInterval = p_interval;

                if (p_name != null && p_name !== '') {
                    var v_names   = p_name.split(/;/);
                    var v_uoms    = p_uom.split(/;/);
                    var v_formats = p_format.split(/;/);
                    var v_langs   = p_lang.split(/;/);
                    var datanode  = {
                            attrs:  $attrs,
                            name:   p_name,
                            dataid: p_id + p_name.replace(/(\r\n|\n|\r)/gm,""),
                            scope:  $scope,
                            data:   $scope.data,
                            names:  {}
                    };

                    self._private.post[datanode.dataid] = {};   //initialize the server request object

                    for (var i=0; i < v_names.length; i++) {
                        var name   = v_names[i].replace(/(\r\n|\n|\r)/gm,"").trim();
                        var uom    = i < v_uoms.length    ? v_uoms[i].replace(/(\r\n|\n|\r)/gm,"").trim()    : "";
                        var format = i < v_formats.length ? v_formats[i].replace(/(\r\n|\n|\r)/gm,"").trim() : "";
                        var lang   = i < v_langs.length   ? v_langs[i].replace(/(\r\n|\n|\r)/gm,"").trim()   : "";
                        var data;

                        //make sure any client side lang overrides are loaded
                        if (lang) {
                            self.loadTranslations("/SIMRacingApps/lib","text",{lang: lang});
                        }

                        //interval, now and FPS are not server side objects
                        //so set them up so they are not sent to the server, but update them every time through the loop.
                        if (name == 'interval') {
                            data = {
                                Name:         name,
                                Format:       format,
                                Value:        0,
                                ValueFormatted: "0",
                                Type:         "INTEGER",
                                UOM:          "ms",
                                UOMAbbr:      "ms",
                                UOMDesc:      "Milliseconds",
                                State:        'NORMAL',
                                StatePercent: 0.0,
                                Lang:         lang
                            };
                            self._private.virtualnodes[datanode.dataid] = datanode;
                        }
                        else
                        if (name == "FPS") {
                            data = {
                                Name:         name,
                                Format:       format,
                                Value:        0,
                                ValueFormatted: "0",
                                Type:         "INTEGER",
                                UOM:          "",
                                UOMAbbr:      "",
                                UOMDesc:      "",
                                State:        'NORMAL',
                                StatePercent: 0.0,
                                Lang:         lang
                            };
                            self._private.virtualnodes[datanode.dataid] = datanode;
                        }
                        else
                        if (name == 'date') {
                            data = {
                                Name:         name,
                                Format:       format,
                                Value:        self._private.time,
                                ValueFormatted: $filter('date')(self._private.time,format ? format : 'shortDate'),
                                Type:         "DATE",
                                UOM:          "date",
                                UOMAbbr:      "date",
                                UOMDesc:      "Date",
                                State:        'NORMAL',
                                StatePercent: 0.0,
                                Lang:         lang
                            };
                            self._private.virtualnodes[datanode.dataid] = datanode;
                        }
                        else
                        if (name == 'time') {
                            data = {
                                Name:         name,
                                Format:       format,
                                Value:        self._private.time,
                                ValueFormatted: $filter('date')(self._private.time,format ? format : 'mediumTime'),
                                Type:         "DATE",
                                UOM:          "date",
                                UOMAbbr:      "date",
                                UOMDesc:      "Date",
                                State:        'NORMAL',
                                StatePercent: 0.0,
                                Lang:         lang
                            };
                            self._private.virtualnodes[datanode.dataid] = datanode;
                        }
                        else {
                            self._private.method = 'POST';

                            if (!lang)
                                lang = self._private.locale;

                            //convert to server(java) style
                            var l = lang.split(/[-_@]/);
                            var v_langJava = l[0].toLowerCase();

                            if (l.length > 1)
                                v_langJava += "_" + l[1].toUpperCase() + (l.length > 2 ? '@'+l.slice(2,99) : "");

                            //setup the request to the server in the post object
                            self._private.post[datanode.dataid][name] = {
                                    Name:     name,
                                    UOM:      uom,
                                    Format:   format,
                                    Lang:     v_langJava,
                                    Interval: p_interval * 1
                            };

                            //console.log('sraDispatcher.subscribe('+angular.toJson(self._private.post[datanode.dataid][name])+')');

                            //now initialize the name on the $scope to be watched for
                            data = {
                                Name:         name,
                                Format:       format,
                                Value:        "",
                                ValueFormatted: "",
                                Type:         "STRING",
                                UOM:          "",
                                UOMAbbr:      "",
                                UOMDesc:      "",
                                State:        'OFF',
                                StatePercent: 0.0,
                                Lang:         lang
                            };
                        }

                        //store this name in the hash
                        datanode.names[name] = {
                            name:   data.Name,
                            format: data.Format,
                            uom:    data.UOM,
                            lang:   data.Lang
                        };

                        self._private.saveData($scope.data,name,data);  //initialize the scope data with default values

                    }

                    self._private.datanodes[datanode.dataid] = datanode;    //save this datanode in cache of datanodes

                    self._private.postjson = angular.toJson(self._private.post);

                    //bootstrap the dispatcher. It will keep itself going
                    if (self._private.timeoutid == null) {
                        self._private.timeoutid = $timeout(this.dispatchEvents, self.getInterval());
                        console.log("sraDispatcher.dispatchEvents(interval="+self.getInterval()+", play="+self.getPlay()+", record="+self.getRecord()+')');
                    }

                    return v_names;
                }
                return [];
            };

            self.dispatchEvents = function() {

                //all interface types must submit a POST first to associate the data requested with the sessionid
                //the all other types just send the sessionid to subscribe for fetch the data for that sessionid
                var request = {
                    method:  self._private.method,
                    url:     '/SIMRacingApps/Data',
                    cache:   false,
                    data:    self._private.method == 'POST' ? self._private.postjson : null,
                    timeout: 5000,
                    params: {
                        sessionid: self._private.sessionid,
                        counter:   self._private.counter++,  //to help the browser to stop caching
                        play:      $location.search().play   || self._private.play,
                        record:    $location.search().record || self._private.record,
                        interval:  self.getInterval()
                    }
                };

                //set this before we call the server because I am allowing more than one call to subscribe and it is additive
                //Had the problem when I was setting this in the .success function, that subscribe calls
                //were occuring while we were waiting for the response from the first call
                self._private.method = "GET";  //we can switch over to GETs now that we've done a POST

                if (self._private.interfaceType == self.InterfaceTypes.HTTP || request.method == 'POST') {
                    if (request.method == 'POST') {
                        console.log('sraDispatcher.dispatchEvents().POST, interfaceType='+self._private.interfaceType+', sessionid='+request.params.sessionid+', interval='+request.params.interval);
                        //console.log(request.data);
                    }
                
                    $http(request)
                        .success(function(data, status, headers, config) {
    
                            self._private.processData(data);
                            
                            if (self._private.timeoutid)
                                $timeout.cancel(self._private.timeoutid);
                            self._private.timeoutid = $timeout(self.dispatchEvents, self.getInterval());
//This is called in processData(). Don't need to do it again.                            
//                            if ($rootScope.sraOnResize)
//                                $rootScope.sraOnResize();
                        })
                        .error(function(data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            console.log("sraDispatcher.dispatchEvents(): error - "+status);
                            console.log(data);
    
                            //just keep trying...
                            self._private.method = "POST";
                            if (self._private.timeoutid)
                                $timeout.cancel(self._private.timeoutid);
                            self._private.timeoutid = $timeout(self.dispatchEvents, self.getInterval());
                        });
                }
                else
                if (self._private.interfaceType == self.InterfaceTypes.WEBSOCKET || self._private.interfaceType == self.InterfaceTypes.STREAMING) {
                    if (!self._private.websocket) { 
                        // Create a new instance of the websocket back to the server that started this script
                        self._private.websocket = new WebSocket("ws://"+$location.host()+":"+$location.port()+"/SIMRacingApps" + self._private.interfaceType);
                      
                        self._private.websocket.onopen = function() {
                             console.log(self._private.interfaceType + ": Connection opened, sending sessionid="+request.params.sessionid);
                             self._private.websocket.send(request.params.sessionid+";"+request.params.interval);
                        };
      
                        self._private.websocket.onmessage = function(event) {
                            $rootScope.$apply(function() {
                                try {
                                    self._private.processData(angular.fromJson(event.data));
                                } catch (err) {
                                    console.log(event.data);
                                    self._private.websocket.close();
                                    throw err;
                                }
                                if (self._private.interfaceType == self.InterfaceTypes.WEBSOCKET)
                                    if (self._private.timeoutid)
                                        $timeout.cancel(self._private.timeoutid);
                                    self._private.timeoutid = $timeout(self.dispatchEvents, self.getInterval());
                            });
                        };
      
                        self._private.websocket.onerror = function(event) {
                            console.log(self._private.interfaceType + ": Connection error, closing...");
                            self._private.websocket.close();
                        };

                        self._private.websocket.onclose = function(event) {
                             console.log(self._private.interfaceType + ": Connection closed");
                             self._private.websocket = null;
                             
                             //just keep trying...
                             self._private.method = 'POST';
                             if (self._private.timeoutid)
                                 $timeout.cancel(self._private.timeoutid);
                             self._private.timeoutid = $timeout(self.dispatchEvents, self.getInterval());
                        };
                    }
                    else {
                        //should only get here if interfaceType == WEBSOCKET
                        //this polls the server for another packet each interval
                        self._private.websocket.send(request.params.sessionid);
                    }
                }
                else
                if (self._private.interfaceType == self.InterfaceTypes.WEBEVENT) {
                    if (!self._private.webevent) { 
                        self._private.webevent = new EventSource("/SIMRacingApps" + self._private.interfaceType + "?sessionid=" + request.params.sessionid + "&interval=" + request.params.interval);
                      
                        self._private.webevent.onmessage = function(event) {
                            $rootScope.$apply(function() {
                                self._private.processData(angular.fromJson(event.data));
                            });
                        };
                        self._private.webevent.onerror = function(event) {
                            console.log(self._private.interfaceType + ": Connection error, closing...");
                            self._private.webevent.close();
                        };
                        self._private.webevent.onclose = function(event) {
                            console.log(self._private.interfaceType + ": Connection closed");
                            self._private.webevent = null;
                            
                            //just keep trying...
                            self._private.method = 'POST';
                            if (self._private.timeoutid)
                                $timeout.cancel(self._private.timeoutid);
                            self._private.timeoutid = $timeout(self.dispatchEvents, self.getInterval());
                       };
                    }
                }
            };
        };

        console.log("Creating sraDispatcher()");

        //TODO: only one sraDispatcher across all modules. Test if multiple modules on the same page calls this more than once.
        if (!$rootScope.sraDispatcher)
            app.Dispatcher = $rootScope.sraDispatcher = new sraDispatcher();
        return $rootScope.sraDispatcher;
    }
    app.module.factory('sraDispatcher',['$rootScope','$locale','$timeout','$http','$filter','$location','$document','$window', app.sraDispatcher]);

    /**
     * The main controller for SIMRacingApps.
     * This copies any variables from the URL query string to $scope. 
     * It prepends "sraArgs" to the variable name after converting it to uppercase.
     * <p>
     * For example: ?somevar=somevalue<br />
     * gets added to $scope.sraArgsSOMEVAR = somevalue
     * <p>
     * This controller also loads the global translation files that are used for translating any values returned from the server.
     * <p>
     * If the browser's debugger is active, it will stop on the "debugger" statement. 
     * That allows you to add your own break points in your code, then continue.
     * @ngdoc controller
     * @name sraController
     * @author Jeffrey Gilliam
     */
    app.module.controller('sraController',
           ['$scope', 'sraDispatcher', '$location',
    function($scope,   sraDispatcher, $location) {

        var args = $location.search();
        for (var arg in args) {
            //since the documentation shows the Angular version of the variables
            //using hyphens, let the users add them to the URL, then strip them out
            //to put in the $scope.sraArgs* values. Client code then needs to only
            //check for the variable in one form and in uppercase.
            //Added in 1.6
            $scope['sraArgs'+arg.toUpperCase().replace(/-/g,'')] = args[arg];
        }
        sraDispatcher.loadTranslations("/SIMRacingApps/lib","text",function(path) {
            sraDispatcher.translations = sraDispatcher.getTranslation(path);
        });
debugger;   //All .js files should be loaded by this point.
    }]);

    /**
     * This directive is the most basic directive available. 
     * It simply subscribes to data from the server and updates $scope.data with the values.
     * When that happens, Angular is envolked, through watches, to update the DOM.
     * <p>
     * There are 2 ways to use all SIMRacingApps directives.
     * You can either use them as a DOM Element, or an attribute to another DOM Element.
     * You cannot add them as an attribute to other directives. 
     * Each directive is designed to take complete ownership of the DOM Element it is attached to.
     * <p>
     * Example as Element:
     * <p><b>
     * &lt;sra-data data-sra-data="/Car/REFERENCE/Description" data-ng-bind="data.Car.REFERENCE.Description.ValueFormatted"&gt;&lt;/sra-data&gt;
     * </b>
     * <P>
     * For detailed information on the available Data paths, see the <a href="../JavaDoc/com/SIMRacingApps/SIMPlugin.html">SIMPlugin</a> documentation.
     * From that page, ignore the information about how to use it from Java, but look at the paths available. 
     * Click on them to get to the details about each path. Each Java method that supports paths has a "PATH = x" in the documentation.
     * <p>
     * Example as an attribute of an Element:
     * <p><b>
     * &lt;div data-sra-data="/Car/REFERENCE/Description" data-ng-bind="data.Car.REFERENCE.Description.ValueFormatted"&gt;&lt;/div&gt;
     * </b>
     * <p>
     * As you can see, there is not much difference in the two, but it does change how you will reference it in CSS.
     * <p>
     * If you pass in a function to call when this object is clicked, when clicked, 
     * the function is called with the $scope and value as arguments.
     * This function can then use the setClickedState() and getClickedState() methods on $scope. 
     * @ngdoc directive
     * @name sra-data
     * @param {String} data-sra-data The path to the SIM data.
     * @param {String} data-sra-args-on-click (Optional) function to call if this object is clicked
     * @author Jeffrey Gilliam
     */
    app.module.directive('sraData',
            ['sraDispatcher',
     function(sraDispatcher) {
         return {
             restrict: 'EA',
             scope: true,
//             require: ['sraData'],
             controller: [ '$scope', function($scope) {
                 $scope.directiveName   = 'sraData';

//do not do this in the sraData directive as it will override the widget it is used in. Need it to inherit it
//                 $scope.defaultWidth    = 800;
//                 $scope.defaultHeight   = 480;
//                 $scope.defaultInterval = 200;
                 
                 $scope.sraOnClick      = "";
                 $scope.clickedState    = 'none'; //either none or clicked
                 $scope.getClickedState = function() { return $scope.clickedState; };
                 $scope.setClickedState = function(state) { $scope.clickedState = state || 'none'; };
                 
                 $scope.onClickListener = function() {
                     if (angular.isFunction($scope[$scope.sraOnClick]))
                         $scope[$scope.sraOnClick]($scope,$scope[$scope.sraData],$scope.sraOnClickArg);
                 }
             }],
             link: function($scope,$element,$attrs) {

                 //save some of the attributes we need in this controller
                 var value    = $scope.sraData = $attrs.sraData = $attrs.sraData || $attrs.sraArgsData || $attrs.sraArgsValue;
                 $scope.sraData = $attrs.sraArgsData = value;
                 $scope.sraOnClick = $attrs.sraArgsOnClick;
                 $scope.sraOnClickArg = $attrs.sraArgsOnClickArg || "";

//if ($attrs.name == "leader") debugger;

                 if ($scope.sraOnClick)
                     sraDispatcher.onClick($scope,$element,$scope.onClickListener);

                 //This directive alway uses parent's interval unless directly assigned.
                 $scope.names = sraDispatcher.subscribe($scope,$attrs,$scope.sraArgsINTERVAL || $attrs.sraArgsInterval || $attrs.sraInterval || $scope.$parent.sraInterval); //register subscriptions and options to the dispatcher

 //TODO: figure out how to bind in a new value
//                 //if the element is empty, then add the value of the first name as the default
//                 var html = element.html().trim();
//                 if (!html && self.names.length)
//                     element.append("<span>{{data.['"+self.names[0]+"'].Value</span>");
             }
         };
     }]);

//this didn't get called before all other directives, so I move this to the sraController to populate the scope.
//    app.module.directive('sraParseArgs',[
//    function () {
//        return function ($scope, $element, $attrs) {
//            for (var attr in $attrs) {
//                if (attr.match(/^sraArgs/) != null) {
//                    $scope[attr] = $attrs[attr];
//                }
//            }
//        };
//    }]);
//
    /**
     * This directive is used to horizontally align withing the div it is added to.
     * This directive can only be added as an attribute.
     * It can be added to elements with other directives.
     * <p><b>
     * &lt;div data-sra-horizontal-align="center"&gt;center&lt;/div&gt;
     * </b>
     * <p>NOTE: For this to work, each App and Widget must watch for the resize event broadcast via $rootScope.$on('sraResize') 
     * and call the sraDispatcher.resize() method
     * @ngdoc directive
     * @name sra-horizontal-align
     * @param {String} sra-args-horizontal-align (Optional) One of the following values: "center", "left", "right", default = "center"
     * @author Jeffrey Gilliam
     */
    app.module.directive('sraHorizontalAlign',[
    function () {
        return function ($scope, $element, $attrs) {
            $scope.horizontalAlign = $attrs.sraArgsHorizontalAlign || $attrs.sraHorizontalAlign || "center";
        };
    }]);

    /**
     * This directive is used to vertically align withing the div it is added to.
     * This directive can only be added as an attribute.
     * It can be added to elements with other directives.
     * <p><b>
     * &lt;div data-sra-vertical-align="center"&gt;middle&lt;/div&gt;
     * </b>
     * <p>NOTE: For this to work, each App and Widget must watch for the resize event broadcast via $rootScope.$on('sraResize') 
     * and call the sraDispatcher.resize() method
     * 
     * @ngdoc directive
     * @name sra-vertical-align
     * @param {String} data-sra-vertical-align (Optional) One of the following values: "middle", "top", "bottom", default = "middle"
     * @author Jeffrey Gilliam
     */
    app.module.directive('sraVerticalAlign',[
    function () {
        return function ($scope, $element, $attrs) {
            $scope.verticalAlign = $attrs.sraArgsVerticalAlign || $attrs.sraVerticalAlign || "middle";
        };
    }]);

    /**
     * This directive watches for window resize events and adjust the width and height of the parent element.
     * If you used percentages for the sizing of all the children, then they will adjust accordingly as well.
     * It is to be placed on the most outer element of the page that is not the body.
     * @ngdoc directive
     * @name sra-resize
     * @author Jeffrey Gilliam
     */
    app.module.directive('sraResize',[
             '$window','$rootScope',
    function ($window,  $rootScope) {
        return function ($scope, $element, $attrs) {

            function resize () {
                var name          = $scope.directiveName;
                var windowWidth   = $scope.windowWidth  = $window.innerWidth;
                var windowHeight  = $scope.windowHeight = $window.innerHeight;

                //if user supplied a zoom argument, then don't resize
                if (!app.zoom) {
                    //TODO: Should this be the parent's size? offsetWidth, offsetHeight
                    var zoom          = 1;

                    //calculate based on dominate side to keep entire app in viewport
                    if (windowWidth < (windowHeight * (app.defaultWidth/app.defaultHeight)))
                        zoom = windowWidth / app.defaultWidth;
                    else
                        zoom = windowHeight / app.defaultHeight;

                    $scope.windowWidth    = app.defaultWidth    * zoom;
                    $scope.windowHeight   = app.defaultHeight   * zoom;
                    $scope.windowFontSize = app.defaultFontSize * zoom;

                    var left = windowWidth  > $scope.windowWidth  ? ((windowWidth  - $scope.windowWidth)/2)  : 0;
                    var top  = windowHeight > $scope.windowHeight ? ((windowHeight - $scope.windowHeight)/2) : 0;

                    //console.log('('+windowWidth+','+windowHeight+') Left: ' + left + ', Top: ' + top + ', Width: '+ $scope.windowWidth + ', Height: ' + $scope.windowHeight + ', FontSize: '+ $scope.windowFontSize);

                    //** If want to apply style on element, can do something like:
                    var elemStyle = {
                        width:    $scope.windowWidth    + 'px',
                        height:   $scope.windowHeight   + 'px',
                        left:     left                  + 'px',
                        top:      top                   + 'px',
                        fontSize: $scope.windowFontSize + 'px'
                    };

                    $element.css(elemStyle);
                }
                //now broadcase this to anybody who want's to know the main window was resized.
                $rootScope.$emit('sraResize',windowWidth,windowHeight,$scope.windowWidth,$scope.windowHeight);
            }
            resize();

            $rootScope.sraOnResize = function() {
                resize();
            };

            $window.onresize = function () {
                resize();
                $scope.$apply();
            };
            $window.orientationChanged = function () {
                resize();
                $scope.$apply();
            };
        };
    }]);

    /**
     * Converts a dash separated name to CamelCase according to Angulars conversion rules.
     * @private
     * @param {string} s String to convert
     * @return {string} s converted CamelCase
     * @author Jeffrey Gilliam
     */
    app.camelCaseToDash = function(s) {
        if (!s)
            return s;
        var v = "";
        if (s && s.length) {
            v = s.substr(0,1).toLowerCase();
            for (var j=1; j < s.length; j++) {
                var c = s.substr(j,1);
                if (c === "/") {
                    v = v + '-' + s.substr(++j,1).toLowerCase();
                }
                else {
                    if (c.match(/[A-Z]/))
                        v = v + '-';
                    v = v + c.toLowerCase();
                }
            }
        }
        return v;
    };

    /**
     * This function should be called from the main js file to initialize the DOM prior to Angular being bootstrapped.
     * Note that any code here is restricted to the require and angular global functions
     * @param {angular.element} rootElement The element that Angular will attach to. Usually the body in my design.
     * @author Jeffrey Gilliam
     */
    app.start = function(rootElement,defaultWidth,defaultHeight,defaultFontSize) {  var self=this;

//debugger;  //Before Angular has been initialized.

        var search = window.location.search;
        app.rootElement = rootElement;

        var widgetname = "";
        var widget = null;
        var fontpercent = 100.0;
        var interval = null;
        var interfaceType = null;
        var referenceCar = null;
        var vars = {};
        var applicationElement = angular.element(document.getElementById("SIMRacingApps-App"));
        var fpsElement         = angular.element(document.getElementById("FPS"));
        var argsHeight;
        var argsWidth;
        var argsFontSize;

        fpsElement.css({display: "none"});
        rootElement.attr("data-ng-controller", "sraController");
        rootElement.attr("data-sra-data",      "FPS;interval;date;time"); //make these available to all apps/widgets

        //TODO: can angular or JQuery do this for me?
        var i18n = 'i18n/angular-locale_';

//this technique did not work because tomcat is not returning the content-language header
//        var req = new XMLHttpRequest();
//        req.open('GET', document.location, false);
//        req.send(null);
//        var headers = req.getAllResponseHeaders().toLowerCase();
//        var contentLanguage = headers.match( /^content-language\:(.*)$/gm );
//        if(contentLanguage[0]) {
//            var lang = contentLanguage[0].split(":")[1].trim().toUpperCase();
//        }

        //this method confirmed with IE
        if (window.navigator.userLanguage)
            i18n += window.navigator.userLanguage.toLowerCase().split(/[-_]/).join('-');
        else
        if (window.navigator.language)
            //this method confirmed with FireFox, Chrome, Safari iOS8
            i18n += window.navigator.language.toLowerCase().split(/[-_]/).join('-');
        else
            i18n += 'en';

        if (search) {
            //now parse the URL search string for arguments we need before bootstrapping angular
            search = search.split(/[\?&]/);

            for (var i=0; i < search.length; i++) {
                var s = search[i].split("=");

                //convert the argument from CamelCase to dash format. The URL can be specified either way.
                //(i.e. CarNumber becomes car-number)
                v = self.camelCaseToDash(decodeURIComponent(s[0])); //.replace(/%2F/g,'/'));

                if (s.length > 1) {
                    vars[v] = decodeURIComponent(s[1]); //.replace(/%2F/g,'/');

                    if (s[0].toLowerCase() == "interval") {
                        interval = s[1];
                        app.interval = interval;
                        app.defaultInterval = interval;
                    }
                    else
                    if (s[0].toLowerCase() == "interface" || s[0].toLowerCase() == "interfacetype") {
                        interfaceType = s[1];
                    }
                    else
                    if (s[0].toLowerCase() == "defaultwidth") {
                        argsWidth = s[1] * 1.0;
                    }
                    else
                    if (s[0].toLowerCase() == "defaultheight") {
                        argsHeight = s[1] * 1.0;
                    }
                    else
                    if (s[0].toLowerCase() == "defaultfontsize") {
                        argsFontSize = s[1] * 1.0;
                    }
                    else
                    if (s[0].toLowerCase() == "fontpercent") {
                        fontpercent = s[1] * 1.0;
                    }
                    else
                    if (s[0].toLowerCase() == "backgroundcolor") {
                        rootElement.css("background","");
                        rootElement.css("backgroundColor", decodeURIComponent(s[1]));
                        rootElement.css("backgroundImage","url()");
                        angular.forEach(rootElement.find("div"), function(value) {
                            var element = angular.element(value);
                            if (element.hasClass("SIMRacingApps-App")) {
                                element.css("background","");
                                element.css("backgroundColor", decodeURIComponent(s[1]));
                                element.css("backgroundImage","url()");
                            }
                        });
                    }
                    else
                    if (s[0].toLowerCase() == "color") {
                        rootElement.css("color", decodeURIComponent(s[1]));
                        angular.forEach(rootElement.find("div"), function(value) {
                            var element = angular.element(value);
                            if (element.hasClass("SIMRacingApps-App")) {
                                element.css("color", decodeURIComponent(s[1]));
                            }
                        });
                    }
                    else
                    if (s[0].toLowerCase() == "referencecar" || s[0] == "reference") {
                        referenceCar = s[1];
                    }
                    else
                    if (s[0].toLowerCase() == "lang") {
                        i18n = 'i18n/angular-locale_'+s[1].toLowerCase().split(/[-_]/).join('-');
                    }
                    else
                        if (s[0].toLowerCase() == "widget") {
                            widget     = decodeURIComponent(s[1]); //.replace(/%2F/g,'/');
                            widgetname = widget.split(/\//).pop();
                        }
                    else
                    if (s[0].toLowerCase() == "zoom") {
                        app.zoom=s[1];
//                        applicationElement.css({
//                            width:    (s[1]*100.0)+'%',
//                            height:   (s[1]*100.0)+'%',
//                            fontSize: (s[1]*100.0)+'%'
//                        });
//                        fpsElement.css({fontSize: (s[1]*100.0)+'%'});
                    }
                }
                else {
                    vars[v] = "";
                }

                if (v == "show-f-p-s") {
                    fpsElement.css({display: "block"});
                }
            }

            //now place all the arguments on the application element incase it wants to use them
            for (var v in vars) {
                if (v && v != "widget")
                    applicationElement.attr("data-sra-args-"+v,vars[v]);
            }

            if (interval) {
                console.log('Interval='+interval);
                rootElement.attr("data-sra-interval", interval);
                rootElement.attr("data-sra-args-interval", interval);
            }
        }
        console.log("Loading i18n = "+i18n);

        if (!applicationElement.length) {
            var err = "Cannot find element with id='SIMRacingApp'";
            console.log(err);
            angular.element(document.body).prepend( "<div class='SIMRacingAppsError'>"+err+"</div>" );
        }
        else
        if (widget) {
            applicationElement.attr(
                "data-sra-"+self.camelCaseToDash(vars["widget"]),
                vars[self.camelCaseToDash(vars["widget"])] || ""
            );

            document.title = widget;
            ga('send','pageview');
            console.log('Loading Widget = '+widget);

            require([i18n,'SIMRacingApps','widgets/'+widget+'/'+widgetname],
            function(i18n, SIMRacingApps, WidgetApp) {
                app.defaultWidth    = argsWidth  || WidgetApp.defaultWidth    || defaultWidth    || 800;
                app.defaultHeight   = argsHeight || WidgetApp.defaultHeight   || defaultHeight   || 480;
                app.defaultFontSize = (argsFontSize || WidgetApp.defaultFontSize || defaultFontSize || 16) * (fontpercent / 100.0);

                if (app.zoom) {
                    rootElement.css({
                        width:    (app.defaultWidth    * app.zoom)+'px',
                        height:   (app.defaultHeight   * app.zoom)+'px',
                        fontSize: (app.defaultFontSize * app.zoom)+'px'
                    });
                }
//                    SIMRacingApps.Dispatcher.setZoom(zoom);

                angular.bootstrap(rootElement,['SIMRacingApps']);

                if (interval)
                    WidgetApp.defaultInterval = interval;

                //if an interval was not passed in, set the dispatcher to run at the same speed as the widget
                if (!interval && WidgetApp.defaultInterval > 0) {
                    fpsElement.attr("data-sra-interval", WidgetApp.defaultInterval);
                    SIMRacingApps.Dispatcher.setInterval(WidgetApp.defaultInterval);
                }

                if (interfaceType)
                    SIMRacingApps.Dispatcher.setInterfaceType(interfaceType);
                
                if (referenceCar) {
                    SIMRacingApps.Dispatcher.sendCommand("Session/setReferenceCar/"+referenceCar);
                }
            }, function(err) {
                console.log(err.toString());
                angular.element(document.body).prepend( "<div class='SIMRacingAppsError'>"+err.toString()+"</div>" );
            });
        }
        else {
            ga('send','pageview');
            
            require([i18n,'SIMRacingApps'],
            function(i18n,   SIMRacingApps) {
                app.defaultWidth    = defaultWidth    || rootElement.css('width')    || 800;
                app.defaultHeight   = defaultHeight   || rootElement.css('height')   || 480;
                app.defaultFontSize = defaultFontSize || rootElement.css('fontSize') || 16;

                if (app.zoom) {
                    rootElement.css({
                        width:    (app.defaultWidth    * app.zoom)+'px',
                        height:   (app.defaultHeight   * app.zoom)+'px',
                        fontSize: (app.defaultFontSize * app.zoom)+'px'
                    });
                }

                angular.bootstrap(rootElement,['SIMRacingApps']);

                //if an interval was passed in, set the dispatcher to run at that spped
                if (app.interval) {
                    fpsElement.attr("data-sra-interval", app.interval);
                    SIMRacingApps.Dispatcher.setInterval(app.interval);
                }

                if (interfaceType)
                    SIMRacingApps.Dispatcher.setInterfaceType(interfaceType);
                
                if (referenceCar) {
                    SIMRacingApps.Dispatcher.sendCommand("Session/setReferenceCar/"+referenceCar);
                }

            }, function(err) {
                console.log(err.toString());
                angular.element(document.body).prepend( "<div class='SIMRacingAppsError'>"+err.toString()+"</div>" );
            });
        }
    };

    return app;
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-72478308-1', 'auto');
