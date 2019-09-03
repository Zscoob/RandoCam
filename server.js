(() => {
  'use strict';
  require('dotenv').config();
  const express = require('express');
  const app = express();
  const cors = require('cors');
  app.use(cors());
  const pg = require('pg');
  const client = new pg.Client(process.env.DATABASE_URL);
  client.connect();

  const superagent = require('superagent');

  app.set('view engine', 'ejs');
  app.use(express.static('./public'));
  app.use(express.urlencoded({ extended: true }));

  function handleError(res, error, status = 500) {
    res.render('error', { status: status, error: error.message ? error.message : error });
  }

  function getErrorHandler(res, status = 500) {
    return (error) => handleError(res, error, status);
  }
//http://stream.webcams.travel/1449975078 -- Roundabout
//http://stream.webcams.travel/1454271431 -- Russia
  const getWebcams = async (count = 3) => {
    const webcams = [];
    while (webcams.length < count) {
      const val = await superagent
      .get('https://webcamstravel.p.rapidapi.com/webcams/list/property=live,hd/orderby=random/limit=1')
      .query({
        'lang': 'en',
        'show': 'webcams:image,player'
      })
      .set({
        'x-rapidapi-host': 'webcamstravel.p.rapidapi.com',
        'x-rapidapi-key': process.env.API_KEY
      });
      //Ried im Traunkreis: A09, bei Anschlussstelle Ried i. Traunkreis, Blickrichtung Knoten Voralpenkreuz − Km 5,40
      const filteredCams = val.body.result.webcams.filter((webcam) => !webcam.title.match(/[\d\w\s\.]+: \w\d+,[\w\d\s\.\,]+.*− Km \d+,\d+/));
      webcams.push(...filteredCams);
    }
    return webcams;
  };

  app.get('/', (request, response) => {
    getWebcams().then((webcams) => response.render('index', {webcams: webcams}));
  });

  app.get('/random', (request, response) => {
    getWebcams(1).then((webcams) => response.render('random', {webcams: webcams}))
  })

  app.get('/webcam/random', (request, response) => {
    getWebcams(1).then(([webcam]) => response.send(webcam));
  })

  app.post('*', (req, res) => handleError(res, 'Path not found...', 404));

  app.get('*', (req, res) => handleError(res, 'Path not found...', 404));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Listening for requests on port: ${PORT}`);
  });
})();
