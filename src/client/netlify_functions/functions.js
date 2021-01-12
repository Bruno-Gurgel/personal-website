const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const serverless = require('serverless-http');

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(
  urlencoded({
    extended: true,
  })
);

// Initialize the main project folder
app.use(express.static('dist'));

console.log(__dirname);

app.get('/', (req, res) =>
  res.sendFile(path.resolve('src/client/views/index.html'))
);

// Empty JS object to act as endpoint for all routes
let allData = {};

// Spin up the server
/* const port = 8000;
app.listen(process.env.PORT || port, () => {
  console.log(`App is listening on port ${port}`);
}); */

module.exports.handler = serverless(app);

const openWeatherAPIKey = process.env.OPENWEATHER_API_KEY;
const meaningCloudAPIKey = process.env.MEANINGCLOUD_API_KEY;
const weatherBitAPIKey = process.env.WEATHERBIT_API_KEY;
const pixabayAPIKey = process.env.PIXABAY_API_KEY;

// Sending the API key to the client
app.get('/api', (req, res) =>
  res.send({
    openWeatherKey: openWeatherAPIKey,
    meaningCloudKey: meaningCloudAPIKey,
    weatherBitKey: weatherBitAPIKey,
    photoKey: pixabayAPIKey,
  })
);

app.post('/data', (req, res) => {
  allData = {
    weatherAppData: {
      date: req.body.date,
      temperature: req.body.temperature,
      user_response: req.body.user_response,
    },
    newsAnalyzerData: {
      agreement: req.body.agreement,
      subjectivity: req.body.subjectivity,
      confidence: req.body.confidence,
      irony: req.body.irony,
    },
    travelAppData: {
      city_name: req.body.city_name,
      country_code: req.body.country_code,
      temperature: req.body.temp,
      app_temp: req.body.app_temp,
      description: req.body.description,
      photo: req.body.photo,
    },
  };
  console.log(allData);
  res.send(allData);
});

app.get('/UIdata', function (request, response) {
  response.send(allData);
});
