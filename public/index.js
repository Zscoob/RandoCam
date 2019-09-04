getTopWebcams((event) => {
  const webcams = JSON.parse(event.currentTarget.response);
  const $webcams = $('#webcams');
  webcams.forEach(webcam => {
    console.log(webcam);
    $webcams.append(createWebcamViewer(webcam));
  });
});