'use strict';

(function () {

  var COMMENTS_MAX = 5;
  var bigPicture = document.querySelector('.big-picture');
  var renderCommentCout = document.querySelector('.social__comment-count');
  var socialComments = bigPicture.querySelector('.social__comments');
  var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');
  var commentLoad = bigPicture.querySelector('.comments-loader');
  var indexComment = null;


  var renderComment = function (template, comment) {
    var element = template.cloneNode(true);
    var commentImg = element.querySelector('img');
    commentImg.src = comment.avatar;
    commentImg.alt = comment.name;
    var socialText = element.querySelector('.social__text');
    socialText.textContent = comment.message;
    return element;
  };

  var renderComments = function (data) {
    var template = socialComments.querySelector('.social__comment');

    socialComments.innerHTML = '';

    var commentList = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      commentList.appendChild(renderComment(template, data[i]));
    }

    socialComments.appendChild(commentList);
    return data.length;
  };

  var printCommentCount = function (element, count, total) {
    element.textContent = count + ' ' + 'из' + ' ' + total + ' ' + 'коментариев';
  };

  var createBigPicture = function (photoInfo) {
    indexComment = 0;

    var bigPictureElement = bigPicture.querySelector('.big-picture__img img');
    bigPictureElement.src = photoInfo.url;

    var bigPictureLikesElement = bigPicture.querySelector('.likes-count');
    bigPictureLikesElement.textContent = photoInfo.likes;

    var bigPictureDescription = bigPicture.querySelector('.social__caption');
    bigPictureDescription.textContent = photoInfo.description;

    var avatar = bigPicture.querySelector('.social__picture');

    avatar.src = photoInfo.comments[0].avatar;
    avatar.alt = photoInfo.comments[0].name;
    var socialText = bigPicture.querySelector('.social__text');
    socialText.textContent = photoInfo.comments[0].message;

    renderCommentCout.innerHTML = '';

    indexComment = renderComments(photoInfo.comments.slice(0, COMMENTS_MAX));

    printCommentCount(renderCommentCout, indexComment, photoInfo.comments.length);


    var closeBigPicture = function () {
      bigPicture.classList.add('hidden');

      bigPictureClose.removeEventListener('click', onBigPictureCloseClick);
      document.removeEventListener('keydown', onBigPictureEscPress);
      commentLoad.removeEventListener('click', onCommentsLoaderClick);
    };

    var onBigPictureCloseClick = function () {
      closeBigPicture();
    };

    var onBigPictureEscPress = function (evt) {
      if (evt.keyCode === window.util.ESC_KEY) {
        closeBigPicture();
      }
    };

    var onCommentsLoaderClick = function () {
      var array = photoInfo.comments.slice(0, indexComment + COMMENTS_MAX);
      indexComment = renderComments(array);

      if (photoInfo.comments.length <= array.length) {
        commentLoad.classList.add('hidden');
      }

      printCommentCount(renderCommentCout, array.length, photoInfo.comments.length);
    };

    commentLoad.addEventListener('click', onCommentsLoaderClick);

    if (photoInfo.comments.length > COMMENTS_MAX) {
      commentLoad.classList.remove('hidden');
    } else {
      commentLoad.classList.add('hidden');
    }

    bigPictureClose.addEventListener('click', onBigPictureCloseClick);

    document.addEventListener('keydown', onBigPictureEscPress);
  };

  window.preview = {
    element: bigPicture,
    show: createBigPicture
  };
})();
