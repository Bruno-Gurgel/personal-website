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
  // Create a new date instance dynamically with JS
  const d = new Date();
  const newDate = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`;

  const newZip = document.getElementById('zip').value;
  const newFeeling = document.getElementById('feeling').value;
  // Personal API Key for OpenWeatherMap API
  const apiKey = '13f1473acdb89267f932793a8c56106a';
  const baseUrl = `http://api.openweathermap.org/data/2.5/weather?zip=${newZip},&appid=${apiKey}&units=metric`;
  if (newFeeling !== '' && newZip !== '') {
    displayWeather(baseUrl).then((data) => {
      postData('/data', {
        date: newDate,
        temperature: data.main.temp,
        user_response: newFeeling,
      });
      updateUI();
    });
  } else {
    alert('Please enter Zip code and your feelings');
  }
});

/* Function to GET Web API Data */
const displayWeather = async (url) => {
  const request = await fetch(url);
  if (request.ok) {
    try {
      const data = await request.json();
      console.log(data);
      return data;
    } catch (error) {
      return alert('There was an error:', error.message);
    }
  } else if (request.status === 404) {
    return alert('City not found. Are you sure the Zip is from USA?');
  } else {
    return alert(`There was an error: ${request.statusText}`);
  }
};

/* Function to POST data */
const postData = async (url = '', data = {}) => {
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
    // console.log(newData);
    return newData;
  } catch (error) {
    console.log('There was an error:', error);
    return false;
  }
};

/* Dynamically updating the UI */
const updateUI = async () => {
  const request = await fetch('/data');

  const dateList = document.querySelector('#date_list');
  const tempList = document.querySelector('#temperature_list');
  const contentList = document.querySelector('#content_list');
  const entryHolder = document.querySelector('#entryHolder');
  // Showing the results div when the button is clicked
  entryHolder.style.display = 'grid';

  try {
    const allData = await request.json();
    dateList.innerHTML = `<li class="query_item">Date: ${allData.date}</li>`;
    tempList.innerHTML = `<li class="query_item">Temperature: ${allData.temperature.toFixed(
      0
    )}ºC</li>`;
    contentList.innerHTML = `<li class="query_item">Feeling: ${allData.user_response}</li>`;
    entryHolder.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.log('There was an error:', error);
  }
};
