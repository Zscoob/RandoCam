function showRandom() {
  const $content = $('#content');
  $content.empty();
  console.log('Here');
  getWebcams((event) => {
    const webcams = JSON.parse(event.currentTarget.response);
    webcams.forEach(webcam => {
      $content.append(createWebcamViewer(webcam, true));
    });
  });
}

function show(id) {
    console.log('Here');
  const $content = $('#content');
  $content.empty();
  getWebcam(id, (event) => {
    const webcam = JSON.parse(event.currentTarget.response);
    $content.append(createWebcamViewer(webcam, true));
  });
}