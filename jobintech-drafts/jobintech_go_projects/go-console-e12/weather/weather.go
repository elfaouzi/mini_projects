package weather

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func SearchWeather(input string) {
	
	if (input == "") {
		fmt.Println("Please provide a valid city name or coordinates.")
		return
	}
	if(strings.Contains(input, ",")){
		coords := strings.Split(input, ",")
		if(len(coords) != 2){
			fmt.Println("Please provide valid coordinates in the format: lat,lon")
			return
		}
		var lat, lon float64
		_, err1 := fmt.Sscanf(strings.TrimSpace(coords[0]), "%f", &lat)
		_, err2 := fmt.Sscanf(strings.TrimSpace(coords[1]), "%f", &lon)
		if err1 != nil || err2 != nil {
			fmt.Println("Invalid coordinates. Please ensure they are numeric values.")
			return
		}
		fmt.Println(GetWeatherByCoordinates(lat, lon))
	} else {
		city := strings.TrimSpace(input)
		fmt.Println(GetWeatherByCity(city))
	}
}


func GetWeatherByCity(city string) string {
	var url string = "http://api.weatherapi.com/v1/current.json?key=17b1a4327295454dbaf104104252609&q="+city+"&aqi=no"
	resp ,err:= http.Get(url)
	if err != nil {
		fmt.Println("Error fetching weather data:", err)
		return ""
	}
	if resp.StatusCode != 200 {
	
		fmt.Println("Failed to get weather data. Status code:", resp.StatusCode)
    return ""
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)


	return "Weather data for city: " + city + ": " + string(body)
}

func GetWeatherByCoordinates(lat, lon float64) string {
	return "Weather data for coordinates: " + fmt.Sprintf("(%f, %f)", lat, lon)
}
