package weather

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type WeatherService struct {
	apiKey     string
	client     *mongo.Client // Injected from main
	collection *mongo.Collection
}

func NewWeatherService(client *mongo.Client) *WeatherService {
	apiKey := os.Getenv("WeatherApiKey")
	if apiKey == "" {
		panic("WeatherApiKey not set") // Handle as needed
	}

	// Use your injected client—get DB and collection
	db := client.Database("weatherdb")
	collection := db.Collection("weather")

	// Optional: Ensure unique index on City (runs once-ish)
	_, _ = collection.Indexes().CreateOne(context.TODO(), mongo.IndexModel{
		Keys:    bson.D{{Key: "city", Value: 1}},
		Options: options.Index().SetUnique(true),
	})

	return &WeatherService{
		apiKey:     apiKey,
		client:     client,
		collection: collection,
	}
}

	// BuildWeatherFromAPI maps an external API response to our internal Weather model.
	// This is a pure function (depends only on inputs) so it's easy to unit test.
	func BuildWeatherFromAPI(api WeatherAPIResponse, now time.Time) *Weather {
		return &Weather{
			City:        api.Location.Name,
			Country:     api.Location.Country,
			Temperature: api.Current.TempC,
			Condition:   api.Current.Condition.Text,
			Humidity:    api.Current.Humidity,
			WindSpeed:   api.Current.WindKph,
			Icon:        "https:" + api.Current.Condition.Icon,
			CreatedAt:   now,
			UpdatedAt:   now,
		}
	}

// Fetch: API call + build Weather + auto-save
func (s *WeatherService) Fetch(city string) (*Weather, error) {
	url := "http://api.weatherapi.com/v1/current.json?key=" + s.apiKey + "&q=" + city + "&aqi=no"
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("fetch error: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("API status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read error: %v", err)
	}

	var apiResponse WeatherAPIResponse
	if err := json.Unmarshal(body, &apiResponse); err != nil {
		return nil, fmt.Errorf("parse error: %v", err)
	}

	// Build a Weather instance from the API response using a helper so it's easy to test.
	weather := BuildWeatherFromAPI(apiResponse, time.Now())

	// Auto-save after fetch (log error but don't fail the whole op)
	if err := s.Save(weather); err != nil {
		fmt.Printf("Warning: Save failed for %s: %v\n", city, err) // Or use a logger
	}

	return weather, nil
}

// Save: Upsert to Mongo (uses injected client)
func (s *WeatherService) Save(weather *Weather) error {
	ctx := context.TODO()
	filter := bson.M{"city": weather.City}
	fmt.Println(filter)
	update := bson.M{"data": bson.M{
		"country":    weather.Country,
		"temperature": weather.Temperature,
		"condition":  weather.Condition,
		"humidity":   weather.Humidity,
		"wind_speed": weather.WindSpeed,
		"icon":       weather.Icon,
		"created_at": weather.CreatedAt,
		"updated_at": time.Now(), // Always update timestamp
	}}

	// Upsert: Insert if new, update if exists
	_, err := s.collection.UpdateOne(ctx, filter, bson.M{"$set": update}, options.UpdateOne().SetUpsert(true))
	if err != nil {
		return fmt.Errorf("save error: %v", err)
	}
	return nil
}