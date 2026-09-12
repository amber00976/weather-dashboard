// OpenWeatherMap API Configuration
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Get free key from https://openweathermap.org/api
const API_BASE_URL = 'https://api.openweathermap.org';

// Function to fetch current weather by city name
async function getCurrentWeatherByCity(cityName) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error('City not found');
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Function to fetch weather by coordinates
async function getWeatherByCoordinates(lat, lon) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error('Failed to fetch weather');
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Function to fetch 5-day forecast
async function getFiveDayForecast(cityName) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error('Failed to fetch forecast');
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Function to fetch one-call API (includes UV index)
async function getOneCallAPI(lat, lon) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely`
        );
        if (!response.ok) throw new Error('Failed to fetch extended weather data');
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Function to get city suggestions (using Open-Meteo free API for city search)
async function getCitySuggestions(query) {
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`
        );
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}
