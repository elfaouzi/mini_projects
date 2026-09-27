import api from "./config";

export const fetchWeatherByCity = async (city: string) => {
  try {
    const response = await api.get(`/city/${city}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  } 
};

export const testConnection = async () => {
    try {
        const response = await api.get(`/hello`);
        return response.data;
        } catch (error) {   
        console.error("Error fetching weather data:", error);
        throw error;
    }
};

export const testoptions = async () => {
    try {
        const response = await api.options(`/`);
        return response.data;
        } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
};

