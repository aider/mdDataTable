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

            var startRowIndex = that.getStartRowIndex();
            var endRowIndex = that.getEndRowIndex();
            for (var index = 0; index < that.tableDataStorageService.storage.length; index++) {
                // var rowData = this.tableDataStorageService.storage[index];
                // that.tableDataStorageService.storage[index];
                that.tableDataStorageService.storage[index].optionList.visible = !!(index >= startRowIndex && index <= endRowIndex);

            }
            // _.each(this.tableDataStorageService.storage, function (rowData, index) {
            //     if (index >= that.getStartRowIndex() && index <= that.getEndRowIndex()) {
            //         rowData.optionList.visible = true;
            //     } else {
            //         rowData.optionList.visible = false;
            //     }
            // });
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
            this.tableDataStorageService.contextMenuFn({rowData: rowData, $event: $event});
        };

        mdtPaginationHelper.prototype.selectRow = function (rowData) {
            rowData.optionList.selected = true;


            if (this.tableDataStorageService.selectedRow && rowData != this.tableDataStorageService.selectedRow) {
                this.tableDataStorageService.selectedRow.optionList.selected = false;
            }
            this.tableDataStorageService.selectedRow = rowData;
            this.tableDataStorageService.selectCbFn({rowData: rowData});

        };
        mdtPaginationHelper.prototype.onTouch = function (rowData) {
            var isMobile = /iPhone|iPod|iPad|Android/i.test(navigator.userAgent);
            if (isMobile) {
                rowData.optionList.selected = true;


                if (this.tableDataStorageService.selectedRow && rowData != this.tableDataStorageService.selectedRow) {
                    this.tableDataStorageService.selectedRow.optionList.selected = false;
                }
                this.tableDataStorageService.selectedRow = rowData;
                this.tableDataStorageService.touchCbFn({rowData: rowData});
            } else {
                this.selectRow(rowData);
            }
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