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

        function MdtInvisible($animate) {
            return {
                link: function (scope, elem, attrs) {
                    var unWatch = scope.$watch(attrs.ccInvisible, function (value) {
                        // elem[value ? 'removeClass' : 'addClass']('mdt-invisible');
                        value = angular.isDefined(value) && value !=='false';
                        $animate[value ? 'addClass' : 'removeClass'](elem, 'cc-invisible', {
                            tempClasses: 'ng-invisible-animate'
                        });
                        unWatch();
                    });
                }
            };
        }

    angular
        .module('material.components.table')
        .directive('ccInvisible', ['$animate', MdtInvisible]);


}());