# Weather Dashboard 🌤️

A modern, responsive weather dashboard that fetches real-time weather data from the OpenWeatherMap API.

## Features

✅ **Current Weather Display**
- Real-time temperature, weather conditions, and location
- Feels-like temperature
- Humidity, wind speed, pressure, and visibility
- UV index and sunrise/sunset times
- Weather icons

✅ **Hourly Forecast**
- 24-hour forecast with temperature and conditions
- Wind speed and humidity for each hour

✅ **5-Day Forecast**
- Daily weather predictions
- High/low temperatures
- Weather conditions and icons

✅ **User Features**
- Search by city name with autocomplete suggestions
- Automatic location detection using geolocation
- Temperature unit toggle (Celsius/Fahrenheit)
- Responsive design for all devices
- Beautiful gradient UI with smooth animations

## Setup Instructions

### 1. Get an API Key

1. Visit [OpenWeatherMap API](https://openweathermap.org/api)
2. Sign up for a free account
3. Subscribe to the "Current Weather Data" and "One Call" APIs (free tier)
4. Get your API key from the account dashboard

### 2. Configure the Application

1. Open `weather-api.js`
2. Replace `YOUR_OPENWEATHERMAP_API_KEY` with your actual API key:

```javascript
const API_KEY = 'your-api-key-here';
```

### 3. Run the Application

1. Open `index.html` in your web browser
2. Allow location access when prompted (for automatic weather detection)
3. Or search for any city using the search box

## File Structure

```
weather-dashboard/
├── index.html          # Main HTML file
├── style.css           # Styling and responsive design
├── app.js              # Main application logic
├── weather-api.js      # API integration functions
└── README.md           # Documentation
```

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Grid layout, flexbox, gradients, animations
- **Vanilla JavaScript** - DOM manipulation, async/await, Fetch API
- **OpenWeatherMap API** - Real-time weather data
- **Open-Meteo Geocoding** - City search suggestions (free alternative)

## API Endpoints Used

1. **Current Weather**: `/data/2.5/weather`
2. **5-Day Forecast**: `/data/2.5/forecast`
3. **One Call API**: `/data/2.5/onecall` (includes UV index and hourly data)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Features in Detail

### Geolocation
The app automatically detects your location on first load and displays weather for your area.

### Search with Autocomplete
Start typing a city name and get suggestions from the Open-Meteo geocoding API.

### Temperature Toggle
Easily switch between Celsius and Fahrenheit with the toggle button.

### Responsive Design
Beautiful layout that adapts to all screen sizes, from mobile phones to desktop monitors.

## Error Handling

- Displays user-friendly error messages
- Graceful fallback if geolocation is denied
- API error handling with retry logic

## Future Enhancements

- Weather alerts and warnings
- Historical weather data
- Multiple city comparison
- Weather widgets
- Air quality index integration
- Dark mode theme

## License

MIT License - Feel free to use this project for learning and development.

## Credits

Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
City search by [Open-Meteo](https://open-meteo.com/)
