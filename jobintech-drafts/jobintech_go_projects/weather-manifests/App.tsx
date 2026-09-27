import React, { useState } from "react";
import { fetchWeatherByCity } from "./api/api";



const App: React.FC = () => {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");

  

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const response = await fetchWeatherByCity(city);
      setWeather(response.data);
    } catch (err) {
      setError("City not found or API error.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md">
      <h1 className="text-3xl font-bold text-black mb-6 text-center">Weather App V7</h1>
      <div className="flex gap-2 mb-6">
        <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 px-4 py-2 rounded-xl  border-1 border-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none bg-white bg-opacity-70 text-gray-800"
        />
        <button
        onClick={handleSearch}
        disabled={loading || !city}
        className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
        {loading ? "Loading..." : "Search"}
        </button>
      </div>
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      {weather && (
        <div className="bg-white bg-opacity-80 rounded-2xl p-6 flex flex-col items-center animate-fade-in w-full min-h-[320px]">
        <img
          src={weather.icon}
          alt={weather.condition}
          className="w-20 h-20 mb-4 object-contain"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center w-full truncate">
          {weather.city}, {weather.country}
        </h2>
        <p className="text-lg text-gray-600 mb-2 text-center w-full truncate">{weather.condition}</p>
        <div className="flex gap-6 mb-2 w-full justify-center">
          <div className="flex flex-col items-center w-24">
          <span className="text-xl font-bold text-indigo-600 leading-none">
            {weather.temperature}°C
          </span>
          <span className="text-xs text-gray-500 mt-1">Temperature</span>
          </div>
          <div className="flex flex-col items-center w-24">
          <span className="text-xl font-semibold text-blue-600 leading-none">
            {weather.humidity}%
          </span>
          <span className="text-xs text-gray-500 mt-1">Humidity</span>
          </div>
          <div className="flex flex-col items-center w-24">
          <span className="text-xl font-semibold text-purple-600 leading-none">
            {weather.wind_speed} km/h
          </span>
          <span className="text-xs text-gray-500 mt-1">Wind</span>
          </div>
        </div>
        <span className="text-xs text-gray-400 mt-2 w-full text-center">
          Updated at: {new Date(weather.updated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </span>
        </div>
      )}
      </div>
    </div>
  );
};

export default App;