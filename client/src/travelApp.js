import './style/travel_app/main.scss';

/**
 * Checks if Local Storage is available on the browser.
 * @param {string} type The local storage property name.
 * @returns {boolean} True if it works and error if it does not.
 */
const storageAvailable = (type) => {
  let storage = '';
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
};

/**
 * Saves the data that the user puts on the form.
 * @returns {void} Nothing. Just saves the data in the local storage.
 */
const saveTripData = () => {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const location = document.getElementById('location').value;

  // Saving the sent data
  localStorage.setItem('startDate', startDate);
  localStorage.setItem('endDate', endDate);
  localStorage.setItem('location', location);

  return true;
};

/**
 * Pre-fill the data if it is on the local storage object.
 * @returns {void} Nothing.
 */
const preFillTripData = () => {
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  const locationInput = document.getElementById('location');

  // Checking if the inputs are empty
  // And if there is data on the local storage
  if (
    startDateInput.value === '' &&
    endDateInput.value === '' &&
    locationInput.value === '' &&
    localStorage.getItem('startDate') !== null
  ) {
    startDateInput.defaultValue = localStorage.getItem('startDate');
    endDateInput.defaultValue = localStorage.getItem('endDate');
    locationInput.defaultValue = localStorage.getItem('location');
  }
  return true;
};

/**
 * Saves the data that the user puts on the To-do list.
 * @returns {void} Nothing. Just saves the data in the local storage.
 */
const saveToDoData = () => {
  const items = document.querySelectorAll('LI');
  for (const [index, item] of items.entries()) {
    const itemWithoutSpan = item.childNodes[0];
    const toDo = itemWithoutSpan.textContent;
    localStorage.setItem(`toDoItem_${index + 1}`, toDo);
  }
  return true;
};

/**
 * Pre-fill the To-do data if it is on the local storage object.
 * @returns {void} Nothing.
 */
const preFillToDoData = () => {
  for (const [key, value] of Object.entries(localStorage)) {
    if (key.startsWith('toDo')) {
      const li = document.createElement('li');
      li.textContent = value;
      const span = document.createElement('SPAN');
      const txt = document.createTextNode('\u00D7');
      span.className = 'close';
      span.appendChild(txt);
      li.appendChild(span);
      document.getElementById('myUL').appendChild(li);
    }
  }
  return true;
};

