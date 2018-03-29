'use strict';
/**
 * This widget extends the sra-data directive by placing the data in a HTML Table.
 * You have full control on what goes in the header, body, and footer.
 * The body can also have a label to go with the data.
 * <p>
 * The data-sra-args-data parameter should list all the paths to the SIM data you will be using for the entire table as follows:
 * <pre>
 *      data-sra-args-data = "/Car/REFERENCE/DriverName;/Car/REFERENCE/Number"
 * </pre>
 * <p>
 * Each table element where data is inserted can take a class and HTML, but they have to be written in JavaScript.
 * The JavaScript should reference the "data" object to display SIM data or a constant can be used
 * For example, if you want to have a constant for the header, it would be written as follows:
 * <pre>
 *      data-sra-args-header       = "'Some Constant'"
 *      data-sra-args-header-class = "'myHeaderClass'"
 *      &lt;!-- or if using the data object --&gt;
 *      data-sra-args-header       = "'Driver = ' + (data.Car.REFERENCE.DriverName.ValueFormatted|sraEncodeEntities)"
 * </pre>
 * NOTE: All data should be cleansed with a call to the sraEncodeEntities filter.
 * For the rows, each row must be given a name and listed in the order to display them. 
 * They are assigned to the row-names parameter separated with semicolons, commas or spaces as follows:
 * <pre>
 *      data-sra-args-row-names = "carnum;name"
 * </pre>
 * Once each row has a name, then a Class, HTML, or Label can be assigned to those rows by using their name in the argument variable name as follows:
 * <pre>
 *      data-sra-args-row-name-label       = "(translations.NAME|sraEncodeEntities) + ':'"
 *      data-sra-args-row-name             = "(data.Car.REFERENCE.DriverName.ValueFormatted|sraEncodeEntities)"
 *      data-sra-args-row-name-class       = "'myNameClass'"
 *      data-sra-args-row-name-label-class = "'myNameLabelClass'"
 *      data-sra-args-row-name-value-class = "'myNameValueClass'"
 *      data-sra-args-row-carnum-label     = "(translations.CARNUMBER|sraEncodeEntities) + ':'"
 *      data-sra-args-row-carnum           = "(data.Car.REFERENCE.CarNumber.ValueFormatted|sraEncodeEntities)"      
 * </pre>
 * <p>
 * Example from the CrewChief App:
 * <pre><b>
 * &lt;sra-data-table
 *      id                                  = "SIMRacingApps-App-CrewChief-CarTrack"
 *      data-sra-args-data                  = "Car/REFERENCE/DriverName;Car/REFERENCE/Number;Car/REFERENCE/DriverRating;Session/Type;Car/REFERENCE/Status;Car/REFERENCE/Description;Track/Description;Track/Length;Track/Category;Track/PitSpeedLimit"
 *      data-sra-args-row-names             = "drivername;rating;session;cardesc;trackdesc;trackinfo;pitinfo"
 *      data-sra-args-row-drivername        = "(data.Car.REFERENCE.DriverName.ValueFormatted|sraEncodeEntities)"
 *      data-sra-args-row-rating            = "(data.Car.REFERENCE.DriverRating.ValueFormatted+' #'+data.Car.REFERENCE.Number.ValueFormatted)|sraEncodeEntities"
 *      data-sra-args-row-session           = "(data.Session.Type.ValueFormatted+' - '+data.Car.REFERENCE.Status.ValueFormatted)|sraEncodeEntities"
 *      data-sra-args-row-cardesc           = "data.Car.REFERENCE.Description.ValueFormatted|sraEncodeEntities"
 *      data-sra-args-row-trackdesc         = "data.Track.Description.ValueFormatted|sraEncodeEntities"
 *      data-sra-args-row-trackinfo         = "((data.Track.Length.Value|sraNumber:1)+' '+data.Track.Length.UOMDesc+' '+data.Track.Category.ValueFormatted)|sraEncodeEntities"
 *      data-sra-args-row-pitinfo           = "(translations.PITROADSPEEDLIMIT+': '+(data.Track.PitSpeedLimit|sraNumber:0))|sraEncodeEntities"
 * &gt;&lt;/sra-data-table&gt;
 * </b></pre>
 * @ngdoc directive
 * @name sra-data-table
 * @param data-sra-args-data The list of semicolon separated paths to the SIM data.
 * @param data-sra-args-table-class The class to be assigned to the &lt;table&gt; element
 * @param data-sra-args-header The HTML to be assigned to the &lt;thead.tr.td&gt; element
 * @param data-sra-args-header-class The Class to be assigned to the &lt;thead.tr.td&gt; element
 * @param data-sra-args-footer The HTML to be assigned to the &lt;tfoot.tr.td&gt; element
 * @param data-sra-args-footer-class The Class to be assigned to the &lt;tfoot.tr.td&gt; element
 * @param data-sra-args-row-names A space separated list of row names
 * @param data-sra-args-row-(name) The HTML to assign to the &lt;tbody.tr.td&gt; row for this name.
 * @param data-sra-args-row-(name)-class The Class to assign to the &lt;tbody.tr&gt; row for this name.
 * @param data-sra-args-row-(name)-label-class The Class to assign to the &lt;tbody.tr.td&gt; row for this name's label.
 * @param data-sra-args-row-(name)-value-class The Class to assign to the &lt;tbody.tr.td&gt; row for this name's value.
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 500.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2017 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps','css!widgets/DataTable/DataTable'],
function(SIMRacingApps) {

    var self = {
        name:            "sraDataTable",
        url:             'DataTable',
        template:        'DataTable.html',
        defaultWidth:    800,
        defaultHeight:   130,
        defaultInterval: 200   //initialize with the default interval
    };

    self.module = angular.module('SIMRacingApps'); //get the main module

    self.module.directive(self.name,
           ['sraDispatcher', '$filter', '$rootScope', '$sanitize', '$sce',
    function(sraDispatcher,   $filter,   $rootScope,   $sanitize,   $sce) {
        return {
            restrict:    'EA',
            scope:       true,
            templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
            controller: [ '$scope', function($scope) {
                $scope.directiveName   = self.name;
                $scope.defaultWidth    = self.defaultWidth;
                $scope.defaultHeight   = self.defaultHeight;
                $scope.defaultInterval = self.defaultInterval;

                /** your code goes here **/
                $scope.rows        = [];
                $scope.rowNames    = [];
                $scope.rowsClass   = {};
                $scope.classes     = {};
                $scope.labels      = {};
                $scope.labelsClass = {};
                $scope.values      = {};
                $scope.valuesClass = {};
                $scope.tableClass  = "";
                $scope.header      = "";
                $scope.headerClass = "";
                $scope.bodyClass   = "";
                $scope.footer      = "";
                $scope.footerClass = "";

                $scope.updateClass = function(rowname,newValue,scope) {
                    scope.classes[rowname] = newValue;
                };
                $scope.updateRowClass = function(rowname,newValue,scope) {
                    scope.rowsClass[rowname] = newValue;
                };
                $scope.updateLabel = function(rowname,newValue,scope) {
                    scope.labels[rowname] = $sce.trustAsHtml(newValue+"");  //since this is an internal server, I trust it
                };
                $scope.updateLabelClass = function(rowname,newValue,scope) {
                    scope.labelsClass[rowname] = newValue;
                };
                $scope.updateValue = function(rowname,newValue,scope) {
                    scope.values[rowname] = $sce.trustAsHtml(newValue+"");  //since this is an internal server, I trust it
                };
                $scope.updateValueClass = function(rowname,newValue,scope) {
                    scope.valuesClass[rowname] = newValue;
                };
            }]
            , link: function($scope,$element,$attrs) {
                //Since this is a helper widget, don't load the value or it will override the parent's value
                //$scope.value = $scope[self.name] = $attrs[self.name] || $attrs.sraArgsValue || "DefaultValue";

                /** your code goes here **/

                $scope.rowNames = ($scope.sraArgsROWNAMES || $attrs.sraArgsRowNames || "").split(/[;, ]/);

                for (var row=0; row < $scope.rowNames.length; row++) {
                    var rowname = $scope.rowNames[row];
                    var rowName = $scope.rowNames[row].substr(0,1).toUpperCase() + $scope.rowNames[row].substr(1).toLowerCase();

                    var watchexp = $scope['sraArgsROW'+rowName.toUpperCase()+'CLASS'];
                    if (watchexp)
                        watchexp = "'" + watchexp + "'";
                    else
                        watchexp = $attrs['sraArgsRow'+rowName+'Class'];
                    if (watchexp) {
                        $scope.rowsClass[rowname] = "";
                        $scope.$watch(watchexp, new Function('newValue','oldValue','$scope','$scope.updateRowClass("'+rowname+'",newValue,$scope);'));
                    }
                    
                    watchexp = $scope['sraArgsROW'+rowName.toUpperCase()+'LABEL'];
                    if (watchexp) {
                        watchexp = "'" + watchexp + "'";
                    }
                    else
                        watchexp = $attrs['sraArgsRow'+rowName+'Label'];
                    if (watchexp) {
                        $scope.labels[rowname] = "&nbsp;";
                        $scope.$watch(watchexp, new Function('newValue','oldValue','$scope','$scope.updateLabel("'+rowname+'",newValue,$scope);'));
                    }
                    
                    watchexp = $scope['sraArgsROW'+rowName.toUpperCase()+'LABELCLASS'];
                    if (watchexp)
                        watchexp = "'" + watchexp + "'";
                    else
                        watchexp = $attrs['sraArgsRow'+rowName+'LabelClass'];
                    if (watchexp) {
                        $scope.labelsClass[rowname] = "";
                        $scope.$watch(watchexp, new Function('newValue','oldValue','$scope','$scope.updateLabelClass("'+rowname+'",newValue,$scope);'));
                    }

                    watchexp = $scope['sraArgsROWCLASS'];
                    if (watchexp)
                        watchexp = "'" + watchexp + "'";
                    else
                        watchexp = $attrs['sraArgsRowClass'];
                    if (watchexp) {
                        $scope.classes[rowname] = "";
                        $scope.$watch(watchexp, new Function('newValue','oldValue','$scope','$scope.updateClass("'+rowname+'",newValue,$scope);'));
                    }
                    
                    watchexp = $scope['sraArgsROW'+rowName.toUpperCase()];
                    if (watchexp) {
                    }
                    else
                        watchexp = $attrs['sraArgsRow'+rowName];
                    if (watchexp) {
                        $scope.values[rowname] = "&nbsp;";
                        $scope.$watch(watchexp, new Function('newValue','oldValue','$scope','$scope.updateValue("'+rowname+'",newValue,$scope);'));
                    }
                    
                    watchexp = $scope['sraArgsROW'+rowName.toUpperCase()+'VALUE'];
                    if (watchexp) {
                    }
                    else
                        watchexp = $attrs['sraArgsRow'+rowName+'Value'];
                    if (watchexp) {
                        $scope.values[rowname] = "&nbsp;";
                        $scope.$watch(watchexp, new Function('newValue','oldValue','$scope','$scope.updateValue("'+rowname+'",newValue,$scope);'));
                    }
                    
                    watchexp = $scope['sraArgsROW'+rowName.toUpperCase()+'VALUECLASS'];
                    if (watchexp)
                        watchexp = "'" + watchexp + "'";
                    else
                        watchexp = $attrs['sraArgsRow'+rowName+'ValueClass'];
                    if (watchexp) {
                        $scope.valuesClass[rowname] = "";
                        $scope.$watch(watchexp, new Function('newValue','oldValue','$scope','$scope.updateValueClass("'+rowname+'",newValue,$scope);'));
                    }
                }

                watchexp = $scope['sraArgsCLASS'];
                if (watchexp)
                    watchexp = "'" + watchexp + "'";
                else
                    watchexp = $attrs.sraArgsClass;
                if (watchexp) {
                    $scope.tableClass = "";
                    $scope.$watch(watchexp, function(newValue) {
                        $scope.tableClass = newValue;
                    });
                }

                watchexp = $scope['sraArgsHEADER'];
                if (watchexp)
                    watchexp = "'" + watchexp + "'";
                else
                    watchexp = $attrs.sraArgsHeader;
                if (watchexp) {
                    $scope.header = "&nbsp;";
                    $scope.$watch(watchexp, function(newValue) {
                        $scope.header = newValue;
                    });
                }

                watchexp = $scope['sraArgsHEADERCLASS'];
                if (watchexp)
                    watchexp = "'" + watchexp + "'";
                else
                    watchexp = $attrs.sraArgsHeaderClass;
                if (watchexp) {
                    $scope.headerClass = "";
                    $scope.$watch(watchexp, function(newValue) {
                        $scope.headerClass = newValue;
                    });
                }

                watchexp = $scope['sraArgsBODYCLASS'];
                if (watchexp)
                    watchexp = "'" + watchexp + "'";
                else
                    watchexp = $attrs.sraArgsBodyClass;
                if (watchexp) {
                    $scope.bodyClass = "";
                    $scope.$watch(watchexp, function(newValue) {
                        $scope.bodyClass = newValue;
                    });
                }

                watchexp = $scope['sraArgsFOOTER'];
                if (watchexp)
                    watchexp = "'" + watchexp + "'";
                else
                    watchexp = $attrs.sraArgsFooter;
                if (watchexp) {
                    $scope.footer = "&nbsp;";
                    $scope.$watch(watchexp, function(newValue) {
                        $scope.footer = newValue;
                    });
                }
                
                watchexp = $scope['sraArgsFOOTERCLASS'];
                if (watchexp)
                    watchexp = "'" + watchexp + "'";
                else
                    watchexp = $attrs.sraArgsFooterClass;
                if (watchexp) {
                    $scope.footerClass = "";
                    $scope.$watch(watchexp, function(newValue) {
                        $scope.footerClass = newValue;
                    });
                }

                /**standard code that should be in every directive **/
                $rootScope.$on('sraResize', sraDispatcher.resize($scope,$element,self.defaultWidth,self.defaultHeight));
                //register with the dispatcher
                $scope.names = sraDispatcher.subscribe($scope,$attrs,self.defaultInterval); //register subscriptions and options to the dispatcher
            }
        };
    }]);

    return self;
});
