(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name mdtTable
     * @restrict E
     *
     * @description
     * The base HTML tag for the component.
     *
     * @param {object=} tableCard when set table will be embedded within a card, with data manipulation tools available
     *      at the top and bottom.
     *
     *      Properties:
     *
     *      - `{boolean=}` `visible` - enable/disable table card explicitly
     *      - `{string}` `title` - the title of the card
     *      - `{array=}` `actionIcons` - (not implemented yet)
     *
     * @param {boolean=} selectableRows when set each row will have a checkbox
     * @param {String=} alternateHeaders some table cards may require headers with actions instead of titles.
     *      Two possible approaches to this are to display persistent actions, or a contextual header that activates
     *      when items are selected
     *
     *      Assignable values are:
     *
     *      - 'contextual' - when set table will have kind of dynamic header. E.g.: When selecting rows, the header will
     *        change and it'll show the number of selected rows and a delete icon on the right.
     *      - 'persistentActions' - (not implemented yet)
     *
     * @param {boolean=} sortableColumns sort data and display a sorted state in the header. Clicking on a column which
     *      is already sorted will reverse the sort order and rotate the sort icon.
     *      (not implemented yet: Use `sortable-rows-default` attribute directive on a column which intended to be the
     *      default sortable column)
     *
     * @param {function(rows)=} deleteRowCallback callback function when deleting rows.
     *      At default an array of the deleted row's data will be passed as the argument.
     *      When `table-row-id` set for the deleted row then that value will be passed.
     *
     * @param {boolean=} animateSortIcon sort icon will be animated on change
     * @param {boolean=} rippleEffect ripple effect will be applied on the columns when clicked (not implemented yet)
     * @param {boolean=} paginatedRows if set then basic pagination will applied to the bottom of the table.
     *
     *      Properties:
     *
     *      - `{boolean=}` `isEnabled` - enables pagination
     *      - `{array}` `rowsPerPageValues` - set page sizes. Example: [5,10,20]
     *
     * @param {object=} mdtRow passing rows data through this attribute will initialize the table with data. Additional
     *      benefit instead of using `mdt-row` element directive is that it makes possible to listen on data changes.
     *
     *      Properties:
     *
     *      - `{array}` `data` - the input data for rows
     *      - `{integer|string=}` `table-row-id-key` - the uniq identifier for a row
     *      - `{array}` `column-keys` - specifying property names for the passed data array. Makes it possible to
     *        configure which property assigned to which column in the table. The list should provided at the same order
     *        as it was specified inside `mdt-header-row` element directive.
     *
     * @param {function(page, pageSize)=} mdtRowPaginator providing the data for the table by a function. Should set a
     *      function which returns a promise when it's called. When the function is called, these parameters will be
     *      passed: `page` and `pageSize` which can help implementing an ajax-based paging.
     *
     * @param {string=} mdtRowPaginatorErrorMessage overrides default error message when promise gets rejected by the
     *      paginator function.
     *
     *
     * @example
     * <h2>`mdt-row` attribute:</h2>
     *
     * When column names are: `Product name`, `Creator`, `Last Update`
     * The passed data row's structure: `id`, `item_name`, `update_date`, `created_by`
     *
     * Then the following setup will parese the data to the right columns:
     * <pre>
     *     <mdt-table
     *         mdt-row="{
     *             'data': controller.data,
     *             'table-row-id-key': 'id',
     *             'column-keys': ['item_name', 'update_date', 'created_by']
     *         }">
     *
     *         <mdt-header-row>
     *             <mdt-column>Product name</mdt-column>
     *             <mdt-column>Creator</mdt-column>
     *             <mdt-column>Last Update</mdt-column>
     *         </mdt-header-row>
     *     </mdt-table>
     * </pre>
     */
    function mdtTableDirective(TableDataStorageFactory, mdtPaginationHelperFactory, mdtAjaxPaginationHelperFactory, $timeout) {
        return {
            restrict: 'E',
            templateUrl: '/main/templates/mdtTable.html',
            transclude: true,
            replace: true,
            scope: {
                tableCard: '=',
                selectableRows: '=',
                alternateHeaders: '=',
                sortableColumns: '=',
                deleteRowCallback: '&',
                animateSortIcon: '=',
                rippleEffect: '=',
                paginatedRows: '=',
                mdtModel: '=',
                mdtSelectFn: '&',
                mdtDblclickFn: '&',
                mdtContextMenuFn: '&',
                mdtRow: '=',
                mdtRowPaginator: '&?',
                mdtRowPaginatorErrorMessage: "@",
                mdtEmptyTitle: "=",

                menuList: "=",
                mdtMenuSelected: "&onMenuSelected",
                onPopup: "&"
            },
            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.addHeaderCell = addHeaderCell;

                initTableStorageServiceAndBindMethods();

                /****************************************/
                var DynamicItems = function () {
                    /**
                     * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
                     */
                    this.loadedPages = {};

                    /** @type {number} Total number of items. */
                    this.numItems = 0;

                    /** @const {number} Number of items to fetch per request. */
                    this.PAGE_SIZE = 18;

                    this.fetchNumItems_();
                };

                // Required.
                DynamicItems.prototype.getItemAtIndex = function (index) {
                    var pageNumber = Math.floor(index / this.PAGE_SIZE);
                    var page = this.loadedPages[pageNumber];

                    if (page) {
                        return page[index % this.PAGE_SIZE];
                    } else if (page !== null) {
                        var sTime = Date.now();

                        this.fetchPage_(pageNumber);

                        var eTime = Date.now();
                        console.log('etime: ' + (eTime - sTime));
                    }
                };

                // Required.
                DynamicItems.prototype.getLength = function () {
                    return this.numItems;
                };

                DynamicItems.prototype.fetchPage_ = function (pageNumber) {
                    // Set the page to null so we know it is already being fetched.
                    this.loadedPages[pageNumber] = null;

                    // For demo purposes, we simulate loading more items with a timed
                    // promise. In real code, this function would likely contain an
                    // $http request.
                    // $timeout(angular.noop, 300).then(angular.bind(this, function () {
                    this.loadedPages[pageNumber] = [];
                    var allRows = $scope.mdtPaginationHelper.getRows();
                    var pageOffset = pageNumber * this.PAGE_SIZE;
                    for (var i = pageOffset; i < pageOffset + this.PAGE_SIZE; i++) {
                        this.loadedPages[pageNumber].push(allRows[i]);
                    }
                    // }));
                };
                DynamicItems.prototype.fetchNumItems_ = function () {
                    // $timeout(angular.noop, 300).then(angular.bind(this, function() {
                    this.numItems = $scope.mdtPaginationHelper.getRows().length;
                    // }));
                };
                /****************************************/


                function initTableStorageServiceAndBindMethods() {
                    $scope.tableDataStorageService = TableDataStorageFactory.getInstance();

                    if (!$scope.mdtRowPaginator) {
                        $scope.mdtPaginationHelper = mdtPaginationHelperFactory
                            .getInstance($scope.tableDataStorageService, $scope.paginatedRows, $scope.mdtRow);
                    } else {
                        $scope.mdtPaginationHelper = mdtAjaxPaginationHelperFactory.getInstance({
                            tableDataStorageService: $scope.tableDataStorageService,
                            paginationSetting: $scope.paginatedRows,
                            mdtRowOptions: $scope.mdtRow,
                            mdtRowPaginatorFunction: $scope.mdtRowPaginator,
                            mdtRowPaginatorErrorMessage: $scope.mdtRowPaginatorErrorMessage
                        });
                    }

                    vm.addRowData = _.bind($scope.tableDataStorageService.addRowData, $scope.tableDataStorageService);

                    $scope.tableDataCnt = 0;
                    var unbindWatchMdtModel = $scope.$watch('mdtModel', function (data) {
                        $scope.$watchCollection('mdtModel.data', function (data) {
                            if (data) {
                                $timeout(function () {
                                    $scope.tableIsReady = true;
                                }, 500);
                            }
                            if (data && data.length) {
                                $scope.tableDataStorageService.initModel($scope.mdtModel, $scope.mdtSelectFn, $scope.mdtDblclickFn, $scope.mdtContextMenuFn, $scope.onPopup);
                                $scope.dynamicItems = new DynamicItems();
                                var rowsLength = $scope.mdtPaginationHelper.getRows().length;
                                if (rowsLength) {

                                    // $scope.tableIsReady = false;
                                    // $scope.tableDataIsReady = false;
                                    $scope.watiForHeight(rowsLength);
                                }
                            }
                        });

                        unbindWatchMdtModel();
                    });
                }


                function addHeaderCell(ops) {
                    $scope.tableDataStorageService.addHeaderCellData(ops);
                }


            }],
            link: function ($scope, element, attrs, ctrl, transclude) {
                injectContentIntoTemplate();

                $scope.isAnyRowSelected = _.bind($scope.tableDataStorageService.isAnyRowSelected, $scope.tableDataStorageService);
                $scope.isPaginationEnabled = isPaginationEnabled;


                $scope.onMenuSelected = function (menuItem) {
                    $scope.mdtMenuSelected({menuItem: menuItem});
                };

                function getScrollbarWidth() {
                    var outer = document.createElement("div");
                    outer.style.visibility = "hidden";
                    outer.style.width = "100px";
                    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

                    document.body.appendChild(outer);

                    var widthNoScroll = outer.offsetWidth;
                    // force scrollbars
                    outer.style.overflow = "scroll";

                    // add innerdiv
                    var inner = document.createElement("div");
                    inner.style.width = "100%";
                    outer.appendChild(inner);

                    var widthWithScroll = inner.offsetWidth;

                    // remove divs
                    outer.parentNode.removeChild(outer);

                    return widthNoScroll - widthWithScroll;
                }


                /*
                 function watchAnalytics() {
                 $timeout(function() {
                 var watchers = ($scope.$$watchers) ? $scope.$$watchers.length : 0;
                 var child = $scope.$$childHead;
                 while (child) {
                 watchers += (child.$$watchers) ? child.$$watchers.length : 0;
                 child = child.$$nextSibling;
                 }
                 console.log('watchers: '+ watchers);
                 watchAnalytics();
                 },1000);

                 }
                 watchAnalytics();
                 */
                $scope.hiddenHeadHeight = function () {
                    return -$('#hiddenHead', element).height() || 0;
                };


                $scope.hiddenBodyHeight = function () {
                    return -$('#hiddenBody', element).height();
                };

                $scope.watiForHeight = function (rowsLength) {
                    $timeout(function () {
                        $scope.scrollWidth = getScrollbarWidth() || 1;
                        var $dc = $('.data-container', element);

                        $scope.isScrollVisible = rowsLength * 48 > $dc.height();
                    });

                    /*
                                        var height = $scope.hiddenHeadHeight();
                                        if (!height && !$scope.tableDataIsReady) {
                                            $timeout(function () {
                                                $scope.watiForHeight();
                                            });
                                        } else {
                                            $('#data-table', element).css('margin-top', height);
                                            $timeout(function () {
                                                var $dc = $('.data-container', element);
                                                $scope.isScrollVisible = $dc.get(0).scrollHeight > $dc.height();
                                            });
                                            $scope.tableIsReady = true;
                                        }
                    */
                };

                // $scope.watiForHeight();

                if (!_.isEmpty($scope.mdtRow)) {
                    //local search/filter
                    if (angular.isUndefined(attrs.mdtRowPaginator)) {
                        $scope.$watch('mdtRow', function (mdtRow) {
                            $scope.tableDataStorageService.storage = [];

                            addRawDataToStorage(mdtRow['data']);
                        }, true);


                    } else {
                        //if it's used for 'Ajax pagination'
                    }
                }

                function addRawDataToStorage(data) {
                    var rowId;
                    var columnValues = [];
                    _.each(data, function (row) {
                        rowId = _.get(row, $scope.mdtRow['table-row-id-key']);
                        columnValues = [];

                        _.each($scope.mdtRow['column-keys'], function (columnKey) {
                            columnValues.push(_.get(row, columnKey));
                        });

                        $scope.tableDataStorageService.addRowData(rowId, columnValues);
                    });
                }

                function isPaginationEnabled() {
                    if ($scope.paginatedRows === true || ($scope.paginatedRows && $scope.paginatedRows.hasOwnProperty('isEnabled') && $scope.paginatedRows.isEnabled === true)) {
                        return true;
                    }

                    return false;
                }

                function injectContentIntoTemplate() {
                    transclude(function (clone) {
                        var headings = [];
                        var body = [];

                        _.each(clone, function (child) {
                            var $child = angular.element(child);

                            if ($child.hasClass('theadTrRow')) {
                                headings.push($child);
                            } else {
                                body.push($child);
                            }
                        });

                        element.find('#reader').append(headings).append(body);
                    });
                }

            }
        };
    }

    function mtdDropdown() {
        return {
            restrict: 'EA',
            scope: {
                menuList: '=',
                callback: '&onMenuSelected'
            },
            templateUrl: '/main/templates/mdtDropdown.html',
            link: function (scope, elem, attrs, ctrl) {
                scope.onMenuSelected = function (menuItem) {
                    scope.callback({menuItem: menuItem});
                };
            }
        };
    }


    // function mdtContextMenu($parse) {
    //     return {
    //         restrict: 'A',
    //         scope: true,
    //         link: function (scope, element, attrs) {
    //             var menuHandler = $parse(attrs.mdtContextMenu);
    //             element.on('contextmenu', function (event) {
    //                 scope.$apply(function() {
    //                     menuHandler(scope, {$event: (event)});
    //                 });
    //                 return false;
    //
    //
    //             });
    //         }
    //     };
    // }
    function MtdRightClick($parse, $rootScope) {
        return {
            compile: function ($element, attr) {
                var fn = $parse(attr.mtdRightClick, /* interceptorFn */ null, /* expensiveChecks */ true);
                return function EventHandler(scope, element) {
                    element.on('contextmenu', function (event) {
                        var callback = function () {
                            fn(scope, {$event: event});
                        };
                        if ($rootScope.$$phase) {
                            scope.$evalAsync(callback);
                        } else {
                            scope.$apply(callback);
                        }
                    });
                };
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtTable', ['TableDataStorageFactory', 'mdtPaginationHelperFactory', 'mdtAjaxPaginationHelperFactory', '$timeout', mdtTableDirective])
        .directive('mtdRightClick', ['$parse', '$rootScope', MtdRightClick])
        .directive('mtdDropdown', mtdDropdown)
        .filter('ifEmpty', function () {
            return function (input, defaultValue) {
                if (angular.isUndefined(input) || input === null || input === '') {
                    return defaultValue;
                }

                return input;
            }
        });
}());