$('button.refresh').click((event) => {
  const $iframe = $(event.target).siblings('iframe');
  const $title = $(event.target).siblings('h3');
  var request = new XMLHttpRequest();
  request.addEventListener('load', (loadEvent) => {
    const webcam = JSON.parse(loadEvent.target.response);
    const $form = $(event.target).siblings('form.hidden');
    $form.attr('id', webcam.id);
    $form.children('input').attr('value', webcam.id);
    $form.siblings('input.like').attr('form', webcam.id);
    $title.text(webcam.title);
    $('title').text(webcam.title);
    $iframe.attr('src', `http://stream.webcams.travel/${webcam.id}`);
    $('.like').prop('disabled',false);
  });
  request.open('GET', '/webcam/random');
  request.send();
});

$('.like').on('click', (event) => {
  $('.like').siblings('form').submit();
  $('.like').prop('disabled',true);
});

