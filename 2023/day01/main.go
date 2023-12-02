package main

import (
	"aoc-2023/utils"
	"fmt"
	"strconv"
	"strings"
	"unicode"
)

func main() {
	partOne := 0
	partTwo := 0
	lines := utils.ReadInputFile(false)
	fmt.Println(lines)
	for _, line := range lines {
		partOne += recverCalibrationValuePartOne(line)
		partTwo += recverCalibrationValuePartTwo(line)
	}
	fmt.Println("Part One:", partOne)
	fmt.Println("Part Two:", partTwo)
}

func recverCalibrationValuePartOne(line string) int {
	var firstNumber string
	var lastNumber string
	for i := 0; i < len(line); i++ {
		if unicode.IsNumber(rune(line[i])) {
			firstNumber = fmt.Sprintf("%c", line[i])
			break
		}
	}
	for i := len(line) - 1; i >= 0; i-- {
		if unicode.IsNumber(rune(line[i])) {
			lastNumber = fmt.Sprintf("%c", line[i])
			break
		}
	}

	number, err := strconv.Atoi(fmt.Sprintf("%s%s", firstNumber, lastNumber))
	if err != nil {
		panic(err)
	}
	return number
}

var numbers = map[string]string{
	"1":     "1",
	"2":     "2",
	"3":     "3",
	"4":     "4",
	"5":     "5",
	"6":     "6",
	"7":     "7",
	"8":     "8",
	"9":     "9",
	"one":   "1",
	"two":   "2",
	"three": "3",
	"four":  "4",
	"five":  "5",
	"six":   "6",
	"seven": "7",
	"eight": "8",
	"nine":  "9",
}

func recverCalibrationValuePartTwo(line string) int {
	var firstNumber string
	var lastNumber string
	currentFirst := len(line)
	currentLast := -1

	for key, value := range numbers {
		firstPosition := strings.Index(line, key)
		if firstPosition != -1 && firstPosition < currentFirst {
			currentFirst = firstPosition
			firstNumber = value
		}
		lastPosition := strings.LastIndex(line, key)
		if lastPosition != -1 && lastPosition > currentLast {
			currentLast = lastPosition
			lastNumber = value
		}
	}

	number, err := strconv.Atoi(fmt.Sprintf("%s%s", firstNumber, lastNumber))
	if err != nil {
		panic(err)
	}
	return number
}
