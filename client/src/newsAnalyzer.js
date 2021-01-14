import './style/news_analyzer/base.scss';
import './style/news_analyzer/form.scss';
import './style/news_analyzer/footer.scss';
import './style/news_analyzer/header.scss';

// Wait Dom to be loaded - Better for Jest testing
document.addEventListener('DOMContentLoaded', function () {
  // URL checker
  const checkForURL = (inputURL) => {
    const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

    if (regexp.test(inputURL)) {
      return true;
    } else {
      return false;
    }
  };

  document
    .querySelector('#submit')
    .addEventListener('click', function callbackFunction(event) {
      event.preventDefault();

      const formText = document.getElementById('name').value;
      const baseUrl = 'https://api.meaningcloud.com/sentiment-2.1?';
      let apiKey = '';
      let data = {};
      // Checking if the URL is valid
      if (checkForURL(formText)) {
        getApiKey()
          .then(() => getTextAnalysis(baseUrl, apiKey, formText))
          .then((apiResponse) => {
            return postData(
              'https://bmg-personal-website-server.herokuapp.com/data',
              {
                agreement: apiResponse.agreement,
                subjectivity: apiResponse.subjectivity,
                confidence: apiResponse.confidence,
                irony: apiResponse.irony,
              }
            );
          })
          .then(() => updateUI());
      } else {
        alert('Invalid URL');
      }

      async function getApiKey() {
        const req = await fetch(
          'https://bmg-personal-website-server.herokuapp.com/api'
        );
        try {
          data = await req.json();
          apiKey = data.meaningCloudKey;
          return apiKey;
        } catch (error) {
          alert('There was an error:', error.message);
          return false;
        }
      }

      async function getTextAnalysis(url, key, formURL) {
        const res = await fetch(
          `${url}key=${key}&of=json.&model=general&lang=en&url=${formURL}`
        );
        try {
          const apiResponse = await res.json();
          return apiResponse;
        } catch (error) {
          alert('There was an error:', error.message);
          return false;
        }
      }

      // eslint-disable-next-line no-shadow
      async function postData(url = '', data = {}) {
        const res = await fetch(url, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        try {
          const newData = await res.json();
          return newData;
        } catch (error) {
          alert('There was an error:', error.message);
          return false;
        }
      }

      async function updateUI() {
        const req = await fetch(
          'https://bmg-personal-website-server.herokuapp.com/UIdata'
        );
        const results = document.getElementById('results');

        try {
          const allData = await req.json();
          const { newsAnalyzerData } = allData;
          results.innerHTML = `
          <li class="results__item"><span class="api__title">URL:</span> ${formText}</li>
          <li class="results__item"><span class="api__title">Agreement:</span> ${newsAnalyzerData.agreement};</li>
          <li class="results__item"><span class="api__title">Subjectivity:</span> ${newsAnalyzerData.subjectivity};</li>
          <li class="results__item"><span class="api__title">Confidence:</span> ${newsAnalyzerData.confidence}%;</li>
          <li class="results__item"><span class="api__title">Irony:</span> ${newsAnalyzerData.irony}.</li>`;
          results.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
          alert('There was an error:', error.message);
        }
      }
    });
});
