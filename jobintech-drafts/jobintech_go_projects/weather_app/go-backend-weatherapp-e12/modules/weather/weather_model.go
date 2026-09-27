package weather

import "time"

// Main Weather model for database
type Weather struct {
    ID          uint      `json:"id" gorm:"primaryKey"`
    City        string    `json:"city" gorm:"not null"`
    Country     string    `json:"country"`
    Temperature float64   `json:"temperature"`
    Condition   string    `json:"condition"`
    Humidity    int       `json:"humidity"`
    WindSpeed   float64   `json:"wind_speed"`
    Icon        string    `json:"icon"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}

// API Response structs (only for parsing external API)
type WeatherAPIResponse struct {
    Location LocationData `json:"location"`
    Current  CurrentData  `json:"current"`
}

type LocationData struct {
    Name    string `json:"name"`
    Country string `json:"country"`
}

type CurrentData struct {
    TempC     float64       `json:"temp_c"`
    Humidity  int           `json:"humidity"`
    WindKph   float64       `json:"wind_kph"`
    Condition ConditionData `json:"condition"`
}

type ConditionData struct {
    Text string `json:"text"`
    Icon string `json:"icon"`
}