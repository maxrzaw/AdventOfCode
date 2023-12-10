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

func ReadInputGrid(example bool) [][]string {
	lines := ReadInputFile(example)
	var grid [][]string
	for _, line := range lines {
		row := strings.Split(line, "")
		grid = append(grid, row)
	}
	return grid
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

func ReverseArrayCopy[T any](arr []T) []T {
	var result []T
	for i := len(arr) - 1; i >= 0; i-- {
		result = append(result, arr[i])
	}
	return result
}

func ReverseArrayInPlace[T any](arr []T) {
	for i, j := 0, len(arr)-1; i < j; i, j = i+1, j-1 {
		arr[i], arr[j] = arr[j], arr[i]
	}
}
