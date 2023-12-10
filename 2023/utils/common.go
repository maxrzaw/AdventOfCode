package utils

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func ReadInputFile(example bool) []string {
	var file *os.File
	var err error
	if example {
		file, err = os.Open("example.txt")
	} else {
		file, err = os.Open("input.txt")
	}
	if err != nil {
		fmt.Println("Error opening file")
		os.Exit(1)
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading file")
		os.Exit(1)
	}
	return lines
}

func ParseNumbers(s string) []int {
	var numbers []int
	numberStrings := strings.Fields(s)
	for _, ns := range numberStrings {
		num, err := strconv.Atoi(ns)
		if err == nil {
			numbers = append(numbers, num)
		}
	}
	return numbers
}
