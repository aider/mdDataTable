'use strict';

(function () {

    function mdtTableRow(superCache, $compile, $sce, mdtPaginationHelperFactory) {
        return {
            restrict: 'A',
            scope: {
                gridId: '=',
                props: '=',
                model: '=',
                onClick: '&'
            },
            link: function (scope, element, attrs) {

                scope.trustAsHtml = function (string) {
                    return $sce.trustAsHtml(string);
                };
                var initColumns = function () {
                    var templateCacheKey = 'row_template' + scope.gridId;
                    var htmlTemplate = superCache.get(templateCacheKey);
                    if (!htmlTemplate) {
                        var rowTemplate = [];

                        var sortedProps = scope.props.filter(function (item) {
                            return item.enabled;
                        });
                        var isOnClickExists = scope.props.some(function (item) {
                            return !!item.onClick;
                        });
                        // superCache.put('sortedProps', sortedProps);
                        if (!isOnClickExists) {
                            // rowTemplate.push('<button class="md-no-style md-button md-ink-ripple" type="button" ng-click="onTouch(model)">');
                            rowTemplate.push('<div class="md-button md-no-style"><button class="md-no-style md-button" type="button" ng-click="onClick(model)"></button><div class="md-list-item-inner">');
                        }

                        sortedProps.forEach(function (prop, index) {
                            if (prop.enabled) {
                                var style = '';
                                Object.keys(prop.style).forEach(function (kstyle) {
                                    // if(kstyle)
                                    var pValue = prop.style[kstyle];
                                    if (!isNaN(+pValue)) {
                                        pValue += 'px'
                                    }
                                    style += kstyle + ':' + pValue + ';';
                                });


                                // (prop.onClick ? ' ng-click="props[\'' + index + '\'].onClick(model)"' : '')
                                // rowTemplate.push('<div class="td ' + prop.class +'" '+  + style = "' + style + '" > ');
                                rowTemplate.push('<div class="td ' + prop.class + '" ' + (prop.onClick ? ' ng-click="props[\'' + index + '\'].onClick(model)"' : '') + ' style="' + style + '" > ');
                                rowTemplate.push('<div class="first-column-section">');
                                if (prop.type === 'html') {
                                    rowTemplate.push('<span ng-bind-html="trustAsHtml(props[\'' + index + '\'].content(model))"></span>');
                                } else if (prop.type === 'currency') {
                                    rowTemplate.push('<span>{{(props[\'' + index + '\'].content(model) || model.data[\'' + prop.id + '\']) | currency:\'$\' | ifEmpty:\'&#8212\'}}</span>');
                                } else if (prop.type === 'number') {
                                    rowTemplate.push('<span>{{(props[\'' + index + '\'].content(model) || model.data[\'' + prop.id + '\']) | number:0 | ifEmpty:\'&#8212\'}}</span>');
                                } else if (prop.type === 'date') {
                                    if (prop.format) {
                                        rowTemplate.push('<span>{{(props[\'' + index + '\'].content(model) || model.data[\'' + prop.id + '\']) | date:\'' + prop.format + '\' | ifEmpty:\'&#8212\'}}</span>');
                                    } else {
                                        rowTemplate.push('<span>{{(props[\'' + index + '\'].content(model) || model.data[\'' + prop.id + '\']) | dateFilter:\'&#8212\'}}</span>');
                                    }
                                } else if (prop.type === 'datetime') {
                                    rowTemplate.push('<span>{{(props[\'' + index + '\'].content(model) || model.data[\'' + prop.id + '\']) | date:\'M/d/yyyy h:mm a\' | ifEmpty:\'&#8212\'}}</span>');
                                } else if (angular.isFunction(prop.content)) {
                                    rowTemplate.push('<span>{{props[\'' + index + '\'].content(model) | ifEmpty:\'&#8212\'}}</span>');
                                } else {
                                    rowTemplate.push('<span>{{model.data[\'' + prop.id + '\'] | ifEmpty:\'&#8212\'}}</span>');
                                }
                                rowTemplate.push('</div>');

                                if (prop.secondColumn) {
                                    rowTemplate.push('<div class="second-column-section ' + prop.secondColumn.class + '">');
                                    if (prop.type === 'html') {
                                        rowTemplate.push('<span ng-bind-html="trustAsHtml(props[\'' + index + '\'].secondColumn.content(model))"></span>');
                                    } else if (prop.type === 'date') {
                                        rowTemplate.push('<span>{{(props[\'' + index + '\'].secondColumn.content(model) | dateFilter:\'&#8212\'}}</span>');
                                    } else {
                                        rowTemplate.push('<span>{{props[\'' + index + '\'].secondColumn.content(model) | ifEmpty:\'&#8212\'}}</span>');
                                    }
                                    rowTemplate.push('</div>');
                                }
                                rowTemplate.push('</div>');
                            }
                        });
                        if (!isOnClickExists) {
                            rowTemplate.push('</div>');
                        }

                        htmlTemplate = rowTemplate.join('');
                        superCache.put(templateCacheKey, htmlTemplate);
                    }
                    element.html(htmlTemplate);
                    $compile(element.contents())(scope);
                };

                // var unbind = scope.$watch('model', function (newData) {
                //     if (newData) {
                //         initColumns();
                //         unbind();
                //     }
                // });
                initColumns();
            }
        };
    }

    angular.module('material.components.table').directive('mdtTableRow', ['superCache', '$compile', '$sce', 'mdtPaginationHelperFactory', mdtTableRow]);
})();
