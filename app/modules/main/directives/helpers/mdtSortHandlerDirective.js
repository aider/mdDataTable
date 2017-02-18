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
                    if(angular.isFunction($scope.headerRowData.onColumnClick)) {
                        $scope.headerRowData.onColumnClick($scope.tableDataStorageService.storage);
                    }
                    if ($scope.sortableColumns && $scope.headerRowData.sortable) {
                        $scope.$apply(function () {
                            $scope.direction = $scope.tableDataStorageService.sortByColumn(columnIndex, $scope.headerRowData.sortBy);
                        });
                    }
                }

                element.on('click', sortHandler);

                function isSorted() {
                    return $scope.tableDataStorageService.sortByColumnLastIndex === columnIndex;
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