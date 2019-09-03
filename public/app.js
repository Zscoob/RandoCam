$('button.refresh').click((event) => {
  const $iframe = $(event.target).siblings('iframe');
  const $title = $(event.target).siblings('h3');
  var request = new XMLHttpRequest();
  request.addEventListener('load', (event) => {
    const webcam = JSON.parse(event.target.response);
    $title.text(webcam.title);
    $('title').text(webcam.title);
    $iframe.attr('src', `http://stream.webcams.travel/${webcam.id}`);
  });
  request.open('GET', '/webcam/random');
  request.send();
});


