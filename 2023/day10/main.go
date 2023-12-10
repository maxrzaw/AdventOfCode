package main

import (
	"aoc-2023/utils"
	"fmt"
)

const (
	inLoop      = 0
	isLoop      = 1
	outsideLoop = 2
)

const EXAMPLE = true

type Point struct {
	coord  Coordinate
	next   *Point
	value  string
	seen   bool
	inLoop int
}

type Coordinate struct {
	row int
	col int
}

var LEFT = Coordinate{row: 0, col: -1}
var RIGHT = Coordinate{row: 0, col: 1}
var UP = Coordinate{row: -1, col: 0}
var DOWN = Coordinate{row: 1, col: 0}

var offsetMap map[string][]Coordinate = map[string][]Coordinate{
	"S": {UP, DOWN, LEFT, RIGHT},
	"|": {UP, DOWN},
	"-": {LEFT, RIGHT},
	"L": {UP, RIGHT},
	"J": {UP, LEFT},
	"7": {DOWN, LEFT},
	"F": {DOWN, RIGHT},
}

var outsideMap map[Coordinate]bool = map[Coordinate]bool{
	LEFT:  false,
	RIGHT: false,
	UP:    false,
	DOWN:  false,
}

func main() {
	var start Coordinate
	stringGrid := utils.ReadInputGrid(EXAMPLE)
	var grid [][]Point
	for i, row := range stringGrid {
		var gridRow []Point
		for j, value := range row {
			if value == "S" {
				start = Coordinate{
					row: i,
					col: j,
				}
			}
			gridRow = append(gridRow, Point{
				coord: Coordinate{
					row: i,
					col: j,
				},
				value: value,
				seen:  false,
			})
		}
		grid = append(grid, gridRow)
	}

	path, err := findLoopPath(start, grid)
	if err != nil {
		panic(err)
	}
	partOne := fmt.Sprintf("Farthest Distance: %d", len(path)/2)
	for i, p := range path {
		grid[p.coord.row][p.coord.col].inLoop = isLoop
		if i == 0 {
			prevCoord := path[len(path)-1].coord
			grid[prevCoord.row][prevCoord.col].next = &grid[p.coord.row][p.coord.col]
		} else {
			prevCoord := path[i-1].coord
			grid[prevCoord.row][prevCoord.col].next = &grid[p.coord.row][p.coord.col]
		}
		if i == (len(path))/2 {
		}
	}

	// I didn't want to figure out how to do this so...
	if EXAMPLE {
		grid[start.row][start.col].value = "F"
	} else {
		grid[start.row][start.col].value = "J"
	}

	for _, row := range grid {
		for _, p := range row {
			if p.inLoop != isLoop {
				grid[p.coord.row][p.coord.col].value = "."
				grid[p.coord.row][p.coord.col].seen = false
			}
		}
	}

	markOutsideOrInside(Coordinate{0, 0}, grid, true)

	var first *Point = nil
	for i := range grid {
		found := false
		for j := range grid[i] {
			var p *Point = &grid[i][j]
			if p.inLoop == isLoop {
				first = &grid[p.coord.row][p.coord.col]
				found = true
				switch p.value {
				case "|":
					outsideMap[LEFT] = true
					break
				case "F":
					outsideMap[LEFT] = true
					outsideMap[UP] = true
					break
				case "L":
					outsideMap[LEFT] = true
					outsideMap[DOWN] = true
					break
				case "-":
					panic("First encounter shouldn't be a '-'")
				case "J":
					panic("First encounter shouldn't be a 'J'")
				case "7":
					panic("First encounter shouldn't be a '7'")
				}
			}
			if found {
				break
			}
		}
		if found {
			break
		}
	}
	var current *Point = first
	for current.next != first {
		if current.value == "S" {
			break
		}

		updateOutsideMap(current, current.next)

		markSurroundings(current, grid)

		current = current.next
	}

	count := 0
	for _, row := range grid {
		for _, p := range row {
			fmt.Print(p.value)
			if p.value == "֍" {
				count++
			}
		}
		fmt.Printf("\n")
	}

	fmt.Println(partOne)
	fmt.Printf("Total Enclosed Area: %d\n", count)
}

func markSurroundings(current *Point, grid [][]Point) {
	for _, o := range offsetMap["S"] {
		next, ok := addCoordinate(current.coord, o, grid)
		if !ok {
			continue
		}
		if grid[next.row][next.col].value == "." {
			var outside bool
			outside = outsideMap[o]
			markOutsideOrInside(next, grid, outside)
		}
	}
}

