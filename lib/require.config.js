/**
 *This config tells "requireJS" where to find all of the external libraries.
 *It should be loaded just before require.js is loaded
 *<p>
 *The base URL should always point to the folder where the angular widgets are.
 *This doesn't mean it will actually load all these scripts, it only tells it where to find them if needed.
 *<pre>
 *   /SIMRacingApps
 *       /apps
 *           /SomeApp1
 *               /default.js
 *           /SomeApp2
 *               /default.js
 *       /external
 *       /lib
 *       /widgets
 *           /widget1
 *              /widget1.js
 *           /widtet2
 *              /widget2.js
 *</pre>
 *The baseUrl is left out on purpose. Each app will define that path in the default.js file, then call require.
 *<pre>
 *    baseUrl:                 '/SIMRacingApps/apps/WidgetLoader',
 *</pre>
 * @author Jeffrey Gilliam
 */

var SIMRacingAppsCache = (new Date()).getTime();

var SIMRacingAppsRequireConfig = {
    urlArgs: "cache="+SIMRacingAppsCache,
    paths: {
        'angular':          '/SIMRacingApps/external/angular.1.5.0/angular.min',
        'angular-animate':  '/SIMRacingApps/external/angular.1.5.0/angular-animate.min',
        'angular-sanitize': '/SIMRacingApps/external/angular.1.5.0/angular-sanitize.min',
        'i18n':             '/SIMRacingApps/external/angular.1.5.0/i18n',
        'require-css':      '/SIMRacingApps/external/require-css.0.1.6',
        'openlayers':       '/SIMRacingApps/external/openlayers.3.7.0',
        'SIMRacingApps':    '/SIMRacingApps/lib/SIMRacingApps',
        'widgets':          '/SIMRacingApps/widgets'
    },
    shim: {
        'angular':          {'exports': 'angular'},
        'angular-animate':  {'deps': ['angular'] },
        'angular-sanitize': {'deps': ['angular'] },
        'openlayers/ol':    {'deps': ['css!openlayers/ol'], 'exports': 'ol'},
        'SIMRacingApps':    {'deps': ['angular','angular-animate','angular-sanitize'] },
        'widgets':          {'deps': ['SIMRacingApps'] }
    },
    map: {
        '*': {
            'css': 'require-css'
        }
    }
};
