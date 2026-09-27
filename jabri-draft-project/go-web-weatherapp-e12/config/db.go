package config

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv" // For loading .env
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Config struct {
	MongoURI string
	// Add more later, like WeatherAPIKey
}

func LoadConfig() *Config {
	// Load .env if it exists
	_ = godotenv.Load() // Ignores errors if no .env

	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("You must set your 'MONGODB_URI' environment variable. See https://docs.mongodb.com/drivers/go/current/usage-examples/")
	}

	return &Config{
		MongoURI: uri,
	}
}

func ConnectDB(uri string) *mongo.Client {
	// Set Stable API version to 1 (good practice for v2)
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)

	// Client options
	opts := options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPI)

	// Connect
	client, err := mongo.Connect(opts)
	if err != nil {
		log.Fatal("MongoDB connection error: ", err) // Use log.Fatal for server
	}

	// Ping to verify (uses "weatherdb" as in your code—DB auto-creates later)
	var result bson.M
	if err := client.Database("weatherdb").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Decode(&result); err != nil {
		log.Fatal("MongoDB ping error: ", err)
	}

	log.Println("Connected to MongoDB! Pinged weatherdb successfully.")
	return client
}

// Graceful shutdown helper (call this at end of main.go)
func DisconnectDB(client *mongo.Client) {
	if err := client.Disconnect(context.TODO()); err != nil {
		log.Println("MongoDB disconnect error: ", err)
	}
}