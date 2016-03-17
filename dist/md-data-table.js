(function () {
    'use strict';

    angular.module('material.components.table', ['mdtTemplates', 'ngMaterial', 'ngMdIcons']);
}());
(function(){
    'use strict';

    function mdtAlternateHeadersDirective(){
        return {
            restrict: 'E',
            templateUrl: '/main/templates/mdtAlternateHeaders.html',
            transclude: true,
            replace: true,
            scope: true,
            require: ['^mdtTable'],
            link: function($scope){
                $scope.deleteSelectedRows = deleteSelectedRows;

                function deleteSelectedRows(){
                    var deletedRows = $scope.tableDataStorageService.deleteSelectedRows();

                    $scope.deleteRowCallback({rows: deletedRows});
                }
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtAlternateHeaders', mdtAlternateHeadersDirective);
}());
(function () {
    'use strict';

    angular
        .module('material.components.table')
        .directive('mtdContextMenu', function ($compile, $parse, $timeout, Util) {
            return {
                restrict: 'A',
                scope: {
                    menuList: '=',
                    onPopup: '&',
                    onMenuSelected: '&'
                },
                link: function (scope, elem, attrs) {
                    var self = scope;

                    scope.onDropdownMenuSelected = function (menuItem, menu) {
                        scope.onMenuSelected({menuItem: menuItem});
                    };

                    scope.$on('$destroy', function () {
                        self._menuListElem.remove();
                    });

                    scope.contextMenuState = {
                        left: 0,
                        top: 0,
                        visibility: 'hidden'
                    };

                    var init = function (elem) {
                        var menuListElem = angular.element('<mtd-dropdown></mtd-dropdown>'),
                            bodyElem = angular.element(document.body);

                        menuListElem.attr({
                            'class': 'context-menu',
                            'menu-list': 'menuList',
                            'on-menu-selected': 'onDropdownMenuSelected(menuItem)',
                            'ng-style': 'contextMenuState'
                        });
                        $compile(menuListElem)(scope);
                        bodyElem.append(menuListElem);


                        bodyElem.on('click', function (event) {
                            scope.contextMenuState.display = 'none';
                            scope.contextMenuState.isVisible = false;

                            scope.$digest();
                        });

                        var isIOs = /iPhone|iPod|iPad/i.test(navigator.userAgent);

                        if (isIOs) {
                            elem.bind('touchstart', function (evt) {
                                scope.touchend = false;
                                scope.longPress = false;
                                var self = this;
                                var event = evt;
                                console.log('touchstart');
                                $timeout(function () {
                                    console.log('touchstart[end:' + scope.touchend + "]");
                                    if (!scope.touchend) {
                                        scope.longPress = true;
                                    }

                                    // if (scope.longPress) {
                                    //     // If the touchend event hasn't fired,
                                    //     // apply the function given in on the element's on-long-press attribute
                                    //     // $scope.$apply(function() {
                                    //     //     $scope.$eval($attrs.onLongPress)
                                    //     // });
                                    //
                                    //     var left, top, offset;
                                    //
                                    //     if (scope.onPopup()) {
                                    //         left = event.originalEvent.pageX;
                                    //         top = event.originalEvent.pageY;
                                    //         offset = Util.offset(self);
                                    //
                                    //         if (left + menuListElem[0].clientWidth > offset.left + self.clientWidth) {
                                    //             left -= (left + menuListElem[0].clientWidth) - (offset.left + self.clientWidth);
                                    //         }
                                    //         if (top + menuListElem[0].clientHeight > offset.top + self.clientHeight) {
                                    //             top -= (top + menuListElem[0].clientHeight) - (offset.top + self.clientHeight);
                                    //         }
                                    //
                                    //         scope.contextMenuState.left = (left) + 'px';
                                    //         scope.contextMenuState.top = top + 'px';
                                    //         scope.contextMenuState.visibility = 'visible';
                                    //         scope.contextMenuState.display = 'block';
                                    //         scope.contextMenuState.isVisible = true;
                                    //     }
                                    //
                                    //     scope.$digest();
                                    //     event.stopPropagation();
                                    //
                                    // }
                                }, 600);
                            });
                            elem.bind('touchend', function (event) {
                                scope.touchend = true;
                                if (scope.longPress) {
                                    scope.menuVisible = true;
                                    var left, top, offset;
                                    if (scope.onPopup()) {
                                        left = event.originalEvent.pageX;
                                        top = event.originalEvent.pageY;
                                        offset = Util.offset(self);

                                        if (left + menuListElem[0].clientWidth > offset.left + self.clientWidth) {
                                            left -= (left + menuListElem[0].clientWidth) - (offset.left + self.clientWidth);
                                        }
                                        if (top + menuListElem[0].clientHeight > offset.top + self.clientHeight) {
                                            top -= (top + menuListElem[0].clientHeight) - (offset.top + self.clientHeight);
                                        }

                                        scope.contextMenuState.left = (left) + 'px';
                                        scope.contextMenuState.top = top + 'px';
                                        scope.contextMenuState.visibility = 'visible';
                                        scope.contextMenuState.display = 'block';
                                        scope.contextMenuState.isVisible = true;
                                    }
                                    scope.longPress = false;
                                    scope.$digest();
                                    event.preventDefault();

                                }
                            });
                        }

                        elem.on('contextmenu', function (event) {
                            var left, top, offset;

                            if (scope.onPopup()) {
                                left = event.clientX;
                                top = event.clientY;
                                offset = Util.offset(this);

                                if (left + menuListElem[0].clientWidth > offset.left + this.clientWidth) {
                                    left -= (left + menuListElem[0].clientWidth) - (offset.left + this.clientWidth);
                                }
                                if (top + menuListElem[0].clientHeight > offset.top + this.clientHeight) {
                                    top -= (top + menuListElem[0].clientHeight) - (offset.top + this.clientHeight);
                                }

                                scope.contextMenuState.left = left + 'px';
                                scope.contextMenuState.top = top + 'px';
                                scope.contextMenuState.visibility = 'visible';
                                scope.contextMenuState.display = 'block';
                                scope.contextMenuState.isVisible = true;
                            }

                            scope.$digest();
                            event.preventDefault();
                        });

                        self._elem = elem;
                        self._menuListElem = menuListElem;
                    };

                    init(elem);
                }

            };
        });

})();

(function () {
    'use strict';

    function onLongPress($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $elm, $attrs) {
                $elm.bind('touchstart', function (evt) {
                    // Locally scoped variable that will keep track of the long press
                    $scope.$apply(function () {
                        $scope.$eval($attrs.onLongPress)
                    });
                });

                // $elm.bind('touchend', function (evt) {
                //     // Prevent the onLongPress event from firing
                //     console.log('touchend');
                //     $scope.longPress = false;
                //     // If there is an on-touch-end function attached to this element, apply it
                //     if ($attrs.onTouchEnd) {
                //         $scope.$apply(function () {
                //             $scope.$eval($attrs.onTouchEnd)
                //         });
                //     }
                // });
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('onLongPress', onLongPress);
}());
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
            controller: function ($scope) {
                var vm = this;
                vm.addHeaderCell = addHeaderCell;

                initTableStorageServiceAndBindMethods();

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
                            if (data && data.length) {
                                $scope.tableDataStorageService.initModel($scope.mdtModel, $scope.mdtSelectFn, $scope.mdtDblclickFn, $scope.mdtContextMenuFn, $scope.onPopup);
                                $timeout(function () {
                                    $scope.tableIsReady = true;
                                }, 300);
                                if ($scope.mdtPaginationHelper.getRows().length) {
                                    // $scope.tableIsReady = false;
                                    // $scope.tableDataIsReady = false;
                                    // $scope.watiForHeight();
                                }
                            }
                        });

                        unbindWatchMdtModel();
                    });
                }


                function addHeaderCell(ops) {
                    $scope.tableDataStorageService.addHeaderCellData(ops);
                }



            },
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

                $scope.scrollWidth = getScrollbarWidth() || 1;
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

                $scope.watiForHeight = function () {
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
'use strict';

(function () {
    var module = angular.module('material.components.table');
    module.directive('mdtTableRow', function (superCache, TableDataStorageFactory, $filter, $compile, $timeout, $rootScope) {
        return {
            restrict: 'A',
            scope: {
                gridId: '=',
                props: '=',
                model: '=',
                minSize: '=',
                tester: '@'
                //editFn: '&',
            },
            replace: true,
            link: function (scope, element, attrs) {
                var code = {
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40,
                    enter: 13,
                    backspace: 8,
                    delete: 46,
                    esc: 27
                };

                scope.iSize = {};
                if (scope.tester) {
                    scope.$watch('model', function (newData) {
                        if (newData) {
                            initColumns();
                        }
                    });
                }
                scope.broadcast = function (key, val) {
                    $rootScope.$broadcast(key, val);
                };

                scope.parseDate = function (value) {
                    return !value || value == '0001-01-01T00:00:00' || value == '1900-01-01T00:00:00' ? 'N/A' :
                        (value.indexOf('T') != -1 ? value : new Date(parseInt(value.replace(/\/Date\((.*?)\)\//gi, "$1"))));
                };

                scope.parseDateTime = function (value) {
                    return !value || value.indexOf('T') != -1 ? value :
                        new Date(value);
                };

                scope.moment = moment;

                scope.editStart = function (propIndex) {

                    var _width = $('td.' + scope.props[propIndex].id + 'Class', element).width() -20;
                    $('#i' +scope.props[propIndex].id, element).css('width', _width);

                    var prop = scope.props[propIndex];
                    var propId = prop.id;
                    if (scope.model[propId + '_isEdit']) {
                        return;
                    }
                    scope['dirty' + propId] = scope.model[propId];
                    //                scope.editFn({ enabled: true, item: scope.model });
                    prop.editable(true, scope.model);
                    scope.model[propId + '_isEdit'] = true;
                    $timeout(function () {
                        element.find('#i' + prop.id).focus();
                    });
                }

                scope.editEnd = function ($e, propIndex) {
                    var prop = scope.props[propIndex];
                    var propId = prop.id;

                    if (scope.$$phase || !scope.model[propId + '_isEdit'] && ($e && $e.target.className.indexOf('grid-button') !== -1)) {
                        //                    $timeout(function () {
                        //                        element.find('input').focus();
                        //                    });
                        return;
                    }
                    scope.model[propId + '_isEdit'] = false;
                    if (angular.isDefined(propIndex)) {

                        if (scope['dirty' + propId] && scope['dirty' + propId].length != scope.model[propId]) {
                            $rootScope.$broadcast('gridview.resize.' + scope.gridId);
                        }
                        scope['dirty' + propId] = undefined;
                        //                    scope.editFn({ enabled: false });
                        prop.editable(false, scope.model);
                    }
                }

                scope.keyDown = function ($e, propIndex) {
                    var propId = scope.props[propIndex].id;

                    if ($e.which === code.enter || $e.which === code.up || $e.which === code.down) {
                        scope.model[propId + '_isEdit'] = false;
                        scope.editEnd($e, propIndex);
                    } else if ($e.which === code.esc) {
                        scope.model[propId] = scope['dirty' + propId];
                        scope.editEnd($e, propIndex);
                    }
                }
                scope.getStyle = function (prop) {
                    return prop.min_width ? 'style="min-width:' + prop.min_width + 'px;"' : "";
                };
                scope.getWidth = function (prop) {
                    return prop.min_width ? 'style="width:' + (prop.min_width - 5) + 'px;"' : "";
                };

                scope.$watch('minSize', function (size) {
                    if (size && Object.keys(size).length) {
                        scope.props.forEach(function (prop) {
                            scope[prop.id] = size[prop.id];
                            //                            scope[prop.id + 'Color'] = prop.color;
                        });
                    }
                });


                var initColumns = function () {
                    var templateCacheKey = 'row_template' + scope.gridId;
                    var htmlTemplate = superCache.get(templateCacheKey);
                    if (!htmlTemplate) {
                        var rowTemplate = [];
                        var sortedProps = $filter('orderBy')(scope.props, 'sequence') || [];
                        superCache.put('sortedProps', sortedProps);
                        sortedProps.forEach(function (prop, index) {
                            if (prop.enabled) {
                                //                                var width = scope.tester ? '' : ' ng-style="{\'width\':' + prop.id + ', \'background-color\': ' + prop.id + 'Color}" ';
                                var width = scope.tester ? '' : ' ng-style="{\'width\':' + prop.id + '}" ';
                                if (angular.isFunction(prop.click)) {
                                    rowTemplate.push('<td class="' + prop.id + 'Class" ' + width + (prop.click ? ' ng-click=\"props[' + index + '].click(model)\"' : '') + '>');
                                } else {
                                    rowTemplate.push('<td class="' + prop.id + 'Class" ' + width + '>');
                                }
                            } else {
                                return;

                            }
                            var prefix = prop.prefix || '';

                            if (prop.editable) {
                                rowTemplate.push('<span class="icon-pencil2 grid-button" ng-mouseup="editStart(' + index + ')"></span>');
                                rowTemplate.push('<span class="row-edit-field-span" ng-show="!model.' + prop.id + '_isEdit" ng-bind="model.' + prop.id + '"></span>');
                                rowTemplate.push('<input id=\"i' + prop.id + '\" class="row-edit-field" ng-model="model.' + prop.id + '" ng-show="model.' + prop.id + '_isEdit" ng-blur="editEnd($event, ' + index + ')" ng-keydown="keyDown($event,' + index + ')"></input>');
                            } else if (!prop.type || prop.type === 'string') {
                                if (typeof prop._getter !== 'undefined') {
                                    rowTemplate.push(prefix + '<span ng-bind="props[' + index + ']._getter(model)"></span>');
                                } else {
                                    rowTemplate.push(prefix + '<span unselectable="on">{{model.' + prop.id + '}}</span>');
                                }
                            } else if (prop.type === 'date') {
                                rowTemplate.push('<span  unselectable="on" ng-bind="parseDate(model.' + prop.id + ') | date: prop.format || \'M/d/yyyy\'"></span>');
                            } else if (prop.type === 'date2') {
                                rowTemplate.push('<span  unselectable="on" ng-bind="parseDate(model.' + prop.id + ') | date: prop.format || \'MM/dd/yyyy\'"></span>');
                            } else if (prop.type === 'timeago') {
                                rowTemplate.push('<span ng-bind="moment(parseDate(model.' + prop.id + ')).fromNow()"></span>');

                            } else if (prop.type === 'datetime') {
                                rowTemplate.push('<span  unselectable="on" ng-bind="parseDateTime(model.' + prop.id + ') | date: prop.format || \'M/d/yyyy h:mma\'"></span>');

                            } else if (prop.type === 'html') {
                                if (typeof prop._getter !== 'undefined') {
                                    rowTemplate.push('<span data-compile data-template="{{props[' + index + ']._getter(model)}}"></span>');
                                } else {
                                    rowTemplate.push(prefix + '<span ng-bind-html="model.' + prop.id + '"></span>');
                                }
                            }
                            rowTemplate.push('</td>');
                        });
                        htmlTemplate = rowTemplate.join('');
                        superCache.put(templateCacheKey, htmlTemplate);
                    }
                    element.html(htmlTemplate);
                    $compile(element.contents())(scope);
                };

                initColumns();
            }
        };
    });
})();

(function () {
    'use strict';

    function TableDataStorageFactory($log) {

        function TableDataStorageService() {
            this.srcModel = {};
            this.storage = [];
            this.header = [];
            this.maxRow = {data: {}};
            this.maxWidth = {};

            this.sortByColumnLastIndex = null;
            this.orderByAscending = true;
        }

        TableDataStorageService.prototype.initModel = function (mdtModel, selectCbFn, dblClickCbFn, contextMenuFn, onPopup) {
            this.storage = [];
            this.maxRow = {data: {}};
            this.maxWidth = {};

            this.selectCbFn = selectCbFn;
            this.dblClickCbFn = dblClickCbFn;
            this.contextMenuFn = contextMenuFn;
            this.onPopup = onPopup;
            var _header = this.header = mdtModel.headers;
            var _storage = this.storage;
            var _maxRow = this.maxRow.data;
            var _maxWidth = this.maxWidth;

            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            //context.font = font;
            var orderIndex = 0;
            _header.forEach(function (header, index) {
                header.class = header.class || '';
                header.class += ' flex-order-' + orderIndex;
                orderIndex++;
                // if (header.secondColumn) {
                //     header.class += ' first-column-section';
                //     header.secondColumn.class += ' flex-order-' + orderIndex;
                // } else {
                //     // header.class
                // }
            });
            mdtModel.data.forEach(function (item) {
                _header.forEach(function (header, index) {
                    var _value = item[header.id];
                    var metrics = context.measureText(_value);
                    var _width = metrics.width;

                    if (!_maxRow[header.id]) {
                        _maxRow[header.id] = _value;
                        _maxWidth[header.id] = _width;
                    } else if (_maxWidth[header.id] < _width) {
                        _maxRow[header.id] = _value;
                        _maxWidth[header.id] = _width;
                    }
                });


                var id = item.id;
                _storage.push({
                    rowId: id,
                    optionList: {
                        selected: false,
                        deleted: false,
                        visible: true
                    },
                    data: item
                });
            });
        };
        TableDataStorageService.prototype.addHeaderCellData = function (ops) {
            this.header.push(ops);
        };

        TableDataStorageService.prototype.addRowData = function (explicitRowId, rowArray) {
            if (!(rowArray instanceof Array)) {
                $log.error('`rowArray` parameter should be array');
                return;
            }

            this.storage.push({
                rowId: explicitRowId,
                optionList: {
                    selected: false,
                    deleted: false,
                    visible: true
                },
                data: rowArray
            });
        };

        TableDataStorageService.prototype.getRowData = function (index) {
            if (!this.storage[index]) {
                $log.error('row is not exists at index: ' + index);
                return;
            }

            return this.storage[index].data;
        };

        TableDataStorageService.prototype.getRowOptions = function (index) {
            if (!this.storage[index]) {
                $log.error('row is not exists at index: ' + index);
                return;
            }

            return this.storage[index].optionList;
        };

        TableDataStorageService.prototype.setAllRowsSelected = function (isSelected, isPaginationEnabled) {
            if (typeof isSelected === 'undefined') {
                $log.error('`isSelected` parameter is required');
                return;
            }

            _.each(this.storage, function (rowData) {
                if (isPaginationEnabled) {
                    if (rowData.optionList.visible) {
                        rowData.optionList.selected = isSelected ? true : false;
                    }
                } else {
                    rowData.optionList.selected = isSelected ? true : false;
                }
            });
        };

        TableDataStorageService.prototype.reverseRows = function () {
            this.storage.reverse();
        };

        TableDataStorageService.prototype.sortByColumn = function (columnIndex, iteratee) {
            if (this.sortByColumnLastIndex === columnIndex) {
                this.reverseRows();

                this.orderByAscending = !this.orderByAscending;
            } else {
                this.sortByColumnIndex(columnIndex, iteratee);

                this.sortByColumnLastIndex = columnIndex;
                this.orderByAscending = true;
            }

            return this.orderByAscending ? -1 : 1;
        };

        TableDataStorageService.prototype.sortByColumnIndex = function (index, iteratee) {

            var sortFunction;
            if (typeof iteratee === 'function') {
                sortFunction = function (rowData) {
                    return iteratee(rowData.data[index], rowData, index);
                };
            } else {
                var id = this.header[index] ? this.header[index].id : undefined;
                sortFunction = function (rowData) {

                    return rowData.data[id || index];
                };
            }

            this.storage = _.sortBy(this.storage, sortFunction);
        };

        TableDataStorageService.prototype.isAnyRowSelected = function () {
            return _.some(this.storage, function (rowData) {
                return rowData.optionList.selected === true && rowData.optionList.deleted === false;
            });
        };

        TableDataStorageService.prototype.getNumberOfSelectedRows = function () {
            var res = _.countBy(this.storage, function (rowData) {
                return rowData.optionList.selected === true && rowData.optionList.deleted === false ? 'selected' : 'unselected';
            });

            return res.selected ? res.selected : 0;
        };

        TableDataStorageService.prototype.deleteSelectedRows = function () {
            var deletedRows = [];

            _.each(this.storage, function (rowData) {
                if (rowData.optionList.selected && rowData.optionList.deleted === false) {

                    if (rowData.rowId) {
                        deletedRows.push(rowData.rowId);

                        //Fallback when no id was specified
                    } else {
                        deletedRows.push(rowData.data);
                    }

                    rowData.optionList.deleted = true;
                }
            });

            return deletedRows;
        };

        return {
            getInstance: function () {
                return new TableDataStorageService();
            }
        };
    }

    angular
        .module('material.components.table')
        .factory('TableDataStorageFactory', TableDataStorageFactory);
}());
(function(){
    'use strict';

    function mdtAjaxPaginationHelperFactory(){

        function mdtAjaxPaginationHelper(params){
            this.tableDataStorageService = params.tableDataStorageService;
            this.rowOptions = params.mdtRowOptions;
            this.paginatorFunction = params.mdtRowPaginatorFunction;
            this.mdtRowPaginatorErrorMessage = params.mdtRowPaginatorErrorMessage || 'Ajax error during loading contents.';

            if(params.paginationSetting &&
                params.paginationSetting.hasOwnProperty('rowsPerPageValues') &&
                params.paginationSetting.rowsPerPageValues.length > 0){

                this.rowsPerPageValues = params.paginationSetting.rowsPerPageValues;
            }else{
                this.rowsPerPageValues = [10,20,30,50,100];
            }

            this.rowsPerPage = this.rowsPerPageValues[0];
            this.page = 1;
            this.totalResultCount = 0;
            this.totalPages = 0;

            this.isLoading = false;

            //fetching the 1st page
            this.fetchPage(this.page);
        }

        mdtAjaxPaginationHelper.prototype.getStartRowIndex = function(){
            return (this.page-1) * this.rowsPerPage;
        };

        mdtAjaxPaginationHelper.prototype.getEndRowIndex = function(){
            return this.getStartRowIndex() + this.rowsPerPage-1;
        };

        mdtAjaxPaginationHelper.prototype.getTotalRowsCount = function(){
            return this.totalPages;
        };

        mdtAjaxPaginationHelper.prototype.getRows = function(){
            return this.tableDataStorageService.storage;
        };

        mdtAjaxPaginationHelper.prototype.previousPage = function(){
            var that = this;
            if(this.page > 1){
                this.fetchPage(this.page-1).then(function(){
                    that.page--;
                });
            }
        };

        mdtAjaxPaginationHelper.prototype.nextPage = function(){
            var that = this;
            if(this.page < this.totalPages){
                this.fetchPage(this.page+1).then(function(){
                    that.page++;
                });
            }
        };

        mdtAjaxPaginationHelper.prototype.fetchPage = function(page){
            this.isLoading = true;

            var that = this;

            return this.paginatorFunction({page: page, pageSize: this.rowsPerPage})
                .then(function(data){
                    that.tableDataStorageService.storage = [];
                    that.setRawDataToStorage(that, data.results, that.rowOptions['table-row-id-key'], that.rowOptions['column-keys']);
                    that.totalResultCount = data.totalResultCount;
                    that.totalPages = Math.ceil(data.totalResultCount / that.rowsPerPage);

                    that.isLoadError = false;
                    that.isLoading = false;

                }, function(){
                    that.tableDataStorageService.storage = [];

                    that.isLoadError = true;
                    that.isLoading = false;
                });
        };

        mdtAjaxPaginationHelper.prototype.setRawDataToStorage = function(that, data, tableRowIdKey, columnKeys){
            var rowId;
            var columnValues = [];
            _.each(data, function(row){
                rowId = _.get(row, tableRowIdKey);
                columnValues = [];

                _.each(columnKeys, function(columnKey){
                    columnValues.push(_.get(row, columnKey));
                });

                that.tableDataStorageService.addRowData(rowId, columnValues);
            });
        };

        mdtAjaxPaginationHelper.prototype.setRowsPerPage = function(rowsPerPage){
            this.rowsPerPage = rowsPerPage;
            this.page = 1;

            this.fetchPage(this.page);
        };

        return {
            getInstance: function(tableDataStorageService, isEnabled, paginatorFunction, rowOptions){
                return new mdtAjaxPaginationHelper(tableDataStorageService, isEnabled, paginatorFunction, rowOptions);
            }
        };
    }

    angular
        .module('material.components.table')
        .service('mdtAjaxPaginationHelperFactory', mdtAjaxPaginationHelperFactory);
}());
(function () {
    'use strict';

    function mdtPaginationHelperFactory() {

        function mdtPaginationHelper(tableDataStorageService, paginationSetting) {
            this.tableDataStorageService = tableDataStorageService;

            if (paginationSetting &&
                paginationSetting.hasOwnProperty('rowsPerPageValues') &&
                paginationSetting.rowsPerPageValues.length > 0) {

                this.rowsPerPageValues = paginationSetting.rowsPerPageValues;
            } else {
                this.rowsPerPageValues = [10, 20, 30, 50, 100];
            }

            this.rowsPerPage = this.rowsPerPageValues[0];
            this.page = 1;
        }

        mdtPaginationHelper.prototype.calculateVisibleRows = function () {
            var that = this;

            _.each(this.tableDataStorageService.storage, function (rowData, index) {
                if (index >= that.getStartRowIndex() && index <= that.getEndRowIndex()) {
                    rowData.optionList.visible = true;
                } else {
                    rowData.optionList.visible = false;
                }
            });
        };

        mdtPaginationHelper.prototype.getStartRowIndex = function () {
            return (this.page - 1) * this.rowsPerPage;
        };

        mdtPaginationHelper.prototype.getEndRowIndex = function () {
            return this.getStartRowIndex() + this.rowsPerPage - 1;
        };

        mdtPaginationHelper.prototype.getTotalRowsCount = function () {
            return this.tableDataStorageService.storage.length;
        };

        mdtPaginationHelper.prototype.dblclick = function (rowData) {
            this.tableDataStorageService.dblClickCbFn({rowData: rowData});
        };
        mdtPaginationHelper.prototype.longClick = function (rowData) {
            this.selectRow(rowData);
            this.contextMenu({rowData: rowData});
        };

        mdtPaginationHelper.prototype.contextMenu = function (rowData, $event) {
            this.tableDataStorageService.contextMenuFn({rowData: rowData, $event:$event});
        };

        mdtPaginationHelper.prototype.selectRow = function (rowData) {
            rowData.optionList.selected = true;


            if (this.tableDataStorageService.selectedRow && rowData != this.tableDataStorageService.selectedRow) {
                this.tableDataStorageService.selectedRow.optionList.selected = false;
            }
            this.tableDataStorageService.selectedRow = rowData;
            this.tableDataStorageService.selectCbFn({rowData: rowData});

        };

        mdtPaginationHelper.prototype.getRows = function () {
            this.calculateVisibleRows();

            return this.tableDataStorageService.storage;
        };

        mdtPaginationHelper.prototype.previousPage = function () {
            if (this.page > 1) {
                this.page--;
            }
        };

        mdtPaginationHelper.prototype.nextPage = function () {
            var totalPages = Math.ceil(this.getTotalRowsCount() / this.rowsPerPage);

            if (this.page < totalPages) {
                this.page++;
            }
        };

        mdtPaginationHelper.prototype.setRowsPerPage = function (rowsPerPage) {
            this.rowsPerPage = rowsPerPage;
            this.page = 1;
        };

        return {
            getInstance: function (tableDataStorageService, isEnabled) {
                return new mdtPaginationHelper(tableDataStorageService, isEnabled);
            }
        };
    }

    angular
        .module('material.components.table')
        .service('mdtPaginationHelperFactory', mdtPaginationHelperFactory);
}());
(function(){
    'use strict';

    var ColumnOptionProvider = {
        ALIGN_RULE : {
            ALIGN_LEFT: 'left',
            ALIGN_RIGHT: 'right'
        }
    };

    angular.module('material.components.table')
        .value('ColumnOptionProvider', ColumnOptionProvider);
})();
(function(){
    'use strict';

    function ColumnAlignmentHelper(ColumnOptionProvider){
        var service = this;
        service.getColumnAlignClass = getColumnAlignClass;

        function getColumnAlignClass(alignRule) {
            if (alignRule === ColumnOptionProvider.ALIGN_RULE.ALIGN_RIGHT) {
                return 'rightAlignedColumn';
            } else {
                return 'leftAlignedColumn';
            }
        }
    }

    angular
        .module('material.components.table')
        .service('ColumnAlignmentHelper', ColumnAlignmentHelper);
}());
(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name mdtCell
     * @restrict E
     * @requires mdtTable
     * @requires mdtRow
     *
     * @description
     * Representing a cell which should be placed inside `mdt-row` element directive.
     *
     * @param {boolean=} htmlContent if set to true, then html content can be placed into the content of the directive.
     *
     * @example
     * <pre>
     *  <mdt-table>
     *      <mdt-header-row>
     *          <mdt-column>Product name</mdt-column>
     *          <mdt-column>Price</mdt-column>
     *          <mdt-column>Details</mdt-column>
     *      </mdt-header-row>
     *
     *      <mdt-row ng-repeat="product in ctrl.products">
     *          <mdt-cell>{{product.name}}</mdt-cell>
     *          <mdt-cell>{{product.price}}</mdt-cell>
     *          <mdt-cell html-content="true">
     *              <a href="productdetails/{{product.id}}">more details</a>
     *          </mdt-cell>
     *      </mdt-row>
     *  </mdt-table>
     * </pre>
     */
    function mdtCellDirective($parse, $compile) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: '^mdtRow',
            link: function ($scope, element, attr, mdtRowCtrl, transclude) {

                transclude(function (clone) {
                    //TODO: rework, figure out something for including html content
                    //scope.$watch($sce.parseAsHtml(attr.htmlContent), function(value) {
                    //
                    //});
                    if (attr.htmlContent) {
                        var value = $parse(attr.sortVal)($scope.$parent);
                        mdtRowCtrl.addToRowDataStorage(value, clone, 'htmlContent');
                    } else {
                        //TODO: better idea?
                        var value = $parse(attr.sortVal)($scope.$parent);
                        var cellValue = $parse(clone.html().replace('{{', '').replace('}}', ''))($scope.$parent);
                        if (value) {
                            mdtRowCtrl.addToRowDataStorage(value, cellValue, 'textContent');
                        } else {
                            mdtRowCtrl.addToRowDataStorage(cellValue);
                        }
                    }
                });
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtCell', mdtCellDirective);
}());
(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name mdtRow
     * @restrict E
     * @requires mdtTable
     *
     * @description
     * Representing a row which should be placed inside `mdt-table` element directive.
     *
     * <i>Please note the following: This element has limited functionality. It cannot listen on data changes that happens outside of the
     * component. E.g.: if you provide an ng-repeat to generate your data rows for the table, using this directive,
     * it won't work well if this data will change. Since the way how transclusions work, it's (with my best
     * knowledge) an impossible task to solve at the moment. If you intend to use dynamic data rows, it's still
     * possible with using mdtRow attribute of mdtTable.</i>
     *
     * @param {string|integer=} tableRowId when set table will have a uniqe id. In case of deleting a row will give
     *      back this id.
     *
     * @example
     * <pre>
     *  <mdt-table>
     *      <mdt-header-row>
     *          <mdt-column>Product name</mdt-column>
     *          <mdt-column>Price</mdt-column>
     *      </mdt-header-row>
     *
     *      <mdt-row
     *          ng-repeat="product in products"
     *          table-row-id="{{product.id}}">
     *          <mdt-cell>{{product.name}}</mdt-cell>
     *          <mdt-cell>{{product.price}}</mdt-cell>
     *      </mdt-row>
     *  </mdt-table>
     * </pre>
     */
    function mdtRowDirective() {
        return {
            restrict: 'E',
            transclude: true,
            require: '^mdtTable',
            scope: {
                tableRowId: '='
            },
            controller: function ($scope) {
                var vm = this;

                vm.addToRowDataStorage = addToRowDataStorage;
                $scope.rowDataStorage = [];

                function addToRowDataStorage(value, content, contentType) {
                    if (contentType === 'htmlContent') {
                        $scope.rowDataStorage.push({value: value, content: content, type: 'html'});
                    } else if (contentType === 'textContent') {
                        $scope.rowDataStorage.push({value: value, content: content, type: 'text'});
                    } else {
                        $scope.rowDataStorage.push(value);
                    }
                }
            },
            link: function ($scope, element, attrs, ctrl, transclude) {
                appendColumns();

                ctrl.addRowData($scope.tableRowId, $scope.rowDataStorage);

                function appendColumns() {
                    transclude(function (clone) {
                        element.append(clone);
                    });
                }
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtRow', mdtRowDirective);
}());
(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name mdtColumn
     * @restrict E
     * @requires mdtTable
     *
     * @description
     * Representing a header column cell which should be placed inside `mdt-header-row` element directive.
     *
     * @param {string=} alignRule align cell content. This settings will have affect on each data cells in the same
     *  column (e.g. every x.th cell in every row).
     *
     *  Assignable values:
     *    - 'left'
     *    - 'right'
     *
     * @param {function()=} sortBy compareFunction callback for sorting the column data's. As every compare function,
     *  should get two parameters and return with the comapred result (-1,1,0)
     *
     * @param {string=} columnDefinition displays a tooltip on hover.
     *
     * @example
     * <pre>
     *  <mdt-table>
     *      <mdt-header-row>
     *          <mdt-column align-rule="left">Product name</mdt-column>
     *          <mdt-column
     *              align-rule="right"
     *              column-definition="The price of the product in gross.">Price</mdt-column>
     *      </mdt-header-row>
     *
     *      <mdt-row ng-repeat="product in ctrl.products">
     *          <mdt-cell>{{product.name}}</mdt-cell>
     *          <mdt-cell>{{product.price}}</mdt-cell>
     *      </mdt-row>
     *  </mdt-table>
     * </pre>
     */
    function mdtColumnDirective(){
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                alignRule: '@',
                sortBy: '=',
                columnDefinition: '@'
            },
            require: ['^mdtTable'],
            link: function ($scope, element, attrs, ctrl, transclude) {
                var mdtTableCtrl = ctrl[0];

                transclude(function (clone) {
                    mdtTableCtrl.addHeaderCell({
                        alignRule: $scope.alignRule,
                        sortBy: $scope.sortBy,
                        columnDefinition: $scope.columnDefinition,
                        columnName: clone.html()
                    });
                });
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtColumn', mdtColumnDirective);
}());
(function(){
    'use strict';

    function mdtGeneratedHeaderCellContentDirective(){
        return {
            restrict: 'E',
            templateUrl: '/main/templates/mdtGeneratedHeaderCellContent.html',
            replace: true,
            scope: false,
            link: function(){

            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtGeneratedHeaderCellContent', mdtGeneratedHeaderCellContentDirective);
}());
(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name mdtHeaderRow
     * @restrict E
     * @requires mdtTable
     *
     * @description
     * Representing a header row which should be placed inside `mdt-table` element directive.
     * The main responsibility of this directive is to execute all the transcluded `mdt-column` element directives.
     *
     */
    function mdtHeaderRowDirective(){
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: '^mdtTable',
            scope: true,
            link: function($scope, element, attrs, mdtCtrl, transclude){
                appendColumns();

                function appendColumns(){
                    transclude(function (clone) {
                        element.append(clone);
                    });
                }
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtHeaderRow', mdtHeaderRowDirective);
}());
(function(){
    'use strict';

    function mdtAddAlignClass(ColumnAlignmentHelper){
        return {
            restrict: 'A',
            scope: {
                mdtAddAlignClass: '='
            },
            link: function($scope, element){
                var classToAdd = ColumnAlignmentHelper.getColumnAlignClass($scope.mdtAddAlignClass);

                element.addClass(classToAdd);
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtAddAlignClass', mdtAddAlignClass);
}());
(function () {
    'use strict';

    function mdtAddHtmlContentToCellDirective() {
        return {
            restrict: 'A',
            scope: {
                mdtAddHtmlContentToCell: '='
            },
            link: function ($scope, element, attr) {
                $scope.$watch('mdtAddHtmlContentToCell', function () {
                    element.empty();
                    element.append($scope.mdtAddHtmlContentToCell);

                });
                //$scope.$watch('htmlContent', function () {
                //    element.empty();
                //    element.append($scope.$eval(attr.mdtAddHtmlContentToCell));
                //});
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtAddHtmlContentToCell', mdtAddHtmlContentToCellDirective);
}());
(function(){
    'use strict';

    function mdtAnimateSortIconHandlerDirective(){
        return {
            restrict: 'A',
            scope: false,
            link: function($scope, element){
                if($scope.animateSortIcon){
                    element.addClass('animate-sort-icon');
                }
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtAnimateSortIconHandler', mdtAnimateSortIconHandlerDirective);
}());
(function(){
    'use strict';

    function mdtSelectAllRowsHandlerDirective(){
        return {
            restrict: 'A',
            scope: false,
            link: function($scope){
                $scope.selectAllRows = false;

                $scope.$watch('selectAllRows', function(val){
                    $scope.tableDataStorageService.setAllRowsSelected(val, $scope.isPaginationEnabled());
                });
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtSelectAllRowsHandler', mdtSelectAllRowsHandlerDirective);
}());
(function(){
    'use strict';

    function mdtSortHandlerDirective(){
        return {
            restrict: 'A',
            scope: false,
            link: function($scope, element){
                var columnIndex = $scope.$index;
                $scope.isSorted = isSorted;
                $scope.direction = 1;



                function sortHandler(){
                    if($scope.sortableColumns){
                        $scope.$apply(function(){
                            $scope.direction = $scope.tableDataStorageService.sortByColumn(columnIndex, $scope.headerRowData.sortBy);
                        });
                    }
                }

                element.on('click', sortHandler);

                function isSorted(){
                    return $scope.tableDataStorageService.sortByColumnLastIndex === columnIndex;
                }

                $scope.$on('$destroy', function(){
                    element.off('click', sortHandler);
                });
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtSortHandler', mdtSortHandlerDirective);
}());
(function () {
    angular
        .module('material.components.table')
        .factory('Util', UtilService);

    function UtilService() {
        return {
            startsWith: function (src, prefix) {
                return src.length >= prefix.length && src.substring(0, prefix.length) === prefix;
            },
            offset: function (node) {
                var parentNode = node,
                    top = 0,
                    left = 0;

                while (typeof parentNode.offsetTop !== 'undefined') {
                    top += parentNode.offsetTop;
                    left += parentNode.offsetLeft;
                    parentNode = parentNode.parentNode;
                }

                return {
                    top: top,
                    left: left
                };
            }
        };
    }
})();

(function(){
    'use strict';

    function mdtCardFooterDirective($timeout){
        return {
            restrict: 'E',
            templateUrl: '/main/templates/mdtCardFooter.html',
            transclude: true,
            replace: true,
            scope: true,
            require: ['^mdtTable'],
            link: function($scope){
                $scope.rowsPerPage = $scope.mdtPaginationHelper.rowsPerPage;

                $scope.$watch('rowsPerPage', function(newVal, oldVal){
                    $scope.mdtPaginationHelper.setRowsPerPage(newVal);
                });
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtCardFooter', mdtCardFooterDirective);
}());
(function(){
    'use strict';

    function mdtCardHeaderDirective(){
        return {
            restrict: 'E',
            templateUrl: '/main/templates/mdtCardHeader.html',
            transclude: true,
            replace: true,
            scope: true,
            require: ['^mdtTable'],
            link: function($scope){
                $scope.isTableCardEnabled = false;

                if($scope.tableCard && $scope.tableCard.visible !== false){
                    $scope.isTableCardEnabled = true;
                }
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtCardHeader', mdtCardHeaderDirective);
}());
angular.module("mdtTemplates", []).run(function($templateCache) {$templateCache.put("/main/templates/1.html","<md-content flex=\"\" class=\"mdtTable md-whiteframe-z1 ng-isolate-scope layout-column flex\" layout=\"column\" style=\"box-shadow: none;\" ng-class=\"{\'invisible\': !tableIsReady}\" ng-if=\"treeIsInitialised\" mdt-model=\"model\" mdt-select-fn=\"onSelect(rowData)\" mdt-empty-title=\"emptyTitle\" ng-hide=\"loading() &amp;&amp; !model.data.length\" mdt-dblclick-fn=\"openFile(rowData)\" menu-list=\"contextMenuList\" on-menu-selected=\"onContextMenuSelected(menuItem)\" on-popup=\"onContextMenuPopup()\" sortable-columns=\"\'true\'\" aria-hidden=\"false\">\n    <md-content ng-hide=\"mdtPaginationHelper.getRows().length\" flex=\"\" layout=\"column\" layout-align=\"center center\" class=\"layout-align-center-center layout-column flex ng-hide\" aria-hidden=\"true\" style=\"\">\n        <span class=\"md-subhead ng-binding\" ng-bind=\"mdtEmptyTitle\"></span>\n    </md-content>\n    <div id=\"visible-header\" layout=\"row\" class=\"row-header layout-row\" style=\"display: block;\" ng-show=\"mdtPaginationHelper.getRows().length\" aria-hidden=\"false\">\n        <!--<md-list-item >-->\n        <!--<div layout=\"row\"  mdt-animate-sort-icon-handler flex>-->\n        <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div flex-order=\"1\" ng-style=\"headerRowData.style\" class=\"th ng-scope ng-isolate-scope leftAlignedColumn md-ink-ripple flex-order-1 flex\" mdt-add-align-class=\"headerRowData.alignRule\" mdt-sort-handler=\"\" md-ink-ripple=\"\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" style=\"min-width: 100px;\">\n        <div>\n            <!-- ngIf: sortableColumns --><div layout=\"row\" ng-if=\"sortableColumns\" style=\"display: inline-block;\" class=\"ng-scope layout-row\">\n\n\n        <span ng-show=\"headerRowData.alignRule == \'right\'\" aria-hidden=\"true\" class=\"ng-hide\">\n            <!-- ngIf: !isSorted() --><span class=\"hoverSortIcons ng-scope\" ng-if=\"!isSorted()\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\"><path d=\"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z\"></path></svg></ng-md-icon>\n            </span><!-- end ngIf: !isSorted() -->\n\n            <!-- ngIf: isSorted() -->\n        </span>\n\n        <span class=\"ng-binding\">\n            Name\n        </span>\n\n        <span ng-show=\"headerRowData.alignRule == \'left\'\" aria-hidden=\"false\" class=\"\">\n            <!-- ngIf: !isSorted() --><span class=\"hoverSortIcons ng-scope\" ng-if=\"!isSorted()\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\"><path d=\"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z\"></path></svg></ng-md-icon>\n            </span><!-- end ngIf: !isSorted() -->\n\n            <!-- ngIf: isSorted() -->\n        </span>\n        </div><!-- end ngIf: sortableColumns -->\n            <!-- ngIf: !sortableColumns -->\n        </div>\n    </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div flex-order=\"1\" ng-style=\"headerRowData.style\" class=\"th ng-scope ng-isolate-scope leftAlignedColumn md-ink-ripple flex-order-1 flex-1 hide-xs hide-md hide-sm\" mdt-add-align-class=\"headerRowData.alignRule\" mdt-sort-handler=\"\" md-ink-ripple=\"\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\">\n        <div>\n            <!-- ngIf: sortableColumns --><div layout=\"row\" ng-if=\"sortableColumns\" style=\"display: inline-block;\" class=\"ng-scope layout-row\">\n\n\n        <span ng-show=\"headerRowData.alignRule == \'right\'\" aria-hidden=\"true\" class=\"ng-hide\">\n            <!-- ngIf: !isSorted() --><span class=\"hoverSortIcons ng-scope\" ng-if=\"!isSorted()\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\"><path d=\"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z\"></path></svg></ng-md-icon>\n            </span><!-- end ngIf: !isSorted() -->\n\n            <!-- ngIf: isSorted() -->\n        </span>\n\n        <span class=\"ng-binding\">\n            Created by\n        </span>\n\n        <span ng-show=\"headerRowData.alignRule == \'left\'\" aria-hidden=\"false\" class=\"\">\n            <!-- ngIf: !isSorted() --><span class=\"hoverSortIcons ng-scope\" ng-if=\"!isSorted()\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\"><path d=\"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z\"></path></svg></ng-md-icon>\n            </span><!-- end ngIf: !isSorted() -->\n\n            <!-- ngIf: isSorted() -->\n        </span>\n        </div><!-- end ngIf: sortableColumns -->\n            <!-- ngIf: !sortableColumns -->\n        </div>\n    </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n        <!--</div>-->\n    </div>\n    <md-content class=\"data-container layout-column flex\" flex=\"\" layout=\"column\" ng-show=\"mdtPaginationHelper.getRows().length\" aria-hidden=\"false\" style=\"\">\n        <md-list flex=\"\" mtd-context-menu=\"\" menu-list=\"menuList\" on-menu-selected=\"onMenuSelected(menuItem)\" on-popup=\"onPopup()\" role=\"list\" class=\"ng-isolate-scope flex\">\n            <!-- ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">folder</i><span class=\"principal-title\">OSHA</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">—</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">folder</i><span class=\"principal-title\">Packaging</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">—</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">folder</i><span class=\"principal-title\">Processing</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">—</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">folder</i><span class=\"principal-title\">Sanitation</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">—</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">folder</i><span class=\"principal-title\">Warehouse</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">—</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">description</i><span class=\"principal-title\">0AFF5D15-413F-4959-90F8-C3AFBC63F6F7-e3dccb89-8558-462b-aacb-0b859cc76a49</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">Administrator Administrator</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope selectedRow\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\" style=\"\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">description</i><span class=\"principal-title\">181F4D4F-416B-4809-89FA-98E09E310489-e3dccb89-8558-462b-aacb-0b859cc76a49</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">Administrator Administrator</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">description</i><span class=\"principal-title\">2DD7E7AB-DE99-4B14-ADB6-52460AC092EC-e3dccb89-8558-462b-aacb-0b859cc76a49</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">Administrator Administrator</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">description</i><span class=\"principal-title\">76489882-FA6C-4AE8-B5E0-304BE5357433-e3dccb89-8558-462b-aacb-0b859cc76a49</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">Administrator Administrator</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">description</i><span class=\"principal-title\">76973718-B9CB-4132-B9FB-8B17C0F41B8D-e3dccb89-8558-462b-aacb-0b859cc76a49</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">Administrator Administrator</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">description</i><span class=\"principal-title\">91AACB2C-8F85-425B-A73D-AD86613C666A-e3dccb89-8558-462b-aacb-0b859cc76a49</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">Administrator Administrator</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">description</i><span class=\"principal-title\">9D681466-0143-448E-A88D-AB516F60EE18-e3dccb89-8558-462b-aacb-0b859cc76a49</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">Administrator Administrator</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">description</i><span class=\"principal-title\">C247F639-0495-4080-9C4C-E26D508EDA32-e3dccb89-8558-462b-aacb-0b859cc76a49</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">Administrator Administrator</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">description</i><span class=\"principal-title\">F53082EB-D1D9-4063-A5CB-FF0D2D0EB80D-e3dccb89-8558-462b-aacb-0b859cc76a49</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">Administrator Administrator</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index --><md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\" class=\"row-container md-no-proxy ng-scope\" ng-class=\"{\'selectedRow\': rowData.optionList.selected}\" on-long-press=\"mdtPaginationHelper.selectRow(rowData)\" ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\" mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\" role=\"listitem\" tabindex=\"0\">\n            <!-- ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-0 flex\" flex-order=\"0\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\" style=\"min-width: 100px;\">\n            <!-- ngSwitchWhen: html --><span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\" class=\"ng-scope ng-isolate-scope\"><i id=\"picon\" class=\"md-avatar material-icons\">description</i><span class=\"principal-title\">FC9171EB-0449-4657-8968-0DF8953F2C38-e3dccb89-8558-462b-aacb-0b859cc76a49</span></span><!-- end ngSwitchWhen: -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index --><div class=\"td ng-scope flex-order-1 flex-1 hide-xs hide-md hide-sm\" flex-order=\"1\" ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\" ng-switch=\"headerRowData.type\" ng-style=\"headerRowData.style\">\n            <!-- ngSwitchWhen: html -->\n            <!-- ngSwitchWhen: date -->\n            <!-- ngSwitchDefault:  --><span ng-switch-default=\"\" class=\"ng-binding ng-scope\">Administrator Administrator</span><!-- end ngSwitchWhen: -->\n\n        </div><!-- end ngRepeat: headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index -->\n\n        </md-list-item><!-- end ngRepeat: rowData in mdtPaginationHelper.getRows() track by $index -->\n        </md-list>\n    </md-content>\n\n\n    <!-- table card -->\n    <div class=\"mdt-footer ng-hide layout-row\" layout=\"row\" ng-show=\"isPaginationEnabled()\" aria-hidden=\"true\">\n        <div class=\"mdt-pagination layout-align-end-center layout-row flex\" layout=\"row\" layout-align=\"end center\" flex=\"\">\n\n            <span layout-margin=\"\" class=\"layout-margin\">Rows per page:</span>\n            <md-input-container class=\"md-input-has-value\">\n                <md-select ng-model=\"rowsPerPage\" aria-label=\"rows per page: 10\" class=\"ng-pristine ng-untouched ng-valid\" tabindex=\"0\" aria-disabled=\"false\" role=\"listbox\" aria-expanded=\"false\" aria-multiselectable=\"false\" id=\"select_8\" aria-owns=\"select_container_9\" aria-invalid=\"false\"><md-select-value class=\"md-select-value\" id=\"select_value_label_4\"><span><div class=\"md-text ng-binding\">10</div></span><span class=\"md-select-icon\" aria-hidden=\"true\"></span></md-select-value><div class=\"md-select-menu-container\" aria-hidden=\"true\" id=\"select_container_9\"><md-select-menu class=\"ng-scope\"><md-content>\n                    <!-- ngRepeat: pageSize in mdtPaginationHelper.rowsPerPageValues --><md-option ng-value=\"pageSize\" ng-repeat=\"pageSize in mdtPaginationHelper.rowsPerPageValues\" tabindex=\"0\" class=\"ng-scope md-ink-ripple\" role=\"option\" aria-selected=\"true\" id=\"select_option_10\" value=\"10\" selected=\"selected\"><div class=\"md-text ng-binding\">10</div></md-option><!-- end ngRepeat: pageSize in mdtPaginationHelper.rowsPerPageValues --><md-option ng-value=\"pageSize\" ng-repeat=\"pageSize in mdtPaginationHelper.rowsPerPageValues\" tabindex=\"0\" class=\"ng-scope md-ink-ripple\" role=\"option\" aria-selected=\"false\" id=\"select_option_11\" value=\"20\"><div class=\"md-text ng-binding\">20</div></md-option><!-- end ngRepeat: pageSize in mdtPaginationHelper.rowsPerPageValues --><md-option ng-value=\"pageSize\" ng-repeat=\"pageSize in mdtPaginationHelper.rowsPerPageValues\" tabindex=\"0\" class=\"ng-scope md-ink-ripple\" role=\"option\" aria-selected=\"false\" id=\"select_option_12\" value=\"30\"><div class=\"md-text ng-binding\">30</div></md-option><!-- end ngRepeat: pageSize in mdtPaginationHelper.rowsPerPageValues --><md-option ng-value=\"pageSize\" ng-repeat=\"pageSize in mdtPaginationHelper.rowsPerPageValues\" tabindex=\"0\" class=\"ng-scope md-ink-ripple\" role=\"option\" aria-selected=\"false\" id=\"select_option_13\" value=\"50\"><div class=\"md-text ng-binding\">50</div></md-option><!-- end ngRepeat: pageSize in mdtPaginationHelper.rowsPerPageValues --><md-option ng-value=\"pageSize\" ng-repeat=\"pageSize in mdtPaginationHelper.rowsPerPageValues\" tabindex=\"0\" class=\"ng-scope md-ink-ripple\" role=\"option\" aria-selected=\"false\" id=\"select_option_14\" value=\"100\"><div class=\"md-text ng-binding\">100</div></md-option><!-- end ngRepeat: pageSize in mdtPaginationHelper.rowsPerPageValues -->\n                </md-content></md-select-menu></div></md-select>\n            </md-input-container>\n\n        <span layout-margin=\"\" class=\"layout-margin ng-binding\">\n            1-10 of 15\n        </span>\n\n            <button class=\"md-icon-button md-primary md-button md-ink-ripple\" type=\"button\" ng-transclude=\"\" aria-label=\"Previous page\" ng-click=\"mdtPaginationHelper.previousPage()\">\n                <ng-md-icon icon=\"keyboard_arrow_left\" size=\"24\" class=\"ng-scope\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><path d=\"M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z\"></path></svg></ng-md-icon>\n            </button>\n\n            <button class=\"md-icon-button md-primary md-button md-ink-ripple\" type=\"button\" ng-transclude=\"\" aria-label=\"Next page\" ng-click=\"mdtPaginationHelper.nextPage()\">\n                <ng-md-icon icon=\"keyboard_arrow_right\" size=\"24\" class=\"ng-scope\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><path d=\"M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z\"></path></svg></ng-md-icon>\n            </button>\n        </div>\n    </div>\n    <!-- table card end -->\n</md-content>");
$templateCache.put("/main/templates/mdtAlternateHeaders.html","<div class=\"mdt-header-alternate\" layout=\"row\" layout-align=\"start center\">\n    <span class=\"alternate-text\" flex>{{tableDataStorageService.getNumberOfSelectedRows()}} item selected</span>\n    <md-button class=\"md-icon-button md-primary\" ng-click=\"deleteSelectedRows()\" aria-label=\"Delete selected rows\">\n        <ng-md-icon icon=\"delete\" size=\"24\"></ng-md-icon>\n    </md-button>\n\n    <md-button class=\"md-icon-button md-primary\" aria-label=\"More options\">\n        <ng-md-icon icon=\"more_vert\" size=\"24\"></ng-md-icon>\n    </md-button>\n</div>");
$templateCache.put("/main/templates/mdtCardFooter.html","<div class=\"mdt-footer\" layout=\"row\" ng-show=\"isPaginationEnabled()\">\n    <div class=\"mdt-pagination\"\n         layout=\"row\"\n         layout-align=\"end center\"\n         flex>\n\n        <span layout-margin>Rows per page:</span>\n        <md-input-container>\n            <md-select ng-model=\"rowsPerPage\" aria-label=\"rows per page\">\n                <md-option ng-value=\"pageSize\" ng-repeat=\"pageSize in mdtPaginationHelper.rowsPerPageValues\">{{pageSize}}</md-option>\n            </md-select>\n        </md-input-container>\n\n        <span layout-margin>\n            {{mdtPaginationHelper.getStartRowIndex()+1}}-{{mdtPaginationHelper.getEndRowIndex()+1}} of {{mdtPaginationHelper.getTotalRowsCount()}}\n        </span>\n\n        <md-button class=\"md-icon-button md-primary\" aria-label=\"Previous page\" ng-click=\"mdtPaginationHelper.previousPage()\">\n            <ng-md-icon icon=\"keyboard_arrow_left\" size=\"24\"></ng-md-icon>\n        </md-button>\n\n        <md-button class=\"md-icon-button md-primary\" aria-label=\"Next page\" ng-click=\"mdtPaginationHelper.nextPage()\">\n            <ng-md-icon icon=\"keyboard_arrow_right\" size=\"24\"></ng-md-icon>\n        </md-button>\n    </div>\n</div>");
$templateCache.put("/main/templates/mdtCardHeader.html","<div class=\"mdt-header\" layout=\"row\" layout-align=\"start center\" ng-show=\"isTableCardEnabled\">\n    <span flex>{{tableCard.title}}</span>\n<!--\n    <md-button class=\"md-icon-button md-primary\" aria-label=\"Filter\">\n        <ng-md-icon icon=\"filter_list\" size=\"24\"></ng-md-icon>\n    </md-button>\n    <md-button class=\"md-icon-button md-primary\" aria-label=\"More options\">\n        <ng-md-icon icon=\"more_vert\" size=\"24\"></ng-md-icon>\n    </md-button>\n-->\n</div>");
$templateCache.put("/main/templates/mdtDropdown.html","<md-whiteframe class=\"md-whiteframe-z1\" layout=\"column\">\n  <md-button ng-if=\"menuItem.enabled\" class=\"mdt-dropdown-menu-item\" ng-repeat=\"menuItem in menuList\" ng-click=\"onMenuSelected(menuItem)\" layout=\"row\" aria-label=\"{{::menuItem.name}}\">\n    <md-icon md-font-icon=\"material-icons\">{{::menuItem.icon}}</md-icon> <span class=\"name\" ng-bind=\"::menuItem.name\"></span>\n  </md-button>\n</md-whiteframe>\n");
$templateCache.put("/main/templates/mdtGeneratedHeaderCellContent.html","<div>\n    <div layout=\"row\" ng-if=\"sortableColumns\" style=\"display: inline-block;\">\n        <md-tooltip ng-show=\"headerRowData.columnDefinition\">{{headerRowData.columnDefinition}}</md-tooltip>\n\n        <span ng-show=\"headerRowData.alignRule == \'right\'\">\n            <span class=\"hoverSortIcons\" ng-if=\"!isSorted()\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n\n            <span class=\"sortedColumn\" ng-if=\"isSorted()\" ng-class=\"direction == -1 ? \'ascending\' : \'descending\'\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n        </span>\n\n        <span>\n            {{headerRowData.columnName}}\n        </span>\n\n        <span ng-show=\"headerRowData.alignRule == \'left\'\">\n            <span class=\"hoverSortIcons\" ng-if=\"!isSorted()\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n\n            <span class=\"sortedColumn\" ng-if=\"isSorted()\" ng-class=\"direction == -1 ? \'ascending\' : \'descending\'\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n        </span>\n    </div>\n    <div ng-if=\"!sortableColumns\">\n        <md-tooltip ng-show=\"headerRowData.columnDefinition\">{{headerRowData.columnDefinition}}</md-tooltip>\n\n        <span>\n            {{headerRowData.columnName}}\n        </span>\n    </div>\n</div>");
$templateCache.put("/main/templates/mdtTable.bk.html","<div class=\"mdtTable flex\">\n    <md-content class=\"data-container layout-column flex\">\n        <!--\n         flex mtd-context-menu\n                 menu-list=\"menuList\"\n                 on-menu-selected=\"onMenuSelected(menuItem)\"\n                 on-popup=\"onPopup()\"\n        -->\n        <md-list class=\"flex\">\n            <!--\n                                      on-long-press=\"mdtPaginationHelper.selectRow(rowData)\"\n                          ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\"\n                          mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\"\n            -->\n            <md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\"\n                          class=\"row-container\"\n                          ng-class=\"{\'selectedRow\': rowData.optionList.selected}\">\n                <div class=\"td\"\n                     flex-order=\"{{$index}}\"\n\n                     ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\"\n                     ng-class=\"headerRowData.class\"\n                     ng-switch=\"headerRowData.type\"\n                     ng-style=\"headerRowData.style\">\n                    <span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\"></span>\n                    <span ng-switch-when=\"date\">{{(headerRowData.content(rowData) || rowData.data[headerRowData.id]) | date:\'MMM dd, yyyy\' | ifEmpty:\'&#8212\'}}</span>\n                    <span ng-switch-default>{{headerRowData.content(rowData) || rowData.data[headerRowData.id] | ifEmpty:\'&#8212\'}}</span>\n\n                </div>\n\n                </div>\n\n            </md-list-item>\n        </md-list>\n    </md-content>\n    <!--<md-content ng-hide=\"mdtPaginationHelper.getRows().length\" flex layout=\"column\" layout-align=\"center center\">-->\n        <!--<span class=\"md-subhead\" ng-bind=\"mdtEmptyTitle\"></span>-->\n    <!--</md-content>-->\n    <!--<div id=\"visible-header\" layout=\"row\" class=\"row-header\" style=\"display: block\" ng-show=\"mdtPaginationHelper.getRows().length\">\n        &lt;!&ndash;<md-list-item >&ndash;&gt;\n        &lt;!&ndash;<div layout=\"row\"  mdt-animate-sort-icon-handler flex>&ndash;&gt;\n            <div flex-order=\"1\"\n                 ng-style=\"headerRowData.style\"\n                 class=\"th\"\n                 mdt-add-align-class=\"headerRowData.alignRule\"\n                 mdt-sort-handler\n                 md-ink-ripple=\"{{rippleEffect}}\"\n                 ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\">\n                <mdt-generated-header-cell-content></mdt-generated-header-cell-content>\n            </div>\n        &lt;!&ndash;</div>&ndash;&gt;\n    </div>-->\n\n\n\n    <!-- table card -->\n    <!--<mdt-card-footer></mdt-card-footer>-->\n    <!-- table card end -->\n</div>");
$templateCache.put("/main/templates/mdtTable.html","<md-content flex class=\"mdtTable md-whiteframe-z1\" layout=\"column\" style=\"box-shadow: none;\"  ng-cloak>\n    <md-content ng-hide=\"mdtPaginationHelper.getRows().length\" flex layout=\"column\" layout-align=\"center center\">\n        <span class=\"md-subhead\" ng-bind=\"mdtEmptyTitle\"></span>\n    </md-content>\n    <div id=\"visible-header\" class=\"row-header\" style=\"display: block\" ng-show=\"mdtPaginationHelper.getRows().length\">\n        <div layout=\"row\" mdt-animate-sort-icon-handler flex>\n            <div flex-order=\"1\"\n                 ng-style=\"headerRowData.style\"\n                 class=\"th\"\n                 mdt-add-align-class=\"headerRowData.alignRule\"\n                 mdt-sort-handler\n                 md-ink-ripple=\"{{rippleEffect}}\"\n                 ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\">\n                <mdt-generated-header-cell-content></mdt-generated-header-cell-content>\n            </div>\n        </div>\n    </div>\n    <md-content class=\"data-container\" flex layout=\"column\" ng-show=\"mdtPaginationHelper.getRows().length\" ng-class=\"{\'invisible\': !tableIsReady}\">\n        <md-list flex mtd-context-menu\n                 menu-list=\"menuList\"\n                 on-menu-selected=\"onMenuSelected(menuItem)\"\n                 on-popup=\"onPopup()\">\n            <md-virtual-repeat-container style=\"top:0;bottom:0;left:0;right:0;position: absolute\">\n            <md-list-item md-virtual-repeat=\"rowData in mdtPaginationHelper.getRows()\"\n                          class=\"row-container\"\n                          ng-class=\"{\'selectedRow\': rowData.optionList.selected}\"\n                          ng-click=\"mdtPaginationHelper.selectRow(rowData)\"\n                          on-long-press=\"mdtPaginationHelper.selectRow(rowData)\"\n                          ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\"\n                          mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\">\n                <div class=\"td\"\n                     ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\"\n                     ng-class=\"headerRowData.class\"\n                     ng-switch=\"headerRowData.type\"\n                     ng-style=\"headerRowData.style\">\n\n                    <div class=\"first-column-section\">\n                        <span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\"></span>\n                        <span ng-switch-when=\"date\">{{(headerRowData.content(rowData) || rowData.data[headerRowData.id]) | date:\'MMM dd, yyyy\' | ifEmpty:\'&#8212\'}}</span>\n                        <span ng-switch-default>{{headerRowData.content(rowData) || rowData.data[headerRowData.id] | ifEmpty:\'&#8212\'}}</span>\n                    </div>\n                    <div ng-if=\"headerRowData.secondColumn\" class=\"second-column-section\" ng-class=\"headerRowData.secondColumn.class\" ng-switch=\"headerRowData.secondColumn.type\">\n                        <span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.secondColumn.content(rowData)\"></span>\n                        <span ng-switch-when=\"date\">{{headerRowData.secondColumn.content(rowData) | date:\'MMM dd, yyyy\' | ifEmpty:\'&#8212\'}}</span>\n                        <span ng-switch-default>{{headerRowData.secondColumn.content(rowData) | ifEmpty:\'&#8212\'}}</span>\n                    </div>\n                </div>\n            </md-list-item>\n            </md-virtual-repeat-container>\n        </md-list>\n    </md-content>\n\n\n    <!-- table card -->\n    <mdt-card-footer></mdt-card-footer>\n    <!-- table card end -->\n</md-content>");});