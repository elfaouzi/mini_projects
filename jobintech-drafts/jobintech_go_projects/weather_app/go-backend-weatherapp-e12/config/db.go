package config

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv" // For loading .env
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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
    // Client options (v1 driver)
    opts := options.Client().ApplyURI(uri)

    // Create a context
    ctx := context.TODO()

    // Connect
    client, err := mongo.Connect(ctx, opts)
    if err != nil {
        log.Fatal("MongoDB connection error: ", err)
    }

    // Ping to verify connection
    var result bson.M
    if err := client.Database("weatherdb").RunCommand(ctx, bson.D{{Key: "ping", Value: 1}}).Decode(&result); err != nil {
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