(function () {
    'use strict';

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }

    function TableDataStorageFactory($log) {

        function TableDataStorageService() {
            this.srcModel = {};
            this.storage = [];
            this.header = [];
            this.tableWidth = 0;
            this.maxRow = {data: {}};
            this.maxWidth = {};
            this.avgWidth = {};

            this.sortByColumnLastIndex = null;
            this.orderByAscending = true;
        }

        TableDataStorageService.prototype.initModel = function (mdtModel, selectCbFn, touchCbFn, dblClickCbFn, contextMenuFn, onPopup) {
            this.storage = [];
            this.maxRow = {data: {}};
            this.maxWidth = {};

            this.selectCbFn = selectCbFn;
            this.dblClickCbFn = dblClickCbFn;
            this.touchCbFn = touchCbFn;
            this.contextMenuFn = contextMenuFn;
            this.onPopup = onPopup;
            var _header = this.header = mdtModel.headers;
            var _storage = this.storage;
            var _maxRow = this.maxRow.data;
            var _maxWidth = this.maxWidth;
            var _avgWidth = this.avgWidth;
            var _avgNonEmpty = {};
            var _headerWidth = {};

            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            context.font = '500 12px Roboto';
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

                var _value = header.columnName;
                var metrics = context.measureText(_value);
                var _width = metrics.width + 45;
                _headerWidth[header.id] = _width;
                if (!_maxRow[header.id]) {
                    _maxRow[header.id] = _value;
                    _maxWidth[header.id] = _width;
                } else if (_maxWidth[header.id] < _width) {
                    _maxRow[header.id] = _value;
                    _maxWidth[header.id] = _width;
                }

            });
            context.font = '400 13px Roboto';

            mdtModel.data.forEach(function (item) {
                _header.forEach(function (header, index) {
                    var _value = item[header.id];
                    var metrics = context.measureText(_value);
                    var _width = metrics.width + 45;
                    if (!_avgWidth[header.id]) {
                        _avgWidth[header.id] = 0;
                    }
                    if (!_avgNonEmpty[header.id]) {
                        _avgNonEmpty[header.id] = 0;
                    }

                    var isEmpty = !angular.isDefined(_value) || _value == null || /^\s*$/.test(_value);
                    _avgNonEmpty[header.id] += isEmpty ? 0 : 1;
                    _avgWidth[header.id] += isEmpty ? 0 :_width;
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
            var _tableWidth = 0;


            _header.forEach(function (header, index) {
                _avgWidth[header.id] = _avgWidth[header.id] / _avgNonEmpty[header.id];
                if (_avgWidth[header.id] < _headerWidth[header.id]) {
                    _avgWidth[header.id] = _headerWidth[header.id];
                }

                header.style = header.style || {};
                if (!header.style['width'] || header.style['width'] < _maxWidth[header.id]) {
                    header.style['width'] = Math.round(_maxWidth[header.id]);
                }
                if (!header.style['min-width'] || header.style['min-width'] < _avgWidth[header.id]) {
                    header.style['min-width'] = Math.round(_avgWidth[header.id]);
                }

                _tableWidth += header.style['min-width'] + (index === 0 ? 16 + 6 : 6 + 6);

            });

            this.tableWidth = _tableWidth;

            if (this.sortByColumnLastIndex >= 0) {
                this.sortByColumnIndex(this.sortByColumnLastIndex, undefined, this.sortFunction);
                if (!this.orderByAscending) {
                    this.storage.reverse();
                }
            }
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
            for (var i = 0; i < this.storage.length; i++) {
                var rowData = this.storage[i];
                if (isPaginationEnabled) {
                    if (rowData.optionList.visible) {
                        rowData.optionList.selected = isSelected ? true : false;
                    }
                } else {
                    rowData.optionList.selected = isSelected ? true : false;
                }

            }
        };

        TableDataStorageService.prototype.reverseRows = function () {
            this.storage.reverse();
        };

        TableDataStorageService.prototype.sortByColumn = function (columnIndex, iteratee, manual) {
            if (this.sortByColumnLastIndex === columnIndex && !manual) {
                this.reverseRows();

                this.orderByAscending = !this.orderByAscending;
            } else {
                this.sortByColumnIndex(columnIndex, iteratee);
                this.orderByAscending = true;
            }
            this.sortByColumnLastIndex = columnIndex;
            return this.orderByAscending ? -1 : 1;
        };

        TableDataStorageService.prototype.sortByColumnIndex = function (index, iteratee, _sortFunction) {
            if (!_sortFunction) {
                if (typeof iteratee === 'function') {
                    _sortFunction = function (rowData) {
                        return iteratee(rowData.data[index], rowData, index);
                    };
                } else {
                    var id = this.header[index] ? this.header[index].id : undefined;
                    _sortFunction = function (rowData) {

                        var datum = rowData.data[id || index];

                        return !angular.isDefined(datum) || datum == null || /^\s*$/.test(datum) ? undefined : datum.trim();
                    };
                }
                this.sortFunction = _sortFunction;
            } else {
                _sortFunction = this.sortFunction;
            }
            this.storage = _.sortBy(this.storage, _sortFunction);

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
        .factory('TableDataStorageFactory', ['$log', TableDataStorageFactory]);
}());