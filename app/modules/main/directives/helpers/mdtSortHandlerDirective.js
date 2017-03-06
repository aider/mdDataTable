(function () {
    'use strict';

    function mdtSortHandlerDirective() {
        return {
            restrict: 'A',
            scope: false,
            link: function ($scope, element) {
                var columnIndex = $scope.$index;
                $scope.isSorted = isSorted;
                $scope.direction = 1;


                function sortHandler() {
                    if (angular.isFunction($scope.headerRowData.onColumnClick)) {
                        if ($scope.headerRowData.onColumnClick($scope.tableDataStorageService.storage)) {
                            return;
                        }

                    }
                    if ($scope.sortableColumns && $scope.headerRowData.sortable) {
                        $scope.$apply(function () {
                            if (angular.isFunction($scope.headerRowData.sortByColumn)) {
                                $scope.direction = $scope.headerRowData.sortByColumn();
                            } else {
                                $scope.direction = $scope.tableDataStorageService.sortByColumn(columnIndex, $scope.headerRowData.sortBy);
                            }
                        });
                    }
                }

                element.on('click', sortHandler);

                function isSorted() {
                    return angular.isFunction($scope.headerRowData.isSorted) ? $scope.headerRowData.isSorted() : $scope.tableDataStorageService.sortByColumnLastIndex === columnIndex;
                }

                $scope.$on('$destroy', function () {
                    element.off('click', sortHandler);
                });
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtSortHandler', mdtSortHandlerDirective);
}());