import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import SearchForm from './components/SearchForm';

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [city, setCity] = useState<string>('London');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = '91c6adddf6ae6f395a88052eb0d2c7e7';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      try {
        const response = await axios.get(url);
        setWeatherData(response.data);
        setError('');
      } catch (error) {
        setError('City not found');
        setWeatherData(null);
      }
    };

    fetchWeather();
  }, [city]);

  return (
    <div className="app-container bg-blue-200 ">
      <SearchForm onSearch={setCity} />
      {error && <p className="error-message">{error}</p>}
      {weatherData && (
        <WeatherCard
          cityName={weatherData.name}
          description={weatherData.weather[0].description}
          temperature={weatherData.main.temp}
          humidity={weatherData.main.humidity}
          windSpeed={weatherData.wind.speed}
          icon={weatherData.weather[0].icon}
        />
      )}
    </div>
  );
};

export default App;
