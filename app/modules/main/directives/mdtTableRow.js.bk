'use strict';

(function () {
    var module = angular.module('material.components.table');
    module.directive('mdtTableRow', function (superCache, TableDataStorageFactory, $filter, $compile, $timeout, $rootScope) {
        return {
            restrict: 'A',
            scope: {
                gridId: '=',
                props: '=',
                model: '=',
                minSize: '=',
                tester: '@'
                //editFn: '&',
            },
            replace: true,
            link: function (scope, element, attrs) {
                var code = {
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40,
                    enter: 13,
                    backspace: 8,
                    delete: 46,
                    esc: 27
                };

                scope.iSize = {};
                if (scope.tester) {
                    scope.$watch('model', function (newData) {
                        if (newData) {
                            initColumns();
                        }
                    });
                }
                scope.broadcast = function (key, val) {
                    $rootScope.$broadcast(key, val);
                };

                scope.parseDate = function (value) {
                    return !value || value == '0001-01-01T00:00:00' || value == '1900-01-01T00:00:00' ? 'N/A' :
                        (value.indexOf('T') != -1 ? value : new Date(parseInt(value.replace(/\/Date\((.*?)\)\//gi, "$1"))));
                };

                scope.parseDateTime = function (value) {
                    return !value || value.indexOf('T') != -1 ? value :
                        new Date(value);
                };

                scope.moment = moment;

                scope.editStart = function (propIndex) {

                    var _width = $('td.' + scope.props[propIndex].id + 'Class', element).width() -20;
                    $('#i' +scope.props[propIndex].id, element).css('width', _width);

                    var prop = scope.props[propIndex];
                    var propId = prop.id;
                    if (scope.model[propId + '_isEdit']) {
                        return;
                    }
                    scope['dirty' + propId] = scope.model[propId];
                    //                scope.editFn({ enabled: true, item: scope.model });
                    prop.editable(true, scope.model);
                    scope.model[propId + '_isEdit'] = true;
                    $timeout(function () {
                        element.find('#i' + prop.id).focus();
                    });
                }

                scope.editEnd = function ($e, propIndex) {
                    var prop = scope.props[propIndex];
                    var propId = prop.id;

                    if (scope.$$phase || !scope.model[propId + '_isEdit'] && ($e && $e.target.className.indexOf('grid-button') !== -1)) {
                        //                    $timeout(function () {
                        //                        element.find('input').focus();
                        //                    });
                        return;
                    }
                    scope.model[propId + '_isEdit'] = false;
                    if (angular.isDefined(propIndex)) {

                        if (scope['dirty' + propId] && scope['dirty' + propId].length != scope.model[propId]) {
                            $rootScope.$broadcast('gridview.resize.' + scope.gridId);
                        }
                        scope['dirty' + propId] = undefined;
                        //                    scope.editFn({ enabled: false });
                        prop.editable(false, scope.model);
                    }
                }

                scope.keyDown = function ($e, propIndex) {
                    var propId = scope.props[propIndex].id;

                    if ($e.which === code.enter || $e.which === code.up || $e.which === code.down) {
                        scope.model[propId + '_isEdit'] = false;
                        scope.editEnd($e, propIndex);
                    } else if ($e.which === code.esc) {
                        scope.model[propId] = scope['dirty' + propId];
                        scope.editEnd($e, propIndex);
                    }
                }
                scope.getStyle = function (prop) {
                    return prop.min_width ? 'style="min-width:' + prop.min_width + 'px;"' : "";
                };
                scope.getWidth = function (prop) {
                    return prop.min_width ? 'style="width:' + (prop.min_width - 5) + 'px;"' : "";
                };

                scope.$watch('minSize', function (size) {
                    if (size && Object.keys(size).length) {
                        scope.props.forEach(function (prop) {
                            scope[prop.id] = size[prop.id];
                            //                            scope[prop.id + 'Color'] = prop.color;
                        });
                    }
                });


                var initColumns = function () {
                    var templateCacheKey = 'row_template' + scope.gridId;
                    var htmlTemplate = superCache.get(templateCacheKey);
                    if (!htmlTemplate) {
                        var rowTemplate = [];
                        var sortedProps = $filter('orderBy')(scope.props, 'sequence') || [];
                        superCache.put('sortedProps', sortedProps);
                        sortedProps.forEach(function (prop, index) {
                            if (prop.enabled) {
                                //                                var width = scope.tester ? '' : ' ng-style="{\'width\':' + prop.id + ', \'background-color\': ' + prop.id + 'Color}" ';
                                var width = scope.tester ? '' : ' ng-style="{\'width\':' + prop.id + '}" ';
                                if (angular.isFunction(prop.click)) {
                                    rowTemplate.push('<td class="' + prop.id + 'Class" ' + width + (prop.click ? ' ng-click=\"props[' + index + '].click(model)\"' : '') + '>');
                                } else {
                                    rowTemplate.push('<td class="' + prop.id + 'Class" ' + width + '>');
                                }
                            } else {
                                return;

                            }
                            var prefix = prop.prefix || '';

                            if (prop.editable) {
                                rowTemplate.push('<span class="icon-pencil2 grid-button" ng-mouseup="editStart(' + index + ')"></span>');
                                rowTemplate.push('<span class="row-edit-field-span" ng-show="!model.' + prop.id + '_isEdit" ng-bind="model.' + prop.id + '"></span>');
                                rowTemplate.push('<input id=\"i' + prop.id + '\" class="row-edit-field" ng-model="model.' + prop.id + '" ng-show="model.' + prop.id + '_isEdit" ng-blur="editEnd($event, ' + index + ')" ng-keydown="keyDown($event,' + index + ')"></input>');
                            } else if (!prop.type || prop.type === 'string') {
                                if (typeof prop._getter !== 'undefined') {
                                    rowTemplate.push(prefix + '<span ng-bind="props[' + index + ']._getter(model)"></span>');
                                } else {
                                    rowTemplate.push(prefix + '<span unselectable="on">{{model.' + prop.id + '}}</span>');
                                }
                            } else if (prop.type === 'date') {
                                rowTemplate.push('<span  unselectable="on" ng-bind="parseDate(model.' + prop.id + ') | date: prop.format || \'M/d/yyyy\'"></span>');
                            } else if (prop.type === 'date2') {
                                rowTemplate.push('<span  unselectable="on" ng-bind="parseDate(model.' + prop.id + ') | date: prop.format || \'MM/dd/yyyy\'"></span>');
                            } else if (prop.type === 'timeago') {
                                rowTemplate.push('<span ng-bind="moment(parseDate(model.' + prop.id + ')).fromNow()"></span>');

                            } else if (prop.type === 'datetime') {
                                rowTemplate.push('<span  unselectable="on" ng-bind="parseDateTime(model.' + prop.id + ') | date: prop.format || \'M/d/yyyy h:mma\'"></span>');

                            } else if (prop.type === 'html') {
                                if (typeof prop._getter !== 'undefined') {
                                    rowTemplate.push('<span data-compile data-template="{{props[' + index + ']._getter(model)}}"></span>');
                                } else {
                                    rowTemplate.push(prefix + '<span ng-bind-html="model.' + prop.id + '"></span>');
                                }
                            }
                            rowTemplate.push('</td>');
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
