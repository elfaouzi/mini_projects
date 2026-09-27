package weather

import (
	"github.com/gin-gonic/gin"
)

func WeatherRoutes(router *gin.Engine) *gin.RouterGroup{
	
	v1 := router.Group("/api/v1")
	{
		v1.GET("/city/:city", GetWeatherByCity )
	}
	
return v1
	

	
}