func updateOutsideMap(current, next *Point) {
	if next.value == current.value {
		// do nothing because this can only happen when they are both horizontal or vertical pipes
		if current.value != "|" && current.value != "-" {
			panic("this should only happen when they are both horizontal or vertical pipes")
		}
		return
	}

	left, right, up, down := outsideMap[LEFT], outsideMap[RIGHT], outsideMap[UP], outsideMap[DOWN]

	if isStraightPipe(current) {
		if current.value == "|" && left && right {
			panic("Both sides of a straight pipe should not be outside")
		}
		if current.value == "|" && !left && !right {
			panic("Both sides of a straight pipe should not be inside")
		}
		if current.value == "-" && up && down {
			panic("Both sides of a straight pipe should not be outside")
		}
		if current.value == "-" && !up && !down {
			panic("Both sides of a straight pipe should not be inside")
		}
	}

	if false {
		// juset for formatting
	} else if current.value == "|" && next.value == "L" {
		outsideMap[DOWN] = left
		outsideMap[LEFT] = left
		outsideMap[UP] = !left
		outsideMap[RIGHT] = !left
	} else if current.value == "|" && next.value == "J" {
		outsideMap[DOWN] = !left
		outsideMap[LEFT] = left
		outsideMap[UP] = left
		outsideMap[RIGHT] = !left
	} else if current.value == "|" && next.value == "F" {
		outsideMap[DOWN] = !left
		outsideMap[LEFT] = left
		outsideMap[UP] = left
		outsideMap[RIGHT] = !left
	} else if current.value == "|" && next.value == "7" {
		outsideMap[DOWN] = left
		outsideMap[LEFT] = left
		outsideMap[UP] = !left
		outsideMap[RIGHT] = !left
	} else if current.value == "-" && next.value == "L" {
		outsideMap[DOWN] = !up
		outsideMap[LEFT] = !up
		outsideMap[UP] = up
		outsideMap[RIGHT] = up
	} else if current.value == "-" && next.value == "J" {
		outsideMap[DOWN] = !up
		outsideMap[LEFT] = up
		outsideMap[UP] = up
		outsideMap[RIGHT] = !up
	} else if current.value == "-" && next.value == "F" {
		outsideMap[DOWN] = !up
		outsideMap[LEFT] = up
		outsideMap[UP] = up
		outsideMap[RIGHT] = !up
	} else if current.value == "-" && next.value == "7" {
		outsideMap[DOWN] = !up
		outsideMap[LEFT] = !up
		outsideMap[UP] = up
		outsideMap[RIGHT] = up
	} else if current.value == "F" && next.value == "|" {
		outsideMap[DOWN] = !up
		outsideMap[LEFT] = up
		outsideMap[UP] = !up
		outsideMap[RIGHT] = !up
	} else if current.value == "F" && next.value == "-" {
		outsideMap[DOWN] = !up
		outsideMap[LEFT] = !up
		outsideMap[UP] = up
		outsideMap[RIGHT] = !up
	} else if current.value == "F" && next.value == "L" {
		outsideMap[DOWN] = left
		outsideMap[LEFT] = left
		outsideMap[UP] = !left
		outsideMap[RIGHT] = !left
	} else if current.value == "F" && next.value == "7" {
		outsideMap[DOWN] = !up
		outsideMap[LEFT] = !up
		outsideMap[UP] = up
		outsideMap[RIGHT] = up
	} else if current.value == "F" && next.value == "J" {
		// No changes???
	} else if current.value == "J" && next.value == "|" {
		outsideMap[DOWN] = !right
		outsideMap[LEFT] = !right
		outsideMap[UP] = !right
		outsideMap[RIGHT] = right
	} else if current.value == "J" && next.value == "-" {
		outsideMap[DOWN] = down
		outsideMap[LEFT] = !down
		outsideMap[UP] = !down
		outsideMap[RIGHT] = !down
	} else if current.value == "J" && next.value == "L" {
		outsideMap[DOWN] = down
		outsideMap[LEFT] = down
		outsideMap[UP] = !down
		outsideMap[RIGHT] = !down
	} else if current.value == "J" && next.value == "7" {
		outsideMap[DOWN] = !right
		outsideMap[LEFT] = !right
		outsideMap[UP] = right
		outsideMap[RIGHT] = right
	} else if current.value == "J" && next.value == "F" {
		// No changes???
	} else if current.value == "L" && next.value == "F" {
		outsideMap[DOWN] = !left
		outsideMap[LEFT] = left
		outsideMap[UP] = left
		outsideMap[RIGHT] = !left
	} else if current.value == "L" && next.value == "|" {
		outsideMap[DOWN] = left
		outsideMap[LEFT] = left
		outsideMap[UP] = !left
		outsideMap[RIGHT] = !left
	} else if current.value == "L" && next.value == "-" {
		outsideMap[DOWN] = down
		outsideMap[LEFT] = !down
		outsideMap[UP] = !down
		outsideMap[RIGHT] = !down
	} else if current.value == "L" && next.value == "J" {
		outsideMap[DOWN] = down
		outsideMap[LEFT] = !down
		outsideMap[UP] = !down
		outsideMap[RIGHT] = down
	} else if current.value == "L" && next.value == "7" {
		// No changes???
	} else if current.value == "7" && next.value == "F" {
		outsideMap[DOWN] = !up
		outsideMap[LEFT] = up
		outsideMap[UP] = up
		outsideMap[RIGHT] = !up
	} else if current.value == "7" && next.value == "|" {
		outsideMap[DOWN] = !right
		outsideMap[LEFT] = !right
		outsideMap[UP] = !right
		outsideMap[RIGHT] = right
	} else if current.value == "7" && next.value == "-" {
		outsideMap[DOWN] = !up
		outsideMap[LEFT] = !up
		outsideMap[UP] = up
		outsideMap[RIGHT] = !up
	} else if current.value == "7" && next.value == "J" {
		outsideMap[DOWN] = right
		outsideMap[LEFT] = !right
		outsideMap[UP] = !right
		outsideMap[RIGHT] = right
	} else if current.value == "7" && next.value == "L" {
		// No changes???
	} else if next.value == "S" {
		// We reached the end
		fmt.Printf("Current: %s and Next: %s is not supported\n", current.value, next.value)
	} else {
		fmt.Printf("Current: %s and Next: %s is not supported\n", current.value, next.value)
		panic("You are missing something")
	}
}

