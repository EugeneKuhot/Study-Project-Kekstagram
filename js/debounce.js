'use strict';
(function () {

  var DEBOUNCE_INTERVAL = 500;

  window.debounce = function debounce(cb) {
    var lastTimout = null;
    return function () {
      var context = null;
      var args = arguments;
      var later = function () {
        cb.apply(context, args);
      };

      clearTimeout(lastTimout);
      lastTimout = setTimeout(later, DEBOUNCE_INTERVAL);
      if (!lastTimout) {
        cb.apply(context, args);
      }
    };
  };

})();
