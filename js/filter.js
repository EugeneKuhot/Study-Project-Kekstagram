'use strict';

(function () {

  var BTN_CLASS = 'img-filters__button';
  var MAX_RANDOM = 10;

  var filterForm = document.querySelector('.img-filters__form');

  var debouncedFilter = function (id) {
    filterPhotos(id);
  };

  filterForm.addEventListener('click', function (evt) {
    var target = evt.target;
    if (target.classList.contains(BTN_CLASS)) {
      var activeBtn = filterForm.querySelector('.' + BTN_CLASS + '--active');
      activeBtn.classList.remove(BTN_CLASS + '--active');
      target.classList.add(BTN_CLASS + '--active');
      debouncedFilter(target.id);
    }
  });

  var filterPhotos = window.debounce(function (filterId) {
    var filteringPhotos = window.gallery.photos().slice();
    switch (filterId) {
      case 'filter-random':
        filteringPhotos = shuffle(filteringPhotos).slice(0, MAX_RANDOM);
        break;
      case 'filter-discussed':
        filteringPhotos = filteringPhotos.sort(function (a, b) {
          return b.comments.length - a.comments.length;
        });
        break;
    }
    window.gallery.renderPictures(filteringPhotos);
  });

  var shuffle = function (array) {
    var j;
    var x;
    var i;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
    }
    return array;
  };

})();
