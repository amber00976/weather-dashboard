// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const weatherContent = document.getElementById('weatherContent');
const suggestionsBox = document.getElementById('suggestions');
const tempToggle = document.getElementById('tempToggle');

// State
let currentWeatherData = null;
let forecastData = null;
let oneCallData = null;
let isCelsius = true;
let debounceTimer = null;

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
searchInput.addEventListener('input', handleSuggestions);
document.addEventListener('click', (e) => {
    if (e.target !== searchInput && e.target !== suggestionsBox) {
        suggestionsBox.classList.remove('active');
    }
});
tempToggle.addEventListener('click', toggleTemperature);

// Initialize - Load weather for user's location
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                loadWeatherByCoordinates(latitude, longitude);
            },
            () => {
                // Fallback to default city if geolocation fails
                handleSearch('London');
            }
        );
    }
});

// Search Handler
async function handleSearch(cityName = null) {
    const city = cityName || searchInput.value.trim();
    if (!city) return;

    searchInput.value = city;
    suggestionsBox.classList.remove('active');
    await loadWeatherByCity(city);
}

// Suggestions Handler
async function handleSuggestions(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
        suggestionsBox.classList.remove('active');
        return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        const suggestions = await getCitySuggestions(query);
        displaySuggestions(suggestions);
    }, 300);
}

// Display suggestions
function displaySuggestions(suggestions) {
    suggestionsBox.innerHTML = '';
    if (suggestions.length === 0) return;

    suggestions.forEach((city) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        const countryName = city.country ? `, ${city.country}` : '';
        div.textContent = `${city.name}${countryName}`;
        div.addEventListener('click', () => {
            handleSearch(city.name);
        });
        suggestionsBox.appendChild(div);
    });

    suggestionsBox.classList.add('active');
}

// Load weather by city name
async function loadWeatherByCity(cityName) {
    showLoading(true);
    hideError();

    try {
        currentWeatherData = await getCurrentWeatherByCity(cityName);
        forecastData = await getFiveDayForecast(cityName);
        oneCallData = await getOneCallAPI(currentWeatherData.coord.lat, currentWeatherData.coord.lon);

        displayWeather();
        showLoading(false);
    } catch (error) {
        showError('Unable to fetch weather data. Please check the city name and try again.');
        showLoading(false);
    }
}

// Load weather by coordinates
async function loadWeatherByCoordinates(lat, lon) {
    showLoading(true);
    hideError();

    try {
        currentWeatherData = await getWeatherByCoordinates(lat, lon);
        forecastData = await getFiveDayForecast(currentWeatherData.name);
        oneCallData = await getOneCallAPI(lat, lon);

        searchInput.value = currentWeatherData.name;
        displayWeather();
        showLoading(false);
    } catch (error) {
        showError('Unable to fetch weather data for your location.');
        showLoading(false);
    }
}

// Display weather information
function displayWeather() {
    if (!currentWeatherData) return;

    const temp = currentWeatherData.main.temp;
    const feelsLike = currentWeatherData.main.feels_like;
    const description = currentWeatherData.weather[0].description;
    const icon = currentWeatherData.weather[0].icon;
    const humidity = currentWeatherData.main.humidity;
    const windSpeed = currentWeatherData.wind.speed;
    const pressure = currentWeatherData.main.pressure;
    const visibility = (currentWeatherData.visibility / 1000).toFixed(1);
    const sunrise = new Date(currentWeatherData.sys.sunrise * 1000);
    const sunset = new Date(currentWeatherData.sys.sunset * 1000);
    const uvIndex = oneCallData.current.uvi;

    // Update current weather section
    document.getElementById('cityName').textContent = `${currentWeatherData.name}, ${currentWeatherData.sys.country}`;
    document.getElementById('weatherDate').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('temperature').textContent = Math.round(temp);
    document.getElementById('weatherDescription').textContent = description;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('windSpeed').textContent = `${windSpeed.toFixed(1)} m/s`;
    document.getElementById('pressure').textContent = `${pressure} mb`;
    document.getElementById('visibility').textContent = `${visibility} km`;
    document.getElementById('uvIndex').textContent = uvIndex.toFixed(1);
    document.getElementById('sunrise').textContent = sunrise.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Display hourly forecast
    displayHourlyForecast();

    // Display daily forecast
    displayDailyForecast();

    // Show weather content
    weatherContent.style.display = 'block';
}

// Display hourly forecast
function displayHourlyForecast() {
    const hourlyContainer = document.getElementById('hourlyForecast');
    hourlyContainer.innerHTML = '';

    const hourlyData = oneCallData.hourly.slice(0, 24);

    hourlyData.forEach((hour, index) => {
        const time = new Date(hour.dt * 1000);
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="time">${time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="Weather">
            </div>
            <div class="temp">${Math.round(hour.temp)}°C</div>
            <div class="description">${hour.weather[0].description}</div>
            <div class="extra-info">
                <span>💧 ${hour.humidity}%</span>
                <span>💨 ${hour.wind_speed.toFixed(1)}m/s</span>
            </div>
        `;
        hourlyContainer.appendChild(card);
    });
}

// Display daily forecast
function displayDailyForecast() {
    const dailyContainer = document.getElementById('dailyForecast');
    dailyContainer.innerHTML = '';

    const dailyData = oneCallData.daily.slice(0, 5);

    dailyData.forEach((day) => {
        const date = new Date(day.dt * 1000);
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="time">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather">
            </div>
            <div class="temp">${Math.round(day.temp.max)}°/${Math.round(day.temp.min)}°</div>
            <div class="description">${day.weather[0].description}</div>
            <div class="extra-info">
                <span>💧 ${day.humidity}%</span>
                <span>💨 ${day.wind_speed.toFixed(1)}m/s</span>
            </div>
        `;
        dailyContainer.appendChild(card);
    });
}

// Toggle temperature unit
function toggleTemperature() {
    isCelsius = !isCelsius;
    const tempElement = document.getElementById('temperature');
    const currentTemp = parseFloat(tempElement.textContent);

    if (isCelsius) {
        tempElement.textContent = Math.round(currentTemp);
        tempToggle.textContent = '°F';
    } else {
        tempElement.textContent = Math.round((currentTemp * 9/5) + 32);
        tempToggle.textContent = '°C';
    }
}

// Utility functions
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    weatherContent.style.display = 'none';
    setTimeout(() => errorMessage.classList.remove('show'), 5000);
}

function hideError() {
    errorMessage.classList.remove('show');
}
