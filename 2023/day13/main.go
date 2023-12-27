package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	grids := readGrids(false)

	partOne := 0
	partTwo := 0

	for _, grid := range grids {
		verticalReflection, verticalSmudgeReflection := findVerticalReflection(grid)
		horizontalReflection, horizontalSmudgeReflection := findHorizontalReflection(grid)

		var summary int
		if verticalReflection > horizontalReflection {
			summary = verticalReflection
		}
		if horizontalReflection > verticalReflection {
			summary = (horizontalReflection * 100)
		}
		partOne += summary

		var smudgeSummary int
		if verticalSmudgeReflection > horizontalSmudgeReflection {
			smudgeSummary = verticalSmudgeReflection
		}
		if horizontalSmudgeReflection > verticalSmudgeReflection {
			smudgeSummary = (horizontalSmudgeReflection * 100)
		}
		partTwo += smudgeSummary
	}
	fmt.Println("Part 1:", partOne)
	fmt.Println("Part 2:", partTwo)
}

func compareRows(a, b int, grid [][]string) int {
	differences := 0
	for i := 0; i < len(grid[a]); i++ {
		if grid[a][i] != grid[b][i] {
			differences++
		}
	}
	return differences
}

func compareColumns(a, b int, grid [][]string) int {
	differences := 0
	for i := 0; i < len(grid); i++ {
		if grid[i][a] != grid[i][b] {
			differences++
		}
	}
	return differences
}

func findVerticalReflection(grid [][]string) (int, int) {
	currentBest := -1
	smudgeBest := -1
	for i := 0; i < len(grid[0])-1; i++ {
		differences := countVerticalDifferences(i, grid)
		score := -1
		if differences == 0 {
			score = i + 1
			if score > currentBest {
				currentBest = score
			}
		}
		if differences == 1 {
			score = i + 1
			if score > smudgeBest {
				smudgeBest = score
			}
		}
	}
	return currentBest, smudgeBest
}

func findHorizontalReflection(grid [][]string) (int, int) {
	currentBest := -1
	smudgeBest := -1
	for i := 0; i < len(grid)-1; i++ {
		differences := countHorizontalDifferences(i, grid)
		score := -1
		if differences == 0 {
			score = i + 1
			if score > currentBest {
				currentBest = score
			}
		}
		if differences == 1 {
			score = i + 1
			if score > smudgeBest {
				smudgeBest = score
			}
		}
	}
	return currentBest, smudgeBest
}

func countVerticalDifferences(left int, grid [][]string) int {
	l := left
	r := left + 1
	differences := 0
	for l >= 0 && r < len(grid[0]) {
		differences += compareColumns(l, r, grid)
		l--
		r++
	}
	return differences
}

func countHorizontalDifferences(top int, grid [][]string) int {
	t := top
	b := top + 1
	differences := 0
	for t >= 0 && b < len(grid) {
		differences += compareRows(t, b, grid)
		t--
		b++
	}
	return differences
}

func createGrid(input []string) [][]string {
	var grid [][]string
	for _, line := range input {
		grid = append(grid, strings.Split(line, ""))
	}
	return grid
}

func readGrids(example bool) [][][]string {
	var grids [][][]string

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
	scanner := bufio.NewScanner(file)
	var currentGrid []string

	for scanner.Scan() {
		line := scanner.Text()

		if line == "" {
			// Empty line indicates the end of the current grid
			if len(currentGrid) > 0 {
				grids = append(grids, createGrid(currentGrid))
				currentGrid = nil
			}
		} else {
			// Append the line to the current grid
			currentGrid = append(currentGrid, line)
		}
	}

	// Append the last grid if it exists
	if len(currentGrid) > 0 {
		grids = append(grids, createGrid(currentGrid))
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading input:", err)
	}

	return grids
}
