package main

import (
	"aoc-2023/utils"
	"fmt"
)

type Galaxy struct {
	Row, Col int
}

func main() {
	grid := utils.ReadInputGrid(false)
	utils.PrintGrid(grid)

	var emptyRows []int
	for i, row := range grid {
		empty := true
		for _, p := range row {
			if p != "." {
				empty = false
			}
		}
		if empty {
			emptyRows = append(emptyRows, i)
		}
	}

	var emptyCols []int
	for i := range grid[0] {
		empty := true
		for _, row := range grid {
			if row[i] != "." {
				empty = false
			}
		}
		if empty {
			emptyCols = append(emptyCols, i)
		}
	}

	fmt.Printf("Empty Rows:\t%v\nEmpty Columns:\t%v\n", emptyRows, emptyCols)

	partOneGalaxies := createGalaxies(grid, emptyRows, emptyCols, 2)
	partOne := calculateSumOfDistances(partOneGalaxies)
	fmt.Printf("Part One: %d\n", partOne)

	partTwoGalaxies := createGalaxies(grid, emptyRows, emptyCols, 1000000)
	partTwo := calculateSumOfDistances(partTwoGalaxies)
	fmt.Printf("Part Two: %d\n", partTwo)
}

func createGalaxies(grid [][]string, emptyRows, emptyColumns []int, expansionFactor int) []Galaxy {
	var galaxies []Galaxy
	rowOffset := 0
	for i, row := range grid {
		if utils.Contains(i, emptyRows) {
			rowOffset++
			continue
		}
		columnOffset := 0
		for j, value := range row {
			if utils.Contains(j, emptyColumns) {
				columnOffset++
				continue
			}
			if value == "#" {
				galaxies = append(galaxies, Galaxy{
					Row: i + rowOffset*(expansionFactor-1),
					Col: j + columnOffset*(expansionFactor-1),
				})
			}
		}
	}
	return galaxies
}

func distance(g1, g2 Galaxy) int {
	deltaRow := g2.Row - g1.Row
	deltaColumn := g2.Col - g1.Col

	if deltaRow < 0 {
		deltaRow = -deltaRow
	}
	if deltaColumn < 0 {
		deltaColumn = -deltaColumn
	}

	return deltaRow + deltaColumn
}

func calculateSumOfDistances(galaxies []Galaxy) int {
	sum := 0
	for i := range galaxies {
		for j := range galaxies {
			if i < j {
				d := distance(galaxies[i], galaxies[j])
				sum += d
			}
		}
	}
	return sum
}
