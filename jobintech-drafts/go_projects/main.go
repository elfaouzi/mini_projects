package main

import (
	"net/http"
	"fmt"
	"io"
	"log"
)

func main() {
	resp, err := http.Get("http://api.weatherapi.com/v1/current.json?key=17b1a4327295454dbaf104104252609&q=London&aqi=yes")
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()
    if resp.StatusCode == http.StatusOK {
    bodyBytes, err := io.ReadAll(resp.Body)
    if err != nil {
        log.Fatal(err)
    }
	bodyString := string(bodyBytes)
	fmt.Println(bodyString)
}

	
}

