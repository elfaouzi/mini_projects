package weather

import (
	"testing"
	"time"
)

// Test the pure mapping function BuildWeatherFromAPI
func TestBuildWeatherFromAPI(t *testing.T) {
    api := WeatherAPIResponse{
        Location: LocationData{
            Name:    "SampleCity",
            Country: "SampleLand",
        },
        Current: CurrentData{
            TempC:    21.5,
            Humidity: 42,
            WindKph:  11.2,
            Condition: ConditionData{
                Text: "Partly cloudy",
                Icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
            },
        },
    }

    now := time.Date(2025, time.October, 27, 12, 0, 0, 0, time.UTC)
    w := BuildWeatherFromAPI(api, now)

    if w.City != "SampleCity" {
        t.Fatalf("expected City SampleCity, got %s", w.City)
    }
    if w.Country != "SampleLand" {
        t.Fatalf("expected Country SampleLand, got %s", w.Country)
    }
    if w.Temperature != 21.5 {
        t.Fatalf("expected Temperature 21.5, got %v", w.Temperature)
    }
    if w.Humidity != 42 {
        t.Fatalf("expected Humidity 42, got %d", w.Humidity)
    }
    if w.WindSpeed != 11.2 {
        t.Fatalf("expected WindSpeed 11.2, got %v", w.WindSpeed)
    }
    if w.Condition != "Partly cloudy" {
        t.Fatalf("expected Condition 'Partly cloudy', got %s", w.Condition)
    }
    expectedIcon := "https://cdn.weatherapi.com/weather/64x64/day/116.png"
    if w.Icon != expectedIcon {
        t.Fatalf("expected Icon %s, got %s", expectedIcon, w.Icon)
    }
    if !w.CreatedAt.Equal(now) || !w.UpdatedAt.Equal(now) {
        t.Fatalf("expected timestamps to equal provided time")
    }
}
