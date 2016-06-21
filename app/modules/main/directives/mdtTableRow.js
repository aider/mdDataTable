'use strict';

(function () {
    var module = angular.module('material.components.table');
    module.directive('mdtTableRow', function (superCache, TableDataStorageFactory, $filter, $compile, $timeout, $rootScope) {
        return {
            restrict: 'A',
            scope: {
                gridId: '=',
                props: '=',
                model: '='
            },
            replace: true,
            link: function (scope, element, attrs) {

                var initColumns = function () {
                    var templateCacheKey = 'row_template' + scope.gridId;
                    var htmlTemplate = superCache.get(templateCacheKey);
                    if (!htmlTemplate) {
                        var rowTemplate = [];
                        var sortedProps = scope.props.filter(function (item) {
                            return item.enabled;
                        });
                        superCache.put('sortedProps', sortedProps);
                        sortedProps.forEach(function (prop, index) {
                            if (prop.enabled) {
                                var style = '';
                                Object.keys(prop.style).forEach(function (kstyle) {
                                    // if(kstyle)
                                    style += kstyle + ':' + prop.style[kstyle] + ';';
                                });

                                var width = scope.tester ? '' : ' ng-style="{\'width\':' + prop.id + '}" ';
                                rowTemplate.push('<div class="td ' + prop.class + '" ng-click="prop.onClick(model)" style="' + style + '">');
                                rowTemplate.push('<div class="first-column-section">');
                                if (prop.type === 'html') {
                                    rowTemplate.push('<span mdt-add-html-content-to-cell="prop.content(model)"></span>');
                                } else if (prop.type === 'date') {
                                    rowTemplate.push('<span>{{(prop.content(rowData) || model.data[prop.id]) | dateFilter:\'&#8212\'}}</span>');
                                } else {
                                    rowTemplate.push('<span ng-switch-default>{{prop.content(model) || model.data[prop.id] | ifEmpty:\'&#8212\'}}</span>');
                                }
                                rowTemplate.push('</div>');

                                if (prop.secondColumn) {
                                    rowTemplate.push('<div class="second-column-section ' + prop.secondColumn.class + '">');
                                    if (prop.type === 'html') {
                                        rowTemplate.push('<span mdt-add-html-content-to-cell="prop.secondColumn.content(model)"></span>');
                                    } else if (prop.type === 'date') {
                                        rowTemplate.push('<span>{{(prop.secondColumn.content(rowData) | dateFilter:\'&#8212\'}}</span>');
                                    } else {
                                        rowTemplate.push('<span ng-switch-default>{{prop.secondColumn.content(model) | ifEmpty:\'&#8212\'}}</span>');
                                    }
                                    rowTemplate.push('</div>');
                                }
                                rowTemplate.push('</div>');
                            }
                        });
                        htmlTemplate = rowTemplate.join('');
                        superCache.put(templateCacheKey, htmlTemplate);
                    }
                    element.html(htmlTemplate);
                    $compile(element.contents())(scope);
                };

                initColumns();
            }
        };
    });
})();
