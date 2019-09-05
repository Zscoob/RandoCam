
function createWebcamViewer(webcam, showButtons = false) {
  const $viewer = $(`<section class='video-player'>
  <h3>${webcam.title}</h3>
  <iframe src="http://stream.webcams.travel/${webcam.id}" sandbox="allow-same-origin allow-scripts allow-forms" allowfullscreen width=800px height=600px></iframe><br>
  <p class='like-counter'></p>
</section>`);
  if (showButtons) {
    const $form = $(`<br>
    <input type='number' class='hidden' value=${webcam.id}>
<button class='like'>Like</button>
<button class='refresh'>Next</button>
<br>
<form class='comment-form'>
  <input type='text' name='comment' placeholder='Leave a comment...'>
  <input type='text' name='handle' placeholder='Name...'>
  <input type='submit' name='submit' value='Submit'>
</form>
<br>
<ol class='commentSection'>
</ol>`);
    console.log(webcam.comments);
    const $commentSection = $form.siblings('.commentSection');
    webcam.comments.forEach(comment => {
      $commentSection.append(createCommentTag(comment));
    });
    $viewer.append($form);
    setupEvents($viewer);
  } else {
    const $viewbutton = $('<button class=\'view-button\'>View</button>');
    $viewbutton.click(() => {
      window.location = `/watch?id=${webcam.id}`;
    });
    $viewer.append($viewbutton);
  }
  const likes = webcam.likes || 0;
  $viewer.children('.like-counter').text(`${likes} likes`);
  console.log($('.commentSection').children());
  return $viewer;
}

function createCommentTag(comment) {
  return $(`
  <article class='comment'>
    <p class='comment'>${comment.text}</p>
    <br>
    <p class='handle'>${comment.handle}</p>
  </article>`);
}

function setupEvents($viewer) {
  const $iframe = $viewer.children('iframe');
  const $title = $viewer.children('h3');
  const $hiddenInput = $viewer.children('input.hidden');
  const $like = $viewer.children('button.like');
  const $refresh = $viewer.children('button.refresh');
  const $commentForm = $viewer.children('.comment-form');
  const $commentSection = $viewer.children('.commentSection');
  const $likeCounter = $viewer.children('.like-counter');

  $refresh.click(() => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (event) => {
      const webcam = JSON.parse(event.target.response)[0];
      $iframe.attr('src', `http://stream.webcams.travel/${webcam.id}`);
      $title.text(webcam.title);
      $hiddenInput.val(webcam.id);
      $like.prop('disabled', false);
      $commentForm.children('input[placeholder]').val('');
      $commentSection.empty();
      webcam.comments.forEach(comment => {
        $commentSection.append(createCommentTag(comment));
      });
      $likeCounter.text(`${webcam.likes || 0} likes`);
    });
    xhr.open('GET', '/webcam/random');
    xhr.send();
  });
  
  $like.click(() => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      $likeCounter.text(`${parseInt($likeCounter.text()) + 1} likes`);
    });
    xhr.open('POST', '/like');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(`id=${$hiddenInput.val()}`);
    $like.prop('disabled', true);
  });

  $commentForm.submit((event) => {
    event.preventDefault();
    const comment = $commentForm.children('input[name=comment]').val();
    const handle = $commentForm.children('input[name=handle]').val();
    if(!comment || !handle){
      alert('Comment form empty');
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      $commentSection.prepend(createCommentTag({text: comment, handle: handle}));
      $commentForm.children('input[placeholder]').val('');
    });
    xhr.open('POST', `/comment/${$hiddenInput.val()}`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(`comment=${comment}&handle=${handle}`);
  });
}

function getWebcam(id, callback) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', callback);
  xhr.open('GET', `/webcam/${Number(id) || 'random'}`);
  xhr.send();
}

function getWebcams(callback, count = 1) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', callback);
  xhr.open('GET', `/webcam/random?count=${count}`);
  xhr.send();
}

function getTopWebcams(callback) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', callback);
  xhr.open('GET', '/webcam/top');
  xhr.send();
}