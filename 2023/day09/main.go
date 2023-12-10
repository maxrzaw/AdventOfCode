package main

import (
	"aoc-2023/utils"
	"fmt"
)

func main() {
	partOne := 0
	partTwo := 0
	lines := utils.ReadInputFile(false)

	for _, line := range lines {
		values := utils.ParseNumbers(line)
		partOneNext := reduceValues(values)

		utils.ReverseArrayInPlace(values)
		partTwoNext := reduceValues(values)
		partOne += partOneNext
		partTwo += partTwoNext
	}

	fmt.Printf("Part One: %d\n", partOne)
	fmt.Printf("Part Two: %d\n", partTwo)
}

func reduceValues(values []int) int {
	if isAllZeros(values) {
		return 0
	}

	diffs := calculateDiffs(values)

	reducedValue := reduceValues(diffs)

	lastValue := values[len(values)-1]
	return lastValue + reducedValue
}

func isAllZeros(values []int) bool {
	for _, n := range values {
		if n != 0 {
			return false
		}
	}
	return true
}

func calculateDiffs(values []int) []int {
	var diffs []int
	for i := 0; i < len(values)-1; i++ {
		diffs = append(diffs, values[i+1]-values[i])
	}
	return diffs
}
