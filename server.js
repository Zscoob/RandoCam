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
  //"http://stream.webcams.travel/1562697756" -- BEARSSSS
  //http://stream.webcams.travel/1430559514 -- Russian pool?

  const savecams = (webcams) => {
    const query = 'INSERT INTO webcams (id, title) VALUES($1, $2) ON CONFLICT DO NOTHING;';
    webcams.forEach((webcam) => {
      client.query(query, [webcam.id, webcam.title])
    });
  };

  const getComments = async (videoId) => {
    const query = 'SELECT * FROM comments WHERE video_id = $1 ORDER BY timeStamp DESC LIMIT 20;'
    const response = await client.query(query, [videoId])
    return response.rows;
  }

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
    savecams(webcams);
    return webcams;
  };

  async function getWebcamsFromDB(count = 3) {
    const query = 'SELECT * FROM webcams ORDER BY likes DESC LIMIT $1;';
    const results = await client.query(query, [count]);
    return results.rows;
  }

  async function getWebcamFromDB(id) {
    const query = 'SELECT * FROM webcams WHERE id = $1;';
    const results = await client.query(query, [id]);
    return results.rows;
  }

  async function attachComments(webcam){
    await getComments(webcam.id).then(comments => webcam.comments = comments);
    return webcam;
  }

  async function attachCommentsToMultiple(webcams){
    return await Promise.all(webcams.map(webcam => attachComments(webcam)));
  }

  app.get('/', (request, response) => {
    try {
      response.render('index');
    } catch (error) {
      handleError(response, error);
    }
  });

  app.get('/watch', (request, response) => {
    try {
      response.render('watch', {videoId: request.query.id || 0});
    } catch (error) {
      handleError(response, error);
    }
  });

  app.get('/webcam/:id', (request, response) => {
    try {
      if (request.params.id === 'random'){
        console.log('Fetching random');
        getWebcams(request.query.count || 1).then((webcams) => {
           attachCommentsToMultiple(webcams).then(results => {
            response.send(results);
          });
        });
      } else if (request.params.id === 'top') {
        console.log('Fetching top');
        getWebcamsFromDB(3).then(webcams => attachCommentsToMultiple(webcams).then(webcams => response.send(webcams)));
      } else {
        console.log('Fetching from DB');
        getWebcamFromDB(request.params.id).then(([webcam]) => attachComments(webcam).then(webcam => response.send(webcam)));
      }
    } catch (error) {
      handleError(response, error);
    }
  });

  app.post('/like', (request, response) => {
    try {
      client.query('UPDATE webcams SET likes = likes + 1 WHERE id = $1;', [request.body.id]);
      response.status(201).send();
    } catch (error) {
      handleError(response, error);
    }
  });

  app.post('/comment/:videoId', (request, response) => {
    try {
      const query = 'INSERT INTO comments (video_id, text, handle, timeStamp) VALUES($1, $2, $3, $4);';
      client.query(query, [request.params.videoId, request.body.comment, request.body.handle, Date.now()]);
      response.status(201).send();
    } catch (error) {
      handleError(response, error);
    }
  })

  app.get('/comment/:videoId', (request, response) => {
    try {
      getComments(request.params.videoId).then((comments) => {
        response.send(comments);
      });
    } catch (error) {
      handleError(response, error);
    }
  });

  app.post('*', (req, res) => handleError(res, 'Path not found...', 404));

  app.get('*', (req, res) => handleError(res, 'Path not found...', 404));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Listening for requests with andre: ${PORT}`);
  });
})();
