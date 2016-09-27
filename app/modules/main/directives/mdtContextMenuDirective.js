(function () {
    'use strict';

    var mdtContextMenuFn = function ($compile, $parse, $timeout, Util) {
        return {
            restrict: 'A',
            scope: {
                menuList: '=',
                onPopup: '&',
                onMenuSelected: '&'
            },
            link: function (scope, elem, attrs) {
                var self = scope;

                scope.onDropdownMenuSelected = function (menuItem, menu) {
                    scope.onMenuSelected({menuItem: menuItem});
                };

                scope.$on('$destroy', function () {
                    self._menuListElem.remove();
                });

                scope.contextMenuState = {
                    left: 0,
                    top: 0,
                    visibility: 'hidden'
                };

                var init = function (elem) {
                    var menuListElem = angular.element('<mtd-dropdown></mtd-dropdown>'),
                        bodyElem = angular.element(document.body);

                    menuListElem.attr({
                        'class': 'context-menu',
                        'menu-list': 'menuList',
                        'on-menu-selected': 'onDropdownMenuSelected(menuItem)',
                        'ng-style': 'contextMenuState'
                    });
                    $compile(menuListElem)(scope);
                    bodyElem.append(menuListElem);


                    bodyElem.on('click', function (event) {
                        scope.contextMenuState.display = 'none';
                        scope.contextMenuState.isVisible = false;

                        scope.$digest();
                    });

                    var isIOs = /iPhone|iPod|iPad/i.test(navigator.userAgent);

                    if (isIOs) {
                        elem.bind('touchstart', function (evt) {
                            scope.touchend = false;
                            scope.longPress = false;
                            var self = this;
                            var event = evt;
                            $timeout(function () {
                                if (!scope.touchend) {
                                    scope.longPress = true;
                                }
                            }, 600);
                        });
                        elem.bind('touchend', function (event) {
                            scope.touchend = true;
                            if (scope.longPress) {
                                scope.menuVisible = true;
                                var left, top, offset;
                                if (scope.onPopup()) {
                                    left = event.originalEvent.pageX;
                                    top = event.originalEvent.pageY;
                                    offset = Util.offset(this);

                                    if (left + menuListElem.width() > offset.left + this.clientWidth) {
                                        left -= (left + menuListElem.width()) - (offset.left + this.clientWidth);
                                    }
                                    if (top + menuListElem.height() > offset.top + this.clientHeight) {
                                        top -= menuListElem.height();
                                        // top -= (top + menuListElem[0].clientHeight) - (offset.top + this.clientHeight);
                                    }

                                    scope.contextMenuState.left = (left) + 'px';
                                    scope.contextMenuState.top = top + 'px';
                                    scope.contextMenuState.visibility = 'visible';
                                    scope.contextMenuState.display = 'block';
                                    scope.contextMenuState.isVisible = true;
                                }
                                scope.longPress = false;
                                scope.$digest();
                                event.preventDefault();

                            }
                        });
                    }

                    elem.on('contextmenu', function (event) {
                        var left, top, offset;

                        if (scope.onPopup()) {
                            left = event.clientX;
                            top = event.clientY;
                            offset = Util.offset(this);
                            if (left + menuListElem.width() > offset.left + this.clientWidth) {
                                left -= (left + menuListElem.width()) - (offset.left + this.clientWidth);
                            }
                            if (top + menuListElem.height() > offset.top + this.clientHeight) {
                                top -= menuListElem.height();
                                // top -= (top + menuListElem[0].clientHeight) - (offset.top + this.clientHeight);
                                // top = top - menuListElem[0].clientHeight + $('md-list-item', this).height()  ;
                            }

                            scope.contextMenuState.left = left + 'px';
                            scope.contextMenuState.top = top + 'px';
                            scope.contextMenuState.visibility = 'visible';
                            scope.contextMenuState.display = 'block';
                            scope.contextMenuState.isVisible = true;
                        }

                        scope.$digest();
                        event.preventDefault();
                    });

                    self._elem = elem;
                    self._menuListElem = menuListElem;
                };

                init(elem);
            }

        };
    };
    angular
        .module('material.components.table')
        .directive('mtdContextMenu', ['$compile', '$parse', '$timeout', 'Util', mdtContextMenuFn]);

})();
