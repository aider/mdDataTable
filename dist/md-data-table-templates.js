angular.module("mdtTemplates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/main/templates/mdtAlternateHeaders.html","<div class=\"mdt-header-alternate\" layout=\"row\" layout-align=\"start center\">\n    <span class=\"alternate-text\" flex>{{tableDataStorageService.getNumberOfSelectedRows()}} item selected</span>\n    <md-button class=\"md-icon-button md-primary\" ng-click=\"deleteSelectedRows()\" aria-label=\"Delete selected rows\">\n        <ng-md-icon icon=\"delete\" size=\"24\"></ng-md-icon>\n    </md-button>\n\n    <md-button class=\"md-icon-button md-primary\" aria-label=\"More options\">\n        <ng-md-icon icon=\"more_vert\" size=\"24\"></ng-md-icon>\n    </md-button>\n</div>");
$templateCache.put("/main/templates/mdtCardFooter.html","<div class=\"mdt-footer\" layout=\"row\" ng-show=\"isPaginationEnabled()\">\n    <div class=\"mdt-pagination\"\n         layout=\"row\"\n         layout-align=\"end center\"\n         flex>\n\n        <span layout-margin>Rows per page:</span>\n        <md-input-container>\n            <md-select ng-model=\"rowsPerPage\" aria-label=\"rows per page\">\n                <md-option ng-value=\"pageSize\" ng-repeat=\"pageSize in mdtPaginationHelper.rowsPerPageValues\">{{pageSize}}</md-option>\n            </md-select>\n        </md-input-container>\n\n        <span layout-margin>\n            {{mdtPaginationHelper.getStartRowIndex()+1}}-{{mdtPaginationHelper.getEndRowIndex()+1}} of {{mdtPaginationHelper.getTotalRowsCount()}}\n        </span>\n\n        <md-button class=\"md-icon-button md-primary\" aria-label=\"Previous page\" ng-click=\"mdtPaginationHelper.previousPage()\">\n            <ng-md-icon icon=\"keyboard_arrow_left\" size=\"24\"></ng-md-icon>\n        </md-button>\n\n        <md-button class=\"md-icon-button md-primary\" aria-label=\"Next page\" ng-click=\"mdtPaginationHelper.nextPage()\">\n            <ng-md-icon icon=\"keyboard_arrow_right\" size=\"24\"></ng-md-icon>\n        </md-button>\n    </div>\n</div>");
$templateCache.put("/main/templates/mdtCardHeader.html","<div class=\"mdt-header\" layout=\"row\" layout-align=\"start center\" ng-show=\"isTableCardEnabled\">\n    <span flex>{{tableCard.title}}</span>\n<!--\n    <md-button class=\"md-icon-button md-primary\" aria-label=\"Filter\">\n        <ng-md-icon icon=\"filter_list\" size=\"24\"></ng-md-icon>\n    </md-button>\n    <md-button class=\"md-icon-button md-primary\" aria-label=\"More options\">\n        <ng-md-icon icon=\"more_vert\" size=\"24\"></ng-md-icon>\n    </md-button>\n-->\n</div>");
$templateCache.put("/main/templates/mdtDropdown.html","<md-whiteframe class=\"md-whiteframe-z1\" layout=\"column\">\n  <md-button ng-if=\"menuItem.enabled\" class=\"mdt-dropdown-menu-item\" ng-repeat=\"menuItem in menuList\" ng-click=\"onMenuSelected(menuItem)\" layout=\"row\" aria-label=\"{{::menuItem.name}}\">\n    <md-icon md-font-icon=\"material-icons\">{{::menuItem.icon}}</md-icon> <span class=\"name\" ng-bind=\"::menuItem.name\"></span>\n  </md-button>\n</md-whiteframe>\n");
$templateCache.put("/main/templates/mdtGeneratedHeaderCellContent.html","<div>\n    <div layout=\"row\" ng-if=\"sortableColumns\" style=\"display: inline-block;\">\n        <md-tooltip ng-show=\"headerRowData.columnDefinition\">{{headerRowData.columnDefinition}}</md-tooltip>\n\n        <span ng-show=\"headerRowData.alignRule == \'right\'\">\n            <span class=\"hoverSortIcons\" ng-if=\"!isSorted()\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n\n            <span class=\"sortedColumn\" ng-if=\"isSorted()\" ng-class=\"direction == -1 ? \'ascending\' : \'descending\'\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n        </span>\n\n        <span>\n            {{headerRowData.columnName}}\n        </span>\n\n        <span ng-show=\"headerRowData.alignRule == \'left\'\">\n            <span class=\"hoverSortIcons\" ng-if=\"!isSorted()\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n\n            <span class=\"sortedColumn\" ng-if=\"isSorted()\" ng-class=\"direction == -1 ? \'ascending\' : \'descending\'\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n        </span>\n    </div>\n    <div ng-if=\"!sortableColumns\">\n        <md-tooltip ng-show=\"headerRowData.columnDefinition\">{{headerRowData.columnDefinition}}</md-tooltip>\n\n        <span>\n            {{headerRowData.columnName}}\n        </span>\n    </div>\n</div>");
$templateCache.put("/main/templates/mdtTable.html","<md-content flex class=\"mdtTable md-whiteframe-z1\" layout=\"column\" style=\"box-shadow: none;\" ng-cloak>\n\n    <div layout=\"row\" layout-align=\"center\" style=\"display:block;\">\n        <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n            <thead id=\"visible-header\">\n            <tr class=\"theadTrRow\" mdt-animate-sort-icon-handler>\n                <th class=\"checkboxCell\"\n                    style=\" text-align:left;\"\n                    ng-if=\"selectableRows\"\n                    mdt-select-all-rows-handler>\n                    <md-checkbox aria-label=\"select all\" ng-model=\"selectAllRows\"></md-checkbox>\n                </th>\n                <th ng-style=\"headerRowData.style\" style=\"position:relative\"\n                    class=\"column\"\n                    ng-class=\"\'columnSize\'+$index\"\n                    ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\"\n                    mdt-add-align-class=\"headerRowData.alignRule\"\n                    mdt-sort-handler\n                    md-ink-ripple=\"{{rippleEffect}}\">\n                    <div class=\"column-container\" ng-style=\"headerRowData.style\">\n                        <div class=\"column-header-body\">\n                            <mdt-generated-header-cell-content></mdt-generated-header-cell-content>\n                        </div>\n                    </div>\n                </th>\n            </tr>\n            </thead>\n            <tbody id=\"hiddenBody\" style=\"visibility: hidden;\">\n            <tr class=\"theadTrRow\" mdt-animate-sort-icon-handler>\n\n                <td style=\"position:relative\" ng-style=\"headerRowData.style\"\n                    class=\"column\"\n                    ng-class=\"\'columnSize\'+$index\"\n                    ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\"\n                    mdt-add-align-class=\"headerRowData.alignRule\"\n                    ng-switch=\"headerRowData.type\">\n                    <div class=\"column-container\" ng-style=\"headerRowData.style\">\n                        <div class=\"column-body\">\n                            <span ng-switch-when=\"html\"\n                                  mdt-add-html-content-to-cell=\"headerRowData.content(tableDataStorageService.maxRow)\"></span>\n                            <span ng-switch-when=\"date\">{{tableDataStorageService.maxRow.data[headerRowData.id] | date:\'MMM dd, yyyy\' | ifEmpty:\'&#8212\'}}</span>\n                            <span ng-switch-default>{{headerRowData.content(tableDataStorageService.maxRow) || tableDataStorageService.maxRow.data[headerRowData.id] || \'&#8212\'}}</span>\n                        </div>\n                    </div>\n\n                </td>\n            </tbody>\n        </table>\n\n    </div>\n    <md-content flex layout=\"row\" layout-align=\"center\" ng-style=\"{\'margin-top\': hiddenBodyHeight()}\"\n                style=\"box-shadow: none\">\n        <table id=\"data-table\" cellpadding=\"0\" cellspacing=\"0\"\n               mtd-context-menu\n               menu-list=\"menuList\"\n               on-menu-selected=\"onMenuSelected(menuItem)\"\n               on-popup=\"onPopup()\"\n\n               ng-style=\"{\'margin-top\': hiddenHeadHeight()}\">\n            <thead id=\"hiddenHead\" style=\"visibility: hidden;\">\n            <tr class=\"theadTrRow\"\n                mdt-animate-sort-icon-handler>\n\n                <th class=\"checkboxCell\"\n                    style=\"text-align:left;\"\n                    ng-if=\"selectableRows\"\n                    mdt-select-all-rows-handler>\n                    <md-checkbox aria-label=\"select all\" ng-model=\"selectAllRows\"></md-checkbox>\n                </th>\n\n                <th ng-style=\"headerRowData.style\" style=\"position: relative\"\n                    ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\"\n                    mdt-add-align-class=\"headerRowData.alignRule\"\n                    class=\"column\"\n                    ng-class=\"\'columnSize\'+$index\"\n                    mdt-sort-handler\n                    md-ink-ripple=\"{{rippleEffect}}\">\n\n                    <div class=\"column-container\" ng-style=\"headerRowData.style\">\n                        <div class=\"column-header-body\">\n                            <mdt-generated-header-cell-content></mdt-generated-header-cell-content>\n                        </div>\n                    </div>\n                </th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\"\n                ng-class=\"{\'selectedRow\': rowData.optionList.selected}\"\n                ng-click=\"mdtPaginationHelper.selectRow(rowData)\"\n                ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\"\n                mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\"\n                ng-show=\"(isPaginationEnabled() === false || rowData.optionList.visible === true) && rowData.optionList.deleted === false\">\n\n                <td class=\"checkboxCell\" ng-show=\"selectableRows\">\n                    <md-checkbox aria-label=\"select\" ng-model=\"rowData.optionList.selected\"></md-checkbox>\n                </td>\n\n                <td ng-style=\"headerRowData.style\" style=\"position:relative\"\n                    class=\"column\"\n                    ng-class=\"\'columnSize\'+$index\"\n                    ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\"\n                    mdt-add-align-class=\"headerRowData.alignRule\"\n                    ng-switch=\"headerRowData.type\">\n                    <div class=\"column-container\" ng-style=\"headerRowData.style\">\n                        <div class=\"column-body\">\n                            <span ng-switch-when=\"html\"\n                                  mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\"></span>\n                            <span ng-switch-when=\"date\">{{rowData.data[headerRowData.id] | date:\'MMM dd, yyyy\' | ifEmpty:\'&#8212\'}}</span>\n                            <span ng-switch-default>{{headerRowData.content(rowData) || rowData.data[headerRowData.id] || \'&#8212\'}}</span>\n                        </div>\n                    </div>\n\n                </td>\n            </tr>\n            <tr ng-show=\"mdtPaginationHelper.isLoading\">\n                <td colspan=\"999\">\n                    <md-progress-linear md-mode=\"indeterminate\"></md-progress-linear>\n                </td>\n            </tr>\n            <tr ng-show=\"mdtPaginationHelper.isLoadError\">\n                <td colspan=\"999\" ng-bind=\"mdtPaginationHelper.mdtRowPaginatorErrorMessage\">\n                </td>\n            </tr>\n            </tbody>\n        </table>\n\n\n    </md-content>\n\n\n    <!-- table card -->\n    <mdt-card-footer></mdt-card-footer>\n    <!-- table card end -->\n</md-content>");}]);