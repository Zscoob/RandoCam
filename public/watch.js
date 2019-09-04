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
