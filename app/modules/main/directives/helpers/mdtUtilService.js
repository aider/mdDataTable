(function () {
    angular
        .module('material.components.table')
        .factory('Util', UtilService);
    angular
        .module('material.components.table')
        .factory('superCache', superCache);

    function UtilService() {
        return {
            startsWith: function (src, prefix) {
                return src.length >= prefix.length && src.substring(0, prefix.length) === prefix;
            },
            offset: function (node) {
                var parentNode = node,
                    top = 0,
                    left = 0;

                while (typeof parentNode.offsetTop !== 'undefined') {
                    var _parentNode = parentNode.parentNode;

                    if (_parentNode && _parentNode.tagName && _parentNode.tagName.toLowerCase() == "section") {
                        break;
                    }
                    top += parentNode.offsetTop;
                    left += parentNode.offsetLeft;
                    parentNode = parentNode.parentNode;


                }

                return {
                    top: top,
                    left: left
                };
            }
        };
    }

    function superCache() {
        var cache = {};
        return {
            put: function (key, value) {
                cache[key] = value;
            },
            get: function (key) {
                return cache[key];
            }
        };
    }
})();
