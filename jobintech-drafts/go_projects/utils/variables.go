package utils
import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func detectType(input string) string {
	input = strings.TrimSpace(input)
	// Try int
	if _, err := strconv.Atoi(input); err == nil {
		return "int"
	}
	// Try float
	if _, err := strconv.ParseFloat(input, 64); err == nil {
		return "float"
	}
	// Try bool
	lower := strings.ToLower(input)
	if lower == "true" || lower == "false" {
		return "bool"
	}
	return "string"
}

func DetectInputType() {
	scanner := bufio.NewScanner(os.Stdin)
	fmt.Print("Enter a value: ")
	if scanner.Scan() {
		text := scanner.Text()
		typ := detectType(text)
		fmt.Printf("You entered: %s\nType detected: %s\n", text, typ)
	}
}

