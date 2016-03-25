angular.module("mdtTemplates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/main/templates/mdtAlternateHeaders.html","<div class=\"mdt-header-alternate\" layout=\"row\" layout-align=\"start center\">\n    <span class=\"alternate-text\" flex>{{tableDataStorageService.getNumberOfSelectedRows()}} item selected</span>\n    <md-button class=\"md-icon-button md-primary\" ng-click=\"deleteSelectedRows()\" aria-label=\"Delete selected rows\">\n        <ng-md-icon icon=\"delete\" size=\"24\"></ng-md-icon>\n    </md-button>\n\n    <md-button class=\"md-icon-button md-primary\" aria-label=\"More options\">\n        <ng-md-icon icon=\"more_vert\" size=\"24\"></ng-md-icon>\n    </md-button>\n</div>");
$templateCache.put("/main/templates/mdtCardFooter.html","<div class=\"mdt-footer\" layout=\"row\" ng-show=\"isPaginationEnabled()\">\n    <div class=\"mdt-pagination\"\n         layout=\"row\"\n         layout-align=\"end center\"\n         flex>\n\n        <span layout-margin>Rows per page:</span>\n        <md-input-container>\n            <md-select ng-model=\"rowsPerPage\" aria-label=\"rows per page\">\n                <md-option ng-value=\"pageSize\" ng-repeat=\"pageSize in mdtPaginationHelper.rowsPerPageValues\">{{pageSize}}</md-option>\n            </md-select>\n        </md-input-container>\n\n        <span layout-margin>\n            {{mdtPaginationHelper.getStartRowIndex()+1}}-{{mdtPaginationHelper.getEndRowIndex()+1}} of {{mdtPaginationHelper.getTotalRowsCount()}}\n        </span>\n\n        <md-button class=\"md-icon-button md-primary\" aria-label=\"Previous page\" ng-click=\"mdtPaginationHelper.previousPage()\">\n            <ng-md-icon icon=\"keyboard_arrow_left\" size=\"24\"></ng-md-icon>\n        </md-button>\n\n        <md-button class=\"md-icon-button md-primary\" aria-label=\"Next page\" ng-click=\"mdtPaginationHelper.nextPage()\">\n            <ng-md-icon icon=\"keyboard_arrow_right\" size=\"24\"></ng-md-icon>\n        </md-button>\n    </div>\n</div>");
$templateCache.put("/main/templates/mdtCardHeader.html","<div class=\"mdt-header\" layout=\"row\" layout-align=\"start center\" ng-show=\"isTableCardEnabled\">\n    <span flex>{{tableCard.title}}</span>\n<!--\n    <md-button class=\"md-icon-button md-primary\" aria-label=\"Filter\">\n        <ng-md-icon icon=\"filter_list\" size=\"24\"></ng-md-icon>\n    </md-button>\n    <md-button class=\"md-icon-button md-primary\" aria-label=\"More options\">\n        <ng-md-icon icon=\"more_vert\" size=\"24\"></ng-md-icon>\n    </md-button>\n-->\n</div>");
$templateCache.put("/main/templates/mdtDropdown.html","<md-whiteframe class=\"md-whiteframe-z1\" layout=\"column\">\n  <md-button ng-if=\"menuItem.enabled\" class=\"mdt-dropdown-menu-item\" ng-repeat=\"menuItem in menuList\" ng-click=\"onMenuSelected(menuItem)\" layout=\"row\" aria-label=\"{{::menuItem.name}}\">\n    <md-icon md-font-icon=\"material-icons\">{{::menuItem.icon}}</md-icon> <span class=\"name\" ng-bind=\"::menuItem.name\"></span>\n  </md-button>\n</md-whiteframe>\n");
$templateCache.put("/main/templates/mdtGeneratedHeaderCellContent.html","<div>\n    <div layout=\"row\" ng-if=\"sortableColumns\" style=\"display: inline-block;\">\n        <md-tooltip ng-show=\"headerRowData.columnDefinition\">{{headerRowData.columnDefinition}}</md-tooltip>\n\n        <span ng-show=\"headerRowData.alignRule == \'right\'\">\n            <span class=\"hoverSortIcons\" ng-if=\"!isSorted()\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n\n            <span class=\"sortedColumn\" ng-if=\"isSorted()\" ng-class=\"direction == -1 ? \'ascending\' : \'descending\'\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n        </span>\n\n        <span>\n            {{headerRowData.columnName}}\n        </span>\n\n        <span ng-show=\"headerRowData.alignRule == \'left\'\">\n            <span class=\"hoverSortIcons\" ng-if=\"!isSorted()\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n\n            <span class=\"sortedColumn\" ng-if=\"isSorted()\" ng-class=\"direction == -1 ? \'ascending\' : \'descending\'\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n        </span>\n    </div>\n    <div ng-if=\"!sortableColumns\">\n        <md-tooltip ng-show=\"headerRowData.columnDefinition\">{{headerRowData.columnDefinition}}</md-tooltip>\n\n        <span>\n            {{headerRowData.columnName}}\n        </span>\n    </div>\n</div>");
$templateCache.put("/main/templates/mdtTable.html","<md-content flex class=\"mdtTable md-whiteframe-z1\" layout=\"column\" style=\"box-shadow: none;\" ng-cloak ng-class=\"{\'invisible\': !tableIsReady}\">\n    <md-content ng-hide=\"mdtPaginationHelper.getRows().length\" flex layout=\"column\" layout-align=\"center center\">\n        <span class=\"md-subhead\" ng-bind=\"mdtEmptyTitle\"></span>\n    </md-content>\n    <div id=\"visible-header\" class=\"row-header\" style=\"display: block\" ng-show=\"mdtPaginationHelper.getRows().length\">\n        <div layout=\"row\" mdt-animate-sort-icon-handler flex>\n            <div flex-order=\"1\"\n                 ng-style=\"headerRowData.style\"\n                 class=\"th\"\n                 mdt-add-align-class=\"headerRowData.alignRule\"\n                 mdt-sort-handler\n                 md-ink-ripple=\"{{rippleEffect}}\"\n                 ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\">\n                <mdt-generated-header-cell-content></mdt-generated-header-cell-content>\n            </div>\n        </div>\n    </div>\n    <div class=\"data-container\" flex layout=\"column\" ng-show=\"mdtPaginationHelper.getRows().length\" vs-repeat vs-scroll-parent=\"\">\n        <md-list flex mtd-context-menu\n                 menu-list=\"menuList\"\n                 on-menu-selected=\"onMenuSelected(menuItem)\"\n                 on-popup=\"onPopup()\">\n            <!--<div vs-repeat style=\"width: 100%;height: 100%\">-->\n                <!--<md-virtual-repeat-container style=\"top:0;bottom:0;left:0;right:0;position: absolute\"> md-on-demand=\"true\" md-item-size=\"49\"-->\n            <md-list-item ng-repeat=\"rowData in mdtPaginationHelper.getRows() track by $index\"\n                              class=\"row-container\"\n                              ng-class=\"{\'selectedRow\': rowData.optionList.selected}\"\n                              ng-click=\"mdtPaginationHelper.selectRow(rowData)\"\n                              on-long-press=\"mdtPaginationHelper.selectRow(rowData)\"\n                              ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\"\n                              mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\">\n                    <div class=\"td\"\n                         ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\"\n                         ng-class=\"headerRowData.class\"\n                         ng-switch=\"headerRowData.type\"\n                         ng-style=\"headerRowData.style\">\n\n                        <div class=\"first-column-section\">\n                            <span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.content(rowData)\"></span>\n                            <span ng-switch-when=\"date\">{{(headerRowData.content(rowData) || rowData.data[headerRowData.id]) | date:\'MMM dd, yyyy\' | ifEmpty:\'&#8212\'}}</span>\n                            <span ng-switch-default>{{headerRowData.content(rowData) || rowData.data[headerRowData.id] | ifEmpty:\'&#8212\'}}</span>\n                        </div>\n                        <div ng-if=\"headerRowData.secondColumn\" class=\"second-column-section\" ng-class=\"headerRowData.secondColumn.class\" ng-switch=\"headerRowData.secondColumn.type\">\n                            <span ng-switch-when=\"html\" mdt-add-html-content-to-cell=\"headerRowData.secondColumn.content(rowData)\"></span>\n                            <span ng-switch-when=\"date\">{{headerRowData.secondColumn.content(rowData) | date:\'MMM dd, yyyy\' | ifEmpty:\'&#8212\'}}</span>\n                            <span ng-switch-default>{{headerRowData.secondColumn.content(rowData) | ifEmpty:\'&#8212\'}}</span>\n                        </div>\n                    </div>\n                </md-list-item>\n            <!--</div>-->\n            <!--</md-virtual-repeat-container>-->\n        </md-list>\n    </div>\n\n\n    <!-- table card -->\n    <mdt-card-footer></mdt-card-footer>\n    <!-- table card end -->\n</md-content>");}]);