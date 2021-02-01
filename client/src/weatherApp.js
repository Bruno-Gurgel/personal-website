// Importing styles
import './style/weather_app/style.css';

/*
 * Setting the display of the results div to none so that
 * it only appears when the generate button is clicked
 */
document.querySelector('#entryHolder').style.display = 'none';

// HTML DOM target
const button = document.querySelector('.button');

// Event listener to add function to existing HTML DOM element
button.addEventListener('click', () => {
  let apiKey = '';

  // Create a new date instance dynamically with JS
  const d = new Date();
  const newDate = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`;

  const newZip = document.getElementById('zip').value;
  const newFeeling = document.getElementById('feeling').value;

  document.querySelector('#entryHolder').style.display = 'none';
  document.querySelector('.loader').style.display = 'inline-block';
  document.querySelector('.loader').scrollIntoView({ behavior: 'smooth' });

  getApiKey()
    .then(() => {
      if (newFeeling !== '' && newZip !== '') {
        return displayWeather();
      } else {
        return alert('Please enter Zip code and your feelings');
      }
    })
    .then((data) => {
      return postData(
        'https://bmg-personal-website-server.herokuapp.com/data',
        {
          date: newDate,
          temperature: data.main.temp,
          user_response: newFeeling,
        }
      );
    })
    .then(() => updateUI())
    .catch(() => {
      document.getElementById('entryHolder').innerHTML =
        '<h3 class="error"><strong>Error!</strong> Sorry, there was an internal error, can you please reload the page and try again?</h3>';
      document.querySelector('.loader').style.display = '';
      document.getElementById('entryHolder').style.display = 'block';
      return false;
    });

  async function getApiKey() {
    try {
      const req = await fetch(
        'https://bmg-personal-website-server.herokuapp.com/api'
      );
      const data = await req.json();
      apiKey = data.openWeatherKey;
      return apiKey;
    } catch (e) {
      document.getElementById('entryHolder').innerHTML =
        '<h3 class="error"><strong>Error!</strong> Sorry, there was an internal error, can you please reload the page and try again?</h3>';
      document.querySelector('.loader').style.display = '';
      document.getElementById('entryHolder').style.display = 'block';
      return false;
    }
  }

  /* Function to GET Web API Data */
  async function displayWeather() {
    const baseUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${newZip},&appid=${apiKey}&units=metric`;
    const request = await fetch(baseUrl);
    if (request.ok) {
      try {
        const data = await request.json();
        return data;
      } catch (error) {
        return alert('There was an error:', error.message);
      }
    } else if (request.status === 404) {
      document.getElementById('entryHolder').innerHTML =
        '<h3 class="error"><strong>Error!</strong> Sorry, city not found. Are you sure the Zip is from USA?</h3>';
      document.querySelector('.loader').style.display = '';
      document.getElementById('entryHolder').style.display = 'block';
      return false;
    } else {
      document.getElementById('entryHolder').innerHTML =
        '<h3 class="error"><strong>Error!</strong> Sorry, there was an error fetching the weather data, can you please reload the page and try again?</h3>';
      document.querySelector('.loader').style.display = '';
      document.getElementById('entryHolder').style.display = 'block';
      return false;
    }
  }

  /* Function to POST data */
  async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    try {
      const newData = await response.json();
      return newData;
    } catch (e) {
      document.getElementById('entryHolder').innerHTML =
        '<h3 class="error"><strong>Error!</strong> Sorry, there was an internal error, can you please reload the page and try again?</h3>';
      document.querySelector('.loader').style.display = '';
      document.getElementById('entryHolder').style.display = 'block';
      return false;
    }
  }

  /* Dynamically updating the UI */
  async function updateUI() {
    const dateList = document.querySelector('#date_list');
    const tempList = document.querySelector('#temperature_list');
    const contentList = document.querySelector('#content_list');
    const entryHolder = document.querySelector('#entryHolder');

    try {
      const request = await fetch(
        'https://bmg-personal-website-server.herokuapp.com/UIdata'
      );
      const allData = await request.json();
      const { weatherAppData } = allData;
      dateList.innerHTML = `<li class="query_item">Date: ${weatherAppData.date}</li>`;
      tempList.innerHTML = `<li class="query_item">Temperature: ${weatherAppData.temperature.toFixed(
        0
      )}ºC</li>`;
      contentList.innerHTML = `<li class="query_item">Feeling: ${weatherAppData.user_response}</li>`;
      document.querySelector('.loader').style.display = '';
      document.querySelector('#entryHolder').style.display = '';
      // Showing the results div when the button is clicked
      entryHolder.style.display = 'grid';
      entryHolder.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      document.getElementById('entryHolder').innerHTML =
        '<h3 class="error"><strong>Error!</strong> Sorry, there was an internal error, can you please reload the page and try again?</h3>';
      document.querySelector('.loader').style.display = '';
      document.getElementById('entryHolder').style.display = 'block';
      return false;
    }
  }
});
