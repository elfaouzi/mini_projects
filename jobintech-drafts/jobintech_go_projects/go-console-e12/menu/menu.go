package menu

import (
	"fmt"
	"strings"
	. "github.com/elfaouziabdellatif/go-console-e12/weather"
)

func returnToMenu() bool {
	for {
		fmt.Print("Do you want to return to the main menu? (y/n): ")
		var response string
		fmt.Scanln(&response)
		response = strings.ToLower(strings.TrimSpace(response))
		switch response {
		case "y", "":
			return true
		case "n":
			return false
		default:
			fmt.Println("\033[33mInvalid input. Please enter 'y' or 'n'.\033[0m")
		}	
	}

	

}

func ShowMenu() {

	
	
	
	var menuText string = `
-------------
Weather App
-------------
1. Search weather by city name
2. Search weather by coordinates
3. Exit
Enter your choice: `
	

		
	for  {
		
		fmt.Print(menuText)
		var choice int
		fmt.Scanln(&choice)
		
		switch choice {
		case 1:
			var city string
			fmt.Print("Enter city name: ")
			fmt.Scanln(&city)
			SearchWeather(city)
			
			if(!returnToMenu()){
				fmt.Println("Exiting the application.")
				return
			}
		case 2:
			var lat string
			var lon string
			var coords string

			fmt.Print("Enter coordinates (lat): ")
			fmt.Scanln(&lat)
			fmt.Print("Enter coordinates (lon): ")
			fmt.Scanln(&lon)
			coords = lat + "," + lon
			SearchWeather(coords)
			
			if(!returnToMenu()){
				fmt.Println("Exiting the application.")
				return
				
			}
		case 3:
			fmt.Println("Exiting the application.")
			return
		default:
			fmt.Println("\033[31m\nInvalid choice. Please try again.\033[0m")
		}
	}

}
