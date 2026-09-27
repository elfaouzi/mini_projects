package main

import (
	"github.com/elfaouziabdellatif/go-web-weatherapp-e12/modules/weather"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"time"
)

func main() {

	
	app := gin.Default()
	
	
	app.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"*"},  
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        MaxAge:           12 * time.Hour,  
    }))
	

	// Register weather routes
	weather.WeatherRoutes(app)
	
	
	// Start server on port 8080
	app.Run("0.0.0.0:8080")

}

