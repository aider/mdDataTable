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
        .directive('mdtCell', ['$parse', '$compile',mdtCellDirective]);
}());