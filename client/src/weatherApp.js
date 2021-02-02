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

  document.getElementById('error').style.display = '';
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
    .catch((error) => {
      if (error.message === 'City not found') {
        document.getElementById('error').innerHTML =
          '<h3 class="error"><strong>Error!</strong> Sorry, city not found. Are you sure the Zip is from the USA?</h3>';
        document.querySelector('.loader').style.display = '';
        document.getElementById('error').style.display = 'block';
      } else if (error.message === 'Error fetching weather') {
        document.getElementById('error').innerHTML =
          '<h3 class="error"><strong>Error!</strong> Sorry, there was an error fetching the weather data, can you please reload the page and try again?</h3>';
        document.querySelector('.loader').style.display = '';
        document.getElementById('error').style.display = 'block';
      } else {
        document.getElementById('error').innerHTML =
          '<h3 class="error"><strong>Error!</strong> Sorry, there was an internal error, can you please reload the page and try again?</h3>';
        document.querySelector('.loader').style.display = '';
        document.getElementById('error').style.display = 'block';
      }
    });

  async function getApiKey() {
    const req = await fetch(
      'https://bmg-personal-website-server.herokuapp.com/api'
    );
    const data = await req.json();
    apiKey = data.openWeatherKey;
    return apiKey;
  }

  /* Function to GET Web API Data */
  async function displayWeather() {
    const baseUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${newZip},&appid=${apiKey}&units=metric`;
    const request = await fetch(baseUrl);
    if (request.ok) {
      const data = await request.json();
      return data;
    } else if (request.status === 404) {
      throw new Error('City not found');
    } else {
      throw new Error('Error fetching weather');
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

    const newData = await response.json();
    return newData;
  }

  /* Dynamically updating the UI */
  async function updateUI() {
    const dateList = document.querySelector('#date_list');
    const tempList = document.querySelector('#temperature_list');
    const contentList = document.querySelector('#content_list');
    const entryHolder = document.querySelector('#entryHolder');

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
  }
});
