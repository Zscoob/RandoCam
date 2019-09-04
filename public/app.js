
function createWebcamViewer(webcam, showButtons = false) {
  const $viewer = $(`<section class='video-player'>
  <h3>${webcam.title}</h3>
  <iframe src="http://stream.webcams.travel/${webcam.id}" sandbox="allow-same-origin allow-scripts allow-forms" allowfullscreen width=800px height=600px></iframe>
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
</form>`);
    $viewer.append($form);
    setupEvents($viewer);
  }
  return $viewer;
}

function setupEvents($viewer) {
  const $iframe = $viewer.children('iframe');
  const $title = $viewer.children('h3');
  const $hiddenInput = $viewer.children('input.hidden');
  const $like = $viewer.children('button.like');
  const $refresh = $viewer.children('button.refresh');
  const $commentForm = $viewer.children('.comment-form');

  $refresh.click(() => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (event) => {
      const webcam = JSON.parse(event.target.response)[0];
      $iframe.attr('src', `http://stream.webcams.travel/${webcam.id}`);
      $title.text(webcam.title);
      $hiddenInput.val(webcam.id);
      $like.prop('disabled', false);
      $commentForm.children('input[placeholder]').val('');
    });
    xhr.open('GET', '/webcam/random');
    xhr.send();
  })
  
  $like.click(() => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      console.log('Submitted Like');
    });
    xhr.open('POST', '/like');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(`id=${$hiddenInput.val()}`);
    $like.prop('disabled', true);
  });

  $commentForm.submit((event) => {
    event.preventDefault();
    console.log('Yas');
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      console.log('Saved comment');
      $commentForm.children('input[placeholder]').val('');
    });
    xhr.open('POST', `/comment/${$hiddenInput.val()}`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(`comment=${$commentForm.children('input[name=comment]').val()}&handle=${$commentForm.children('input[name=handle]').val()}`);
  });
}

function getWebcam(id, callback) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', callback);
  xhr.open('GET', `/webcam/${id}`);
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