document.addEventListener('DOMContentLoaded', async () => {
  /* ======= Model ======= */
  const model = {
    // Input values
    input: {},
    differenceDays: {},
    apiData: {
      apikey: '',
    },
  };

  /* ======= Controller ======= */
  const controller = {
    init() {
      appView.init();
      this.mainFunction();
    },
    async getData(urlToFetch) {
      const res = await fetch(urlToFetch);
      model.apiData.apiResponse = await res.json();

      return model.apiData.apiResponse;
    },
    /**
     * Changes the model.input properties to the values that the user entendered.
     * @returns {void} Nothing.
     */
    setInputData() {
      model.input.location = document.getElementById('location').value;
      model.input.startDate = document.getElementById('start-date').value;
      model.input.endDate = document.getElementById('end-date').value;
    },
    /**
     * Changes the model.apiData latitude and longitude properties to the ones of the place the user will go.
     * @returns {void} Nothing.
     */
    setLatitudeAndLongitude() {
      model.apiData.latitude = model.apiData.geonamesData.latitude;
      model.apiData.longitude = model.apiData.geonamesData.longitude;
    },
    mainFunction() {
      if (storageAvailable('localStorage')) {
        preFillTripData();
      }
      appView.form.addEventListener('submit', async (event) => {
        event.preventDefault();

        appView.resultsDiv.style.display = 'none';
        appView.loader.style.display = 'inline-block';
        appView.loader.scrollIntoView({ behavior: 'smooth' });

        this.setInputData();
        // Saving the input data on the Local Storage
        if (storageAvailable('localStorage')) {
          saveTripData();
        }
        apis
          .geonamesApi()
          .then(() => apis.weatherbitApi())
          .then(() => apis.pixabayApi())
          .then(() =>
            apis.postData(
              'https://bmg-personal-website-server.herokuapp.com/data',
              {
                city_name: model.apiData.weatherResponse.city_name,
                country_code: model.apiData.weatherResponse.country_code,
                temp: model.apiData.weatherResponse.temp,
                app_temp: model.apiData.weatherResponse.app_temp,
                description: model.apiData.weatherResponse.weather.description,
                photo: model.apiData.photoResponse,
              }
            )
          )
          .then(() => appView.render())
          .catch(() => {
            document.getElementById('error').innerHTML =
              '<h3 class="error"><strong>Error!</strong> Sorry, there was an internal error, can you please reload the page and try again?</h3>';
            document.querySelector('.loader').style.display = '';
            document.getElementById('error').style.display = 'block';
            return false;
          });
      });
    },
  };

  /* ======= APIS ======= */
  const apis = {
    /**
     * Fetches latitude and longitude from geonames API.
     * @async
     * @returns {object} The object containing the desired latitude and longitude.
     */
    async geonamesApi() {
      await controller.getData(
        `https://secure.geonames.org/searchJSON?q=${model.input.location}&maxRows=1&username=bmg1612`
      );
      model.apiData.geonamesData = {
        latitude: model.apiData.apiResponse.geonames[0].lat,
        longitude: model.apiData.apiResponse.geonames[0].lng,
      };
      controller.setLatitudeAndLongitude();
      return model.apiData.geonamesData;
    },
    /**
     * Fetches weather and city/country data from weatherbit API.
     * @async
     * @returns {object} The object containing the desired weather and city/country data.
     */
    async weatherbitApi() {
      // Getting API key from the server
      const req = await fetch(
        'https://bmg-personal-website-server.herokuapp.com/api'
      );
      const data = await req.json();
      model.apiData.apiKey = data.weatherBitKey;

      await controller.getData(
        `https://api.weatherbit.io/v2.0/current?lat=${model.apiData.latitude}&lon=${model.apiData.longitude}&key=${model.apiData.apiKey}`
      );
      model.apiData.weatherResponse = {
        city_name: model.apiData.apiResponse.data[0].city_name,
        country_code: model.apiData.apiResponse.data[0].country_code,
        temp: model.apiData.apiResponse.data[0].temp,
        app_temp: model.apiData.apiResponse.data[0].app_temp,
        weather: {
          description: model.apiData.apiResponse.data[0].weather.description,
        },
      };
      return model.apiData.weatherResponse;
    },

    /**
     * Fetches a photo of the desired location from pixabay API.
     * @async
     * @returns {object} The object containing the photo.
     */
    async pixabayApi() {
      // Getting API key from the server
      const req = await fetch('/api');
      const data = await req.json();
      model.apiData.apiKey = data.photoKey;
      // Fetching data
      await controller.getData(
        `https://pixabay.com/api/?key=${model.apiData.apiKey}&q=${model.apiData.weatherResponse.city_name}&image_type=photo`
      );
      /* If it is a big city, there will be 20 'hits' photos
       * Then it will be randomly chosen
       */
      if (model.apiData.apiResponse.hits.length === 20) {
        model.apiData.photoResponse =
          model.apiData.apiResponse.hits[
            Math.floor(Math.random() * 21)
          ].webformatURL;
        return model.apiData.photoResponse;
        /* If it is a smaller city with less than 20 hits
         * The first one is chosen
         */
      } else {
        model.apiData.photoResponse =
          model.apiData.apiResponse.hits[0].webformatURL;
        return model.apiData.photoResponse;
      }
    },

    /**
     * Posts the retrieved API data so that we can update the UI.
     * @async
     * @returns {object} The object containing the data that we will use to update the UI.
     */
    async postData(url = '', data = {}) {
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const allData = await res.json();
      model.apiData.newData = allData.travelAppData;
      return model.apiData.newData;
    },
  };

  /* ======= View ======= */
  const appView = {
    init() {
      this.form = document.querySelector('.form');
      this.loader = document.querySelector('.loader');
      this.resultsDiv = document.getElementById('results');
    },

    /**
     * Updates the UI with the extracted data form the APIs.
     * @async
     * @returns {void} Nothing.
     */
    render() {
      // prettier-ignore
      appView.resultsDiv.innerHTML = `
        <h2>Your trip to ${model.apiData.newData.city_name}</h2>
        <div class="results__image">
          <img src="${model.apiData.newData.photo}" alt="Photo of ${model.apiData.newData.city_name} from Pixabay">
        </div>;  
        <div class="results__text">
          <p>Typically, the weather for ${model.apiData.newData.city_name}/${model.apiData.newData.country_code}
             on the desired  date is ${model.apiData.newData.temperature}ºC with ${model.apiData.newData.description.toLowerCase()}
            and apparent temperature of ${model.apiData.newData.app_temp}ºC.
          </p>
          <p><a href="https://www.weatherbit.io/" target="_blank">Source</a></p>
          <br>
          <p>Countdown: In ${model.differenceDays.diffDaysCountdown} days you will be in ${model.apiData.newData.city_name}!
             You will stay there for ${model.differenceDays.diffDaysTrip} days!</p>
          <h3>To-do List</h3>
          <div class="toDo__header">
              <input type="text" id="myInput" placeholder="Title...">
              <span class="addBtn">Add</span>
          </div>   
          <ul id="myUL"></ul>
        </div>`;
      if (storageAvailable('localStorage')) {
        preFillToDoData();
      }
      /* eslint-enable prettier/prettier */
      appView.loader.style.display = '';
      appView.resultsDiv.style.display = '';
      appView.resultsDiv.style.display = 'grid';
      appView.resultsDiv.scrollIntoView({ behavior: 'smooth' });
      toDoView.init();
    },
  };

  const toDoView = {
    init() {
      this.list = document.getElementById('myUL');
      this.addButton = document.querySelector('.addBtn');

      this.render();
    },
    render() {
      /**
       * Add a "checked" symbol when clicking on a list item and remove the item if the 'X' is clicked.
       * @event
       * @async
       * @returns {void} Nothing.
       */
      this.list.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
          event.target.classList.toggle('checked');
          // Erasing the item if the respective 'x' is clicked
        } else if (
          event.target.tagName === 'SPAN' &&
          event.target.parentElement.tagName === 'LI'
        ) {
          const itemToBeRemoved = event.target.parentElement;
          itemToBeRemoved.remove();
          // Erasing the item from the local storage too
          for (const value of Object.values(localStorage)) {
            const deletedItemInnerText = itemToBeRemoved.innerText;
            if (deletedItemInnerText.includes(value)) {
              localStorage.removeItem(
                Object.keys(localStorage).find(
                  (key) => localStorage[key] === value
                )
              );
            }
          }
        }
      });

      /**
       * Create a new list item when clicking on the "Add" button.
       * @event
       * @async
       * @returns {void} Nothing.
       */
      this.addButton.addEventListener('click', () => {
        const li = document.createElement('li');
        // const allItems = document.querySelectorAll('li');
        const inputValue = document.getElementById('myInput').value;
        li.textContent = inputValue;
        if (inputValue === '') {
          alert('You must write something!');
        } else {
          document.getElementById('myUL').appendChild(li);
          if (storageAvailable('localStorage')) {
            saveToDoData();
          }
        }
        document.getElementById('myInput').value = '';

        const span = document.createElement('SPAN');
        const txt = document.createTextNode('\u00D7');
        span.className = 'close';
        span.appendChild(txt);
        li.appendChild(span);
      });
    },
  };

  controller.init();
});
