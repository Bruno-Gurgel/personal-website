/* eslint-disable */

// Setup empty JS object to act as endpoint for all routes
const projectData = {};
// Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware */

// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cors for cross origin allowance
const cors = require('cors');

app.use(cors());
// Initialize the main project folder
app.use(express.static('dist'));

const port = 8000;

// Spin up the server
const server = app.listen(
  port,
  (callback = () => {
    console.log(`running on localhost: ${port}`);
  })
);

// Callback function to complete GET '/data'
app.get('/data', function (request, response) {
  response.send(projectData);
});
// Post Route
app.post(
  '/data',
  (postData = (req, res) => {
    projectData['date'] = req.body.date;
    projectData['temperature'] = req.body.temperature;
    projectData['user_response'] = req.body.user_response;
    console.log(projectData);
    res.send(projectData);
  })
);
