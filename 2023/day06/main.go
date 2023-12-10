package main

import (
	"aoc-2023/utils"
	"fmt"
	"strconv"
	"strings"
)

type Race struct {
	time     int
	distance int
}

func main() {
	partOne := 1

	lines := utils.ReadInputFile(true)

	partOneTimes := strings.Fields(lines[0])
	partTwoDistances := strings.Fields(lines[1])

	var races []Race

	for i := 1; i < len(partOneTimes); i++ {
		time, err := strconv.Atoi(partOneTimes[i])
		distance, err := strconv.Atoi(partTwoDistances[i])
		if err != nil {
			panic("Error parsing the races")
		}
		races = append(races, Race{
			time:     time,
			distance: distance,
		})
	}

	for _, race := range races {
		wins := countWins(race)
		partOne = partOne * wins
	}

	fmt.Printf("Part One: %d\n\n", partOne)

	timePartTwo, err := strconv.Atoi(strings.Split(strings.ReplaceAll(lines[0], " ", ""), ":")[1])
	if err != nil {
		panic("Error parsing time for part two")
	}
	distancePartTwo, err := strconv.Atoi(strings.Split(strings.ReplaceAll(lines[1], " ", ""), ":")[1])
	if err != nil {
		panic("Error parsing distance for part two")
	}

	fmt.Printf("Part Two:\nTime: %d\nDistance: %d\n", timePartTwo, distancePartTwo)

	partTwo := countWins(Race{time: timePartTwo, distance: distancePartTwo})

	fmt.Printf("Part Two Wins: %d\n", partTwo)
}

func countWins(race Race) int {
	wins := 0
	for i := 0; i < race.time; i++ {
		if isWin(race, i) {
			wins++
		}
	}
	return wins
}

func isWin(race Race, t int) bool {
	remainingTime := race.time - t
	return remainingTime*t > race.distance
}
