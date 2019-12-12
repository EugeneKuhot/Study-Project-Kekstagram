'use strict';

(function () {

  var MAX_WIDTH = 455;

  var Resize = {
    MIN: 25,
    MAX: 100
  };


  var main = document.querySelector('main');
  var imgUploadForm = main.querySelector('.img-upload__form');
  var imgEditOverlay = imgUploadForm.querySelector('.img-upload__overlay');
  var uploadButton = imgUploadForm.querySelector('#upload-file');
  var closeEditButton = imgUploadForm.querySelector('#upload-cancel');
  var hashtagInput = imgUploadForm.querySelector('.text__hashtags');
  var commentField = imgUploadForm.querySelector('.text__description');

  var onEscButtonCloseEdit = function (evt) {
    if (evt.keyCode === window.util.ESC_KEY && evt.target !== hashtagInput && evt.target !== commentField) {
      closeEdit();
    }
  };

  var closeEdit = function () {
    setOriginFilter();
    imgEditOverlay.classList.add('hidden');
    closeEditButton.removeEventListener('click', closeEdit);
    document.removeEventListener('keydown', onEscButtonCloseEdit);
    imgUploadForm.reset();
    removeFilter();
  };


  var openEdit = function () {
    imgEditOverlay.classList.remove('hidden');
    closeEditButton.addEventListener('click', closeEdit);
    document.addEventListener('keydown', onEscButtonCloseEdit);
  };

  uploadButton.addEventListener('change', openEdit);

  var resizeImage = function (value) {
    imageUploadPreview.style.transform = 'scale(' + value / 100 + ')';
  };


  var changeValue = function (isGrow) {
    var currentValue = parseInt(scaleControlValue.value, 10);
    if (!isGrow && currentValue > Resize.MIN) {
      currentValue -= Resize.MIN;
    } else if (isGrow && currentValue < Resize.MAX) {
      currentValue += Resize.MIN;
    }
    resizeImage(currentValue);
    currentValue = currentValue;
    scaleControlValue.value = currentValue + '%';
  };

  var imageForm = document.querySelector('#upload-select-image');
  var checkEffectsNone = document.querySelector('.effect-level');
  var imageUploadScale = imageForm.querySelector('.img-upload__scale');
  var imageUploadPreview = imageForm.querySelector('.img-upload__preview');
  var scaleControlValue = imageUploadScale.querySelector('.scale__control--value');
  var buttonSmall = imageUploadScale.querySelector('.scale__control--smaller');
  var buttonlBig = imageUploadScale.querySelector('.scale__control--bigger');
  var effectLevelPin = checkEffectsNone.querySelector('.effect-level__pin');
  var effectLevelDepth = checkEffectsNone.querySelector('.effect-level__depth');


  buttonSmall.addEventListener('click', function () {
    changeValue(false);
  });

  buttonlBig.addEventListener('click', function () {
    changeValue(true);
  });


  var filters = {
    'chrome': function (value) {
      return 'grayscale(' + (value / 100) + ')';
    },
    'sepia': function (value) {
      return 'sepia(' + (value / 100) + ')';
    },
    'marvin': function (value) {
      return 'invert(' + value + '%)';
    },
    'phobos': function (value) {
      return 'blur(' + Math.floor(value * 3 / 100) + 'px)';
    },
    'heat': function (value) {
      return 'brightness(' + (value * 2 / 100 + 1) + ')';
    },
    'none': function () {
      return '';
    }
  };

  var imageUploadEffects = imageForm.querySelector('.img-upload__effects');
  var effectsItems = imageUploadEffects.querySelectorAll('.effects__radio');


  var changePinPosition = function (pinPosition) {

    var sliderWidth = pin.parentElement.offsetWidth;

    if (pinPosition > sliderWidth) {
      pinPosition = sliderWidth;
    } else if (pinPosition < 0) {
      pinPosition = 0;
    }

    pin.style.left = pinPosition + 'px';
    var effectLevel = Math.round(pin.offsetLeft * 100 / sliderWidth);
    document.querySelector('.effect-level__value').value = effectLevel;
    document.querySelector('.effect-level__depth').style.width = effectLevel + '%';
  };

  var pinPosition = null;
  var pin = document.querySelector('.effect-level__pin');
  pin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startX = evt.clientX;
    var dragged = false;


    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = startX - moveEvt.clientX;
      pinPosition = (pin.offsetLeft - shiftX);

      changePinPosition(pinPosition);

      startX = moveEvt.clientX;
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      picture.style.filter = filters[currentFilter](pinPosition * 100 / MAX_WIDTH);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function () {
          evt.preventDefault();
          document.removeEventListener('click', onClickPreventDefault);
        };
        document.addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });


  var addThumbnailClickHandler = function (thumbnail) {
    thumbnail.addEventListener('change', function (evt) {
      var filterName = evt.target.value;

      picture.classList.remove('effects__preview--' + currentFilter);
      currentFilter = filterName;
      checkEffectsNone.classList.add('hidden');
      var checkEffectsScroll = function () {
        if (currentFilter === 'none') {
          checkEffectsNone.classList.add('hidden');
        } else {
          checkEffectsNone.classList.remove('hidden');
        }
      };
      checkEffectsScroll();

      picture.classList.add('effects__preview--' + currentFilter);
      setOriginFilter();
      var effectValue = parseInt(imageForm.querySelector('.effect-level__value').value, 10);
      picture.style.filter = filters[currentFilter](effectValue);
    });
  };

  for (var i = 0; i < effectsItems.length; i++) {
    addThumbnailClickHandler(effectsItems[i]);
  }

  window.validation.element.addEventListener('input', function () {
    var errorCode = window.validation.check();

    if (errorCode !== '') {
      window.validation.element.setCustomValidity(errorCode);
    } else {
      window.validation.element.setCustomValidity('');
    }
  });

  var picture = imageUploadPreview.querySelector('img');
  var currentFilter = 'none';
  var successTemplate = document.querySelector('#success').content.querySelector('.success');

  function removeFilter() {
    picture.classList = '';
    picture.style = '';
    changeValue(100);
    checkEffectsNone.classList.add('hidden');
  }

  var setOriginFilter = function () {
    effectLevelDepth.style.width = '100%';
    effectLevelPin.style.left = '100%';
  };

  var commentBase = function () {
    hashtagInput.setCustomValidity('');
    hashtagInput.value = '';
    commentField.setCustomValidity('');
    commentField.style = '';
  };

  var cleanSuccess = function () {
    var successMessagePopup = document.querySelector('.success');
    if (successMessagePopup) {
      main.removeChild(successMessagePopup);
    }
  };


  var onSuccess = function () {
    closeEdit();
    commentBase();

    var fragment = document.createDocumentFragment(section);
    var section = successTemplate.cloneNode(true);
    var successButton = section.querySelector('.success__button');

    fragment.appendChild(section);
    main.appendChild(fragment);

    successButton.addEventListener('click', cleanSuccess);
    main.addEventListener('click', cleanSuccess);
    document.addEventListener('keydown', onSuccessMessageEscPress);
  };

  var onSuccessMessageEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEY) {
      document.removeEventListener('keydown', onSuccessMessageEscPress);
      cleanSuccess();
    }
  };

  var cleanError = function () {
    var errorMessagePopup = document.querySelector('.error');
    if (errorMessagePopup) {
      main.removeChild(errorMessagePopup);
    }
  };


  var onError = function () {
    closeEdit();
    commentBase();

    var fragment = document.createDocumentFragment(section);
    var section = successTemplate.cloneNode(true);
    var errorButton = main.querySelector('.error_close');

    fragment.appendChild(section);
    main.appendChild(fragment);

    errorButton.addEventListener('click', cleanError);
    main.addEventListener('click', cleanError);
    document.addEventListener('keydown', errorMessageEscPress);
  };


  var errorMessageEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEY) {
      document.removeEventListener('keydown', errorMessageEscPress);
      cleanError();
    }
  };

  imgUploadForm.addEventListener('submit', function (evt) {
    if (imgUploadForm.checkValidity()) {
      evt.preventDefault();
      hashtagInput.value = '';
      window.backend.upload(new FormData(imgUploadForm), onSuccess, onError);
    }
  });


})();
