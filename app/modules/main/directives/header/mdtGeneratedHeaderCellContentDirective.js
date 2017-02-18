(function () {
    'use strict';

    function mdtGeneratedHeaderCellContentDirective($sce) {
        return {
            restrict: 'E',
            templateUrl: '/main/templates/mdtGeneratedHeaderCellContent.html',
            replace: true,
            scope: false,
            link: function (scope) {
                scope.trustHtml = function (html) {
                    return $sce.trustAsHtml(html);
                }
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('mdtGeneratedHeaderCellContent', ['$sce', mdtGeneratedHeaderCellContentDirective]);
}());