package weather

import (
	"encoding/json"
	"testing"
)

// Simple test to ensure the API response JSON maps correctly to our structs.
func TestWeatherAPIResponseUnmarshal(t *testing.T) {
    sample := `{
        "location": {
            "name": "TestCity",
            "country": "TestLand"
        },
        "current": {
            "temp_c": 12.34,
            "humidity": 56,
            "wind_kph": 7.89,
            "condition": {
                "text": "Sunny",
                "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
            }
        }
    }`

    var resp WeatherAPIResponse
    if err := json.Unmarshal([]byte(sample), &resp); err != nil {
        t.Fatalf("failed to unmarshal sample JSON: %v", err)
    }

    if resp.Location.Name != "TestCity" {
        t.Fatalf("expected Location.Name TestCity, got %s", resp.Location.Name)
    }
    if resp.Location.Country != "TestLand" {
        t.Fatalf("expected Location.Country TestLand, got %s", resp.Location.Country)
    }
    if resp.Current.TempC != 12.34 {
        t.Fatalf("expected TempC 12.34, got %v", resp.Current.TempC)
    }
    if resp.Current.Humidity != 56 {
        t.Fatalf("expected Humidity 56, got %d", resp.Current.Humidity)
    }
    if resp.Current.Condition.Text != "Sunny" {
        t.Fatalf("expected Condition.Text Sunny, got %s", resp.Current.Condition.Text)
    }
    if resp.Current.Condition.Icon != "//cdn.weatherapi.com/weather/64x64/day/113.png" {
        t.Fatalf("expected Condition.Icon to match, got %s", resp.Current.Condition.Icon)
    }
}
