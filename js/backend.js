'use strict';

(function () {
  var SERVER_URL = 'https://js.dump.academy/kekstagram';
  var STATUS_OK = 200;
  var MAX_TIME = 10000;
  var setup = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ошибки: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = MAX_TIME;
    return xhr;
  };

  var load = function (onSuccess, onError) {
    var xhr = setup(onSuccess, onError);
    xhr.open('GET', SERVER_URL + '/data');
    xhr.send();
    return xhr;
  };

  var upload = function (data, onSuccess, onError) {
    var xhr = setup(onSuccess, onError);
    xhr.open('POST', SERVER_URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    upload: upload,
  };
})();
