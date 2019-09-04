function showRandom() {
  const $content = $('#content');
  $content.empty();
  getWebcams((event) => {
    const webcams = JSON.parse(event.currentTarget.response);
    webcams.forEach(webcam => {
      $content.append(createWebcamViewer(webcam, true));
    });
  });
}

function show(id) {
  const $content = $('#content');
  $content.empty();
  getWebcam(id, (event) => {
    const webcam = JSON.parse(event.currentTarget.response);
    $content.append(createWebcamViewer(webcam, true));
  });
}