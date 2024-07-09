const temperatureElement = document.getElementById('temperature');
const cityNameElement = document.getElementById('cityname');
const feelsLikeElement = document.getElementById('feels');
const humidityElement = document.getElementById('humid');
const weatherIconElement = document.getElementById('weticon');
const windSpeedElement = document.getElementById('windspeed');
const precipitationElement = document.getElementById('precipitation');
const weatherDescriptionElement = document.getElementById('wetdis');

async function fetchWeatherData(city) {
  const apiKey = '00db6ceb032557737bcc6a8ab310c812'; 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const result = await response.json(); 
    console.log(result);
    displayWeatherData(result);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    displayError();
  }
}

function isDayTime(data) {
  const currentTime = new Date().getTime() / 1000; 
  const sunrise = data.sys.sunrise;
  const sunset = data.sys.sunset;
  return currentTime >= sunrise && currentTime < sunset;
}

function getWeatherIcon(data) {
  const weather = data.weather[0].main;
  const isDay = isDayTime(data);
  const weatherIcons = {
    Clear: isDay ? 'sunny.png' : 'moony.png',
    Clouds: isDay ? 'cloudyday.png' : 'cloudynight.png',
    Rain: isDay ? 'rainyday.png' : 'rainynight.png',
    Snow: isDay ? 'snowyday.png' : 'snowynight.png',
    Thunderstorm: isDay ? 'storm.png' : 'storm.png', 
    Drizzle: isDay ? 'rainyday.png' : 'rainynight.png',
    Mist: 'mist.png',
    Smoke: 'smoke.png',
    Haze: 'haze.png',
    Dust: 'dust.png',
    Fog: 'fog.png',
  };

  return weatherIcons[weather] || 'weather-animate.svg'; 
}

function setBackgroundGradient(weather) {
  const body = document.body;
  let gradient;
  switch (weather) {
    case 'Clear':
      gradient = 'linear-gradient(to bottom, #87CEEB, #FFFFFF)';
      break;
    case 'Clouds':
      gradient = 'linear-gradient(to bottom, #D3D3D3, #FFFFFF)';
      break;
    case 'Rain':
    case 'Drizzle':
      gradient = 'linear-gradient(to bottom, #708090, #FFFFFF)';
      break;
    case 'Snow':
      gradient = 'linear-gradient(to bottom, #FFFFFF, #F0FFFF)';
      break;
    case 'Thunderstorm':
      gradient = 'linear-gradient(to bottom, #800000, #FFFFFF)';
      break;
    default:
      gradient = 'linear-gradient(to bottom, #87CEEB, #FFFFFF)';
      break;
  }
  body.style.background = gradient;
}

function displayWeatherData(data) {
  temperatureElement.textContent = `${data.main.temp}°C`;
  cityNameElement.textContent = `${data.name}`;
  feelsLikeElement.textContent = `${data.main.feels_like}°C`;
  humidityElement.textContent = `${data.main.humidity}%`;
  windSpeedElement.textContent = `${data.wind.speed} m/s`;
  weatherDescriptionElement.textContent = data.weather[0].description;

  if (data.rain && data.rain['1h']) {
    precipitationElement.textContent = `${data.rain['1h']} mm (rain)`;
  } else if (data.snow && data.snow['1h']) {
    precipitationElement.textContent = `${data.snow['1h']} mm (snow)`;
  } else {
    precipitationElement.textContent = 'None';
  }

  setBackgroundGradient(data.weather[0].main); 
  const weatherIcon = getWeatherIcon(data);
  weatherIconElement.src = `assets/weathericon/${weatherIcon}`;
}

function displayLoading() {
  const weatherContainer = document.getElementById('weather-container');
  weatherContainer.innerHTML = '<p>Loading...</p>';
}

function displayError() {
  const weatherContainer = document.getElementById('weather-container');
  const errorHtml = `<div class="Card">
                <div class="CardInner">
                    <div class="container">
                        <button class="Icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="#657789" stroke-width="3" stroke-linecap="round"
                                stroke-linejoin="round" class="feather feather-search">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>
                        <div class="InputContainer">
                            <input id='loc' placeholder="Enter a Location..." />
                        </div>
                    </div>
                </div>
            </div>
            <img src="assets/unable.png" style="width: 250px; margin: 20px;">
  <p class="defp">Unable to fetch this location</p>`;
  weatherContainer.innerHTML = errorHtml;
  setTimeout((e) => {
    window.location.reload();
  }, 3000)
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const city = document.querySelector('#loc').value; 
    fetchWeatherData(city);
  }
});

document.addEventListener('DOMContentLoaded', (event) => {
  const searchButton = document.querySelector('.Icon');
  searchButton.addEventListener('click', () => {
    const city = document.querySelector('#loc').value; 
    fetchWeatherData(city);
  });

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiKey = '00db6ceb032557737bcc6a8ab310c812'; 
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      try {
        const response = await fetch(weatherUrl);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const weatherData = await response.json();
        console.log('Weather Data:', weatherData);
        displayWeatherData(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        displayError();
      }
    }, () => {
      const defaultCity = 'Delhi';

      fetchWeatherData(defaultCity);
    });
  } else {
    const defaultCity = 'Delhi';

    fetchWeatherData(defaultCity);
  }
});