func isStraightPipe(p *Point) bool {
	return p.value == "|" || p.value == "-"
}

func findLoopPath(start Coordinate, grid [][]Point) ([]Point, error) {
	var path []Point
	if grid[start.row][start.col].value != "S" {
		panic("Start position is not \"S\"")
	}
	// Do a DFS search to find my way back to the start and that will give me the path
	path, err := search(start, Coordinate{-1, -1}, grid)
	if err != nil {
		return nil, err
	}
	return path, nil
}

func addCoordinate(a, b Coordinate, grid [][]Point) (Coordinate, bool) {

	row := a.row + b.row
	col := a.col + b.col

	next := Coordinate{row, col}

	if row < 0 || row >= len(grid) {
		return next, false
	}

	if col < 0 || col >= len(grid[0]) {
		return next, false
	}

	return next, true
}

func search(current, prev Coordinate, grid [][]Point) ([]Point, error) {
	curr := grid[current.row][current.col]
	grid[current.row][current.col].seen = true
	canGetToPrev := false
	if curr.value == "S" {
		// This is the starting point so we don't need to get to previous
		canGetToPrev = true
	}
	for _, o := range offsetMap[curr.value] {
		next, ok := addCoordinate(current, o, grid)
		if !ok {
			continue
		}
		if next.col == prev.col && next.row == prev.row {
			canGetToPrev = true
		} else if grid[next.row][next.col].value == "S" {
			// Return if we can get to the start again and start wasn't the previous
			path := []Point{curr}
			return path, nil // Base Case
		}
	}
	if !canGetToPrev {
		fmt.Println("Could not get to previous??")
		return nil, fmt.Errorf("Cannot get to previous from %v", curr)
	}

	for i, o := range offsetMap[curr.value] {
		next, ok := addCoordinate(current, o, grid)
		if !ok {
			continue
		}
		if grid[next.row][next.col].seen {
			// We have already seen this one so we can skip
			continue
		}
		path, err := search(next, current, grid)
		if err == nil {
			path = append(path, curr)
			return path, nil // Recursive Case
		}
		fmt.Println(i)
	}
	return nil, fmt.Errorf("Could not find a suitable path from %v", curr)
}

func markOutsideOrInside(current Coordinate, grid [][]Point, outside bool) {
	curr := grid[current.row][current.col]
	if curr.seen {
		return
	}
	if curr.inLoop == isLoop {
		return
	}

	grid[curr.coord.row][curr.coord.col].seen = true

	if outside {
		grid[curr.coord.row][curr.coord.col].value = " "
		grid[curr.coord.row][curr.coord.col].inLoop = outsideLoop
	} else {
		grid[curr.coord.row][curr.coord.col].inLoop = inLoop
		grid[curr.coord.row][curr.coord.col].value = "֍"
	}

	for _, o := range offsetMap["S"] {
		next, ok := addCoordinate(current, o, grid)
		if !ok {
			continue
		}
		markOutsideOrInside(next, grid, outside)
	}
}
