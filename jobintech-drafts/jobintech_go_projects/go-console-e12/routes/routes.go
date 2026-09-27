package routes
import (
	"github.com/gin-gonic/gin"
)

func WeatherRoutes(router *gin.Engine){
	// router.GET("/weather/city/:city", getWeatherByCity)
	// router.GET("/weather/coords", getWeatherByCoordinates)	
	router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

}