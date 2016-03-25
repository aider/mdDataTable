(function () {
    'use strict';

    function onLongPress() {
        return {
            restrict: 'A',
            link: function ($scope, $elm, $attrs) {
                $elm.bind('touchstart', function (evt) {
                    // Locally scoped variable that will keep track of the long press
                    $scope.$apply(function () {
                        $scope.$eval($attrs.onLongPress)
                    });
                });

                // $elm.bind('touchend', function (evt) {
                //     // Prevent the onLongPress event from firing
                //     console.log('touchend');
                //     $scope.longPress = false;
                //     // If there is an on-touch-end function attached to this element, apply it
                //     if ($attrs.onTouchEnd) {
                //         $scope.$apply(function () {
                //             $scope.$eval($attrs.onTouchEnd)
                //         });
                //     }
                // });
            }
        };
    }

    angular
        .module('material.components.table')
        .directive('onLongPress', onLongPress);
}());