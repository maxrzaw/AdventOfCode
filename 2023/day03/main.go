package main

import (
	"aoc-2023/utils"
	"fmt"
	"strconv"
)

func main() {
	grid := utils.ReadInputFile(false)
	partOneTotal := 0
	partTwoTotal := 0
	for i := 0; i < len(grid); i++ {
		partOneTotal += processLinePartOne(i, grid)
		partTwoTotal += processLinePartTwo(i, grid)
	}
	fmt.Println(partOneTotal)
	fmt.Println(partTwoTotal)
}

func isOnGrid(row, col int, grid []string) bool {
	if row < 0 || row >= len(grid) || col < 0 || col >= len(grid[0]) {
		return false
	}
	return true
}
func isSymbol(row, col int, grid []string) bool {
	if !isOnGrid(row, col, grid) {
		return false
	}
	char := string(grid[row][col])
	if char != "." && !isDigit(row, col, grid) {
		return true
	}
	return false
}

func isShaft(row, col int, grid []string) bool {
	if !isOnGrid(row, col, grid) {
		return false
	}
	char := string(grid[row][col])
	if char == "*" {
		return true
	}
	return false
}

func isDigit(row, col int, grid []string) bool {
	if !isOnGrid(row, col, grid) {
		return false
	}
	char := string(grid[row][col])
	if char >= "0" && char <= "9" {
		return true
	}
	return false
}

func shaftAdjacentNumberCount(row, col int, grid []string) int {
	numberCount := 0
	for i := row - 1; i <= row+1; i++ {
		digitCount := 0
		for j := col - 1; j <= col+1; j++ {
			if isDigit(i, j, grid) {
				digitCount++
			}
		}

		if digitCount > 1 && isDigit(i, col, grid) {
			numberCount++
		} else {
			numberCount += digitCount
		}
	}
	return numberCount
}

func isGear(row, col int, grid []string) bool {
	if !isOnGrid(row, col, grid) {
		return false
	}
	if isShaft(row, col, grid) && shaftAdjacentNumberCount(row, col, grid) == 2 {
		return true
	}
	return false
}

func isDigitAdjacentToSymbol(row, col int, grid []string) bool {
	for i := row - 1; i <= row+1; i++ {
		for j := col - 1; j <= col+1; j++ {
			if isSymbol(i, j, grid) {
				return true
			}
		}
	}
	return false
}

func isNumberAdjacentToSymbol(row, col_start int, grid []string) bool {
	for col := col_start; col < len(grid[0]); col++ {
		if isDigit(row, col, grid) {
			if isDigitAdjacentToSymbol(row, col, grid) {
				return true
			}
		} else {
			return false
		}
	}
	return false
}

func parseNumber(row, col int, grid []string) int {
	number := ""
	for i := col; i < len(grid[0]); i++ {
		if isDigit(row, i, grid) {
			number = number + string(grid[row][i])
		} else {
			break
		}
	}
	num, err := strconv.Atoi(number)
	if err != nil {
		panic(err)
	}
	return num
}

func getNumber(row, col int, grid []string) int {
	for i := col; i >= 0; i-- {
		if isDigit(row, i, grid) {
			if i == 0 {
				return parseNumber(row, i, grid)
			}
			continue
		} else {
			return parseNumber(row, i+1, grid)
		}
	}
	panic("start of number not found")
}
func calculateGearRatio(row, col int, grid []string) int {
	numberOne := 0
	numberTwo := 0
	for i := row - 1; i <= row+1; i++ {
		for j := col - 1; j <= col+1; j++ {
			if isDigit(i, j, grid) {
				if numberOne == 0 {
					numberOne = getNumber(i, j, grid)
				} else {
					numberTwo = getNumber(i, j, grid)
				}
			}
		}
	}
	if numberOne == 0 || numberTwo == 0 {
		panic("number not found")
	}
	return numberOne * numberTwo
}

func printSurroundings(row, col int, grid []string, radius int) {
	for i := row - radius; i <= row+radius; i++ {
		for j := col - radius; j <= col+radius; j++ {
			if isOnGrid(i, j, grid) {
				fmt.Print(string(grid[i][j]))
			} else {
				fmt.Print("|")
			}
		}
		fmt.Println()
	}
	fmt.Println()
}

func processLinePartOne(row int, grid []string) int {
	sum := 0
	inNumber := false
	for col := 0; col < len(grid[0]); col++ {
		if isDigit(row, col, grid) {
			if inNumber {
				continue
			}
			inNumber = true
			if isNumberAdjacentToSymbol(row, col, grid) {
				sum += parseNumber(row, col, grid)
			}
		} else {
			inNumber = false
		}
	}
	return sum
}
func processLinePartTwo(row int, grid []string) int {
	sum := 0
	for col := 0; col < len(grid[0]); col++ {
		if isGear(row, col, grid) {
			sum += calculateGearRatio(row, col, grid)
		}
	}
	return sum
}
