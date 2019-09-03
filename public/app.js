$('button.refresh').click((event) => {
  const $iframe = $(event.target).siblings('iframe');
  const $title = $(event.target).siblings('h3');
  var request = new XMLHttpRequest();
  request.addEventListener('load', (loadEvent) => {
    const webcam = JSON.parse(loadEvent.target.response);
    const $form = $(event.target).siblings('form');
    $form.attr('id', webcam.id);
    $form.children('input').attr('value', webcam.id);
    $form.siblings('input[type=submit]').attr('form', webcam.id);
    $title.text(webcam.title);
    $('title').text(webcam.title);
    $iframe.attr('src', `http://stream.webcams.travel/${webcam.id}`);
  });
  request.open('GET', '/webcam/random');
  request.send();
});


