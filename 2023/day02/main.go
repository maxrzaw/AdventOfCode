package main

import (
	"aoc-2023/utils"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

type round struct {
	red   int
	green int
	blue  int
}

type game struct {
	id     int
	rounds []round
}

func main() {
	partOne := 0
	partTwo := 0
	lines := utils.ReadInputFile(false)
	for _, line := range lines {
		game := parseGame(line)
		if isGamePossible(game, 12, 13, 14) {
			partOne += game.id
		}
		partTwo += calculateGamePower(game)
	}
	fmt.Println("Part One:", partOne)
	fmt.Println("Part Two:", partTwo)
}

/*
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
*/

func parseGame(line string) game {
	game := game{}

	game_id_regex := regexp.MustCompile(`Game (\d+): `)
	game_id_match := game_id_regex.FindStringSubmatch(line)
	id, err := strconv.Atoi(game_id_match[1])
	if err != nil {
		panic(err)
	}
	game.id = id

	rounds_regex := regexp.MustCompile(`: (.*)`)
	rounds_match := rounds_regex.FindStringSubmatch(line)
	rounds := strings.Split(rounds_match[1], ";")
	for _, round := range rounds {
		game.rounds = append(game.rounds, parseRound(strings.TrimSpace(round)))
	}

	return game
}

func parseRound(r string) round {
	round := round{}

	blueRegex := regexp.MustCompile(`(\d+) blue`)
	blueMatch := blueRegex.FindStringSubmatch(r)
	if len(blueMatch) != 0 {
		blue, err := strconv.Atoi(blueMatch[1])
		if err != nil {
			panic(err)
		}
		round.blue = blue
	}

	redRegex := regexp.MustCompile(`(\d+) red`)
	redMatch := redRegex.FindStringSubmatch(r)
	if len(redMatch) != 0 {
		red, err := strconv.Atoi(redMatch[1])
		if err != nil {
			panic(err)
		}
		round.red = red
	}

	greenRegex := regexp.MustCompile(`(\d+) green`)
	greenMatch := greenRegex.FindStringSubmatch(r)
	if len(greenMatch) != 0 {
		green, err := strconv.Atoi(greenMatch[1])
		if err != nil {
			panic(err)
		}
		round.green = green
	}

	return round
}

func isGamePossible(game game, red int, green int, blue int) bool {
	for _, round := range game.rounds {
		if round.red > red || round.green > green || round.blue > blue {
			return false
		}
	}

	return true
}
func calculateGamePower(game game) int {
	minRed := 0
	minGreen := 0
	minBlue := 0
	for _, round := range game.rounds {
		if round.red > minRed {
			minRed = round.red
		}
		if round.green > minGreen {
			minGreen = round.green
		}
		if round.blue > minBlue {
			minBlue = round.blue
		}
	}

	return minRed * minGreen * minBlue
}
