package models

type WeatherData struct {
	CityName string  `json:"city"`
	CountryName string `json:"country"`
	Temp     float64 `json:"temp"`
	Humidity int     `json:"humidity"`
	Condition string `json:"condition"`

}	