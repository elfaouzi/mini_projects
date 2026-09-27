package weather

import (
	"github.com/gin-gonic/gin"
	"github.com/elfaouziabdellatif/go-web-weatherapp-e12/config"

)


func GetWeatherByCity(c *gin.Context)  {

	city  := c.Param("city")
	if city == "" {
		c.JSON(400,gin.H{
			"message" : "city parameter is required",
		})
		return
		
	}
	
	cfg := config.LoadConfig()
	client := config.ConnectDB(cfg.MongoURI)
	defer config.DisconnectDB(client)
	service := NewWeatherService(client)
	weather, err := service.Fetch(city)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}


    c.JSON(200, gin.H{
			"data": weather,
		})

}

