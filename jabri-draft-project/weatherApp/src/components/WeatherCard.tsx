import React from 'react';

interface WeatherCardProps {
  cityName: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  icon: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  cityName,
  description,
  temperature,
  humidity,
  windSpeed,
  icon,
}) => {
  const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="weather-card ">
      <h2 className="city-name">{cityName}</h2>
      <div className="weather-description">
        <img src={iconUrl} alt="Weather Icon" />
        <p>{description}</p>
      </div>
      <p className="temp">Temperature: {temperature}°C</p>
      <p className="humidity">Humidity: {humidity}%</p>
      <p className="wind">Wind Speed: {windSpeed} m/s</p>
    </div>
  );
};

export default WeatherCard;
