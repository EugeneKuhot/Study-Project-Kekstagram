'use strict';

(function () {

  var inputHashtags = document.querySelector('.text__hashtags');
  var checkHashTags = function () {
    var MAX_SYMVOLS = 20;
    var MAX_HASHTAG = 5;

    var invalidMessage = [];

    var inputText = inputHashtags.value.toLowerCase().trim();

    if (!inputText) {
      return false;
    }

    var parts = inputText.split(/\s+/).filter(function (item) {
      return item !== '';
    });

    var isStartNoHashtag = parts.some(function (item) {
      return item[0] !== '#';
    });

    if (isStartNoHashtag) {
      invalidMessage.push('хэш-тег начинается с символа # (решётка)');
    }

    var isOnlyLatticeHashtag = parts.some(function (item) {
      return item === '#';
    });

    if (isOnlyLatticeHashtag) {
      invalidMessage.push('хеш-тег не может состоять только из одной решётки');
    }

    var isSplitSpaceHashtag = parts.some(function (item) {
      return item.indexOf('#', 1) >= 1;
    });

    if (isSplitSpaceHashtag) {
      invalidMessage.push('хэш-теги разделяются пробелами');
    }

    var isRepeatHashtag = parts.some(function (item, index) {
      return parts.indexOf(item, index + 1) >= index + 1;
    });

    if (isRepeatHashtag) {
      invalidMessage.push('один и тот же хэш-тег не может быть использован дважды');
    }

    var isLongHashtag = parts.some(function (item) {
      return item.length > MAX_SYMVOLS;
    });

    if (isLongHashtag) {
      invalidMessage.push('максимальная длина одного хэш-тега 20 символов, включая решётку');
    }

    if (parts.length > MAX_HASHTAG) {
      invalidMessage.push('нельзя указать больше пяти хэш-тегов');
    }

    return invalidMessage.join('. \n');
  };

  window.validation = {
    element: inputHashtags,
    check: checkHashTags
  };
})();
