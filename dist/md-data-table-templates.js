angular.module("mdtTemplates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/main/templates/mdtAlternateHeaders.html","<div class=\"mdt-header-alternate\" layout=\"row\" layout-align=\"start center\">\n    <span class=\"alternate-text\" flex>{{tableDataStorageService.getNumberOfSelectedRows()}} item selected</span>\n    <md-button class=\"md-icon-button md-primary\" ng-click=\"deleteSelectedRows()\" aria-label=\"Delete selected rows\">\n        <ng-md-icon icon=\"delete\" size=\"24\"></ng-md-icon>\n    </md-button>\n\n    <md-button class=\"md-icon-button md-primary\" aria-label=\"More options\">\n        <ng-md-icon icon=\"more_vert\" size=\"24\"></ng-md-icon>\n    </md-button>\n</div>");
$templateCache.put("/main/templates/mdtCardFooter.html","<div class=\"mdt-footer\" layout=\"row\" ng-show=\"isPaginationEnabled()\">\n    <div class=\"mdt-pagination\"\n         layout=\"row\"\n         layout-align=\"end center\"\n         flex>\n\n        <span layout-margin>Rows per page:</span>\n        <md-input-container>\n            <md-select ng-model=\"rowsPerPage\" aria-label=\"rows per page\">\n                <md-option ng-value=\"pageSize\" ng-repeat=\"pageSize in mdtPaginationHelper.rowsPerPageValues\">{{pageSize}}</md-option>\n            </md-select>\n        </md-input-container>\n\n        <span layout-margin>\n            {{mdtPaginationHelper.getStartRowIndex()+1}}-{{mdtPaginationHelper.getEndRowIndex()+1}} of {{mdtPaginationHelper.getTotalRowsCount()}}\n        </span>\n\n        <md-button class=\"md-icon-button md-primary\" aria-label=\"Previous page\" ng-click=\"mdtPaginationHelper.previousPage()\">\n            <ng-md-icon icon=\"keyboard_arrow_left\" size=\"24\"></ng-md-icon>\n        </md-button>\n\n        <md-button class=\"md-icon-button md-primary\" aria-label=\"Next page\" ng-click=\"mdtPaginationHelper.nextPage()\">\n            <ng-md-icon icon=\"keyboard_arrow_right\" size=\"24\"></ng-md-icon>\n        </md-button>\n    </div>\n</div>");
$templateCache.put("/main/templates/mdtCardHeader.html","<div class=\"mdt-header\" layout=\"row\" layout-align=\"start center\" ng-show=\"isTableCardEnabled\">\n    <span flex>{{tableCard.title}}</span>\n<!--\n    <md-button class=\"md-icon-button md-primary\" aria-label=\"Filter\">\n        <ng-md-icon icon=\"filter_list\" size=\"24\"></ng-md-icon>\n    </md-button>\n    <md-button class=\"md-icon-button md-primary\" aria-label=\"More options\">\n        <ng-md-icon icon=\"more_vert\" size=\"24\"></ng-md-icon>\n    </md-button>\n-->\n</div>");
$templateCache.put("/main/templates/mdtDropdown.html","<md-whiteframe class=\"md-whiteframe-4dp md-whiteframe-z2\" layout=\"column\">\n  <md-button ng-if=\"menuItem.enabled\" class=\"mdt-dropdown-menu-item\" ng-repeat=\"menuItem in menuList\" ng-click=\"onMenuSelected(menuItem)\" layout=\"row\" aria-label=\"{{::menuItem.name}}\">\n    <md-icon md-font-icon=\"material-icons\">{{::menuItem.icon}}</md-icon> <span class=\"name\" ng-bind=\"::menuItem.name\" flex></span>\n  </md-button>\n</md-whiteframe>\n");
$templateCache.put("/main/templates/mdtGeneratedHeaderCellContent.html","<div>\n    <div layout=\"row\" ng-show=\"sortableColumns\" style=\"display: inline-block;\">\n        <md-tooltip ng-show=\"headerRowData.columnDefinition\">{{headerRowData.columnDefinition}}</md-tooltip>\n\n        <span ng-show=\"headerRowData.alignRule == \'right\'\">\n            <span class=\"hoverSortIcons\" ng-show=\"!isSorted()\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n\n            <span class=\"sortedColumn\" ng-show=\"isSorted()\" ng-class=\"direction == -1 ? \'ascending\' : \'descending\'\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n        </span>\n\n        <span>\n            {{headerRowData.columnName}}\n        </span>\n\n        <span ng-show=\"headerRowData.alignRule == \'left\'\">\n            <span class=\"hoverSortIcons\" ng-show=\"!isSorted()\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n\n            <span class=\"sortedColumn\" ng-show=\"isSorted()\" ng-class=\"direction == -1 ? \'ascending\' : \'descending\'\">\n                <ng-md-icon icon=\"arrow_forward\" size=\"16\"></ng-md-icon>\n            </span>\n        </span>\n    </div>\n    <div ng-show=\"!sortableColumns\">\n        <md-tooltip ng-show=\"headerRowData.columnDefinition\">{{headerRowData.columnDefinition}}</md-tooltip>\n\n        <span>\n            {{headerRowData.columnName}}\n        </span>\n    </div>\n</div>");
$templateCache.put("/main/templates/mdtTable.html","<md-content id=\"grid_{{gridId}}\" flex class=\"mdtTable md-whiteframe-z1\" ng-style=\"{\'min-width\':tableDataStorageService.tableWidth}\" layout=\"column\" style=\"width:100%;box-shadow: none;overflow-x: hidden;\" ng-cloak ng-class=\"{\'invisible\': (!tableIsReady || !tableDataStorageService.tableWidth))}\">\n\n\n    <div ng-hide=\"mdtPaginationHelper.getRows().length\" flex layout=\"column\" layout-align=\"center center\" style=\"height: 100%\">\n        <span class=\"md-subhead\" ng-bind=\"mdtEmptyTitle\"></span>\n    </div>\n    <div id=\"visible-header\" class=\"row-header\" style=\"display: block\" ng-show=\"mdtPaginationHelper.getRows().length && !mtHideHeader\">\n        <div ng-cloak layout=\"row\" mdt-animate-sort-icon-handler flex>\n            <div\n                    ng-style=\"headerRowData.style\"\n                    class=\"th\"\n                    mdt-add-align-class=\"headerRowData.alignRule\"\n                    mdt-sort-handler\n                    md-ink-ripple=\"{{rippleEffect}}\"\n                    ng-repeat=\"headerRowData in tableDataStorageService.header | filter: {enabled : true} track by $index\" ng-class=\"headerRowData.class\">\n                <mdt-generated-header-cell-content></mdt-generated-header-cell-content>\n            </div>\n            <div class=\"th flex-order-{{tableDataStorageService.header.length}}\" ng-if=\"isScrollVisible\" ng-style=\"{\'width\':scrollWidth,\'padding-right\':\'0\'}\"></div>\n        </div>\n    </div>\n    <div class=\"data-container\" flex layout=\"column\" ng-show=\"mdtPaginationHelper.getRows().length\" ng-if=\"isSelectable\">\n        <md-list flex mtd-context-menu\n                 style=\"position: relative\"\n                 menu-list=\"menuList\"\n                 on-menu-selected=\"onMenuSelected(menuItem)\"\n                 on-popup=\"onPopup()\">\n            <md-virtual-repeat-container ng-style=\"mtHideHeader && {\'top\':\'10px\'} || {\'top\':\'0px\'}\" style=\"bottom:0;left:0;right:0;width:100%;position: absolute\">\n                <md-list-item md-virtual-repeat=\"rowData in tableDataStorageService.storage\"\n                              md-item-size=\"49\"\n                              aria-label=\"{{$index}}\"\n                              ng-class=\"{\'selectedRow\': rowData.optionList.selected}\"\n                              class=\"row-container\"\n                              on-long-press=\"mdtPaginationHelper.selectRow(rowData)\"\n                              ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\"\n                              mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\"\n                              mdt-table-row\n                              data-grid-id=\"gridId\"\n                              data-on-click=\"mdtPaginationHelper.onTouch(rowData)\"\n                              data-props=\"tableDataStorageService.header\"\n                              data-model=\"rowData\">\n                </md-list-item>\n            </md-virtual-repeat-container>\n        </md-list>\n    </div>\n    <div class=\"data-container\" flex layout=\"column\" ng-show=\"mdtPaginationHelper.getRows().length\" ng-if=\"!isSelectable\">\n        <md-list flex style=\"position: relative\">\n\n            <md-virtual-repeat-container ng-style=\"mtHideHeader && {\'top\':\'10px\'} || {\'top\':\'0px\'}\" style=\"bottom:0;left:0;right:0;width:100%;position: absolute\">\n                <md-list-item md-virtual-repeat=\"rowData in tableDataStorageService.storage\"\n                              md-item-size=\"49\"\n                              aria-label=\"{{$index}}\"\n                              class=\"row-container\"\n                              on-long-press=\"mdtPaginationHelper.selectRow(rowData)\"\n                              ng-dblclick=\"mdtPaginationHelper.dblclick(rowData)\"\n                              mtd-right-click=\"mdtPaginationHelper.selectRow(rowData)\"\n                              mdt-table-row\n                              data-grid-id=\"gridId\"\n                              data-on-click=\"mdtPaginationHelper.onTouch(rowData)\"\n                              data-props=\"tableDataStorageService.header\"\n                              data-model=\"rowData\">\n                </md-list-item>\n            </md-virtual-repeat-container>\n        </md-list>\n    </div>\n</md-content>\n");}]);