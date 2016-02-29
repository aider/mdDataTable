(function () {
    'use strict';

    angular
        .module('material.components.table')
        .directive('mtdContextMenu', ['$compile', '$parse', '$timeout', 'Util', function ($compile, $parse, $timeout, Util) {
            return {
                restrict: 'A',
                scope: {
                    menuList: '=',
                    onPopup: '&',
                    onMenuSelected: '&'
                },
                link: function (scope, elem, attrs) {
                    var self = scope;

                    scope.onMenuSelected({menuItem: 'aaa'});

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


                        bodyElem.on('click', function () {
                            scope.contextMenuState.display = 'none';
                            scope.contextMenuState.isVisible = false;

                            scope.$digest();
                        });

                        // elem.bind('touchstart', function(evt) {
                        //     // Locally scoped variable that will keep track of the long press
                        //     scope.longPress = true;
                        //     var self = this;
                        //     var event = evt;
                        //     // We'll set a timeout for 600 ms for a long press
                        //     $timeout(function() {
                        //         if (scope.longPress) {
                        //             // If the touchend event hasn't fired,
                        //             // apply the function given in on the element's on-long-press attribute
                        //             // $scope.$apply(function() {
                        //             //     $scope.$eval($attrs.onLongPress)
                        //             // });
                        //
                        //             var left, top, offset;
                        //
                        //             if (scope.onPopup()) {
                        //                 left = event.originalEvent.pageX;
                        //                 top = event.originalEvent.pageY;
                        //                 offset = Util.offset(self);
                        //
                        //                 if (left + menuListElem[0].clientWidth > offset.left + self.clientWidth) {
                        //                     left -= (left + menuListElem[0].clientWidth) - (offset.left + self.clientWidth);
                        //                 }
                        //                 if (top + menuListElem[0].clientHeight > offset.top + self.clientHeight) {
                        //                     top -= (top + menuListElem[0].clientHeight) - (offset.top + self.clientHeight);
                        //                 }
                        //
                        //                 scope.contextMenuState.left = (left+20) + 'px';
                        //                 scope.contextMenuState.top = top + 'px';
                        //                 scope.contextMenuState.visibility = 'visible';
                        //                 scope.contextMenuState.display = 'block';
                        //                 scope.contextMenuState.isVisible = true;
                        //             }
                        //
                        //             scope.$digest();
                        //             event.preventDefault();
                        //
                        //         }
                        //     }, 600);
                        // });
                        elem.bind('touchend', function (event) {
                            var left, top, offset;

                            if (scope.onPopup()) {
                                left = event.originalEvent.pageX;
                                top = event.originalEvent.pageY;
                                offset = Util.offset(self);

                                if (left + menuListElem[0].clientWidth > offset.left + self.clientWidth) {
                                    left -= (left + menuListElem[0].clientWidth) - (offset.left + self.clientWidth);
                                }
                                if (top + menuListElem[0].clientHeight > offset.top + self.clientHeight) {
                                    top -= (top + menuListElem[0].clientHeight) - (offset.top + self.clientHeight);
                                }

                                scope.contextMenuState.left = (left + 20) + 'px';
                                scope.contextMenuState.top = top + 'px';
                                scope.contextMenuState.visibility = 'visible';
                                scope.contextMenuState.display = 'block';
                                scope.contextMenuState.isVisible = true;
                            }

                            scope.$digest();
                            event.preventDefault();
                        });

                        elem.on('contextmenu', function (event) {
                            var left, top, offset;

                            if (scope.onPopup()) {
                                left = event.clientX;
                                top = event.clientY;
                                offset = Util.offset(this);

                                if (left + menuListElem[0].clientWidth > offset.left + this.clientWidth) {
                                    left -= (left + menuListElem[0].clientWidth) - (offset.left + this.clientWidth);
                                }
                                if (top + menuListElem[0].clientHeight > offset.top + this.clientHeight) {
                                    top -= (top + menuListElem[0].clientHeight) - (offset.top + this.clientHeight);
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
        }]);

})();
