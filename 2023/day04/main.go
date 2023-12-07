package main

import (
	"aoc-2023/utils"
	"fmt"
	"math"
	"regexp"
	"strings"
)

func main() {
	var partOne uint64 = 0
	partTwo := 0
	lines := utils.ReadInputFile(false)
	cardRegex := regexp.MustCompile(`Card\s+\d+: (.+) \| (.+)`)

	cards := make([]int, len(lines))
	for i := range cards {
		cards[i] = 1
	}

	for index, card := range lines {
		cardMatches := 0

		if matches := cardRegex.FindStringSubmatch(card); len(matches) == 3 {

			winningNumbersMap := map[string]bool{}

			winningNumberStrings := strings.Fields(matches[1])
			myNumberStrings := strings.Fields(matches[2])

			for _, field := range winningNumberStrings {
				winningNumbersMap[field] = true
			}

			for _, field := range myNumberStrings {
				found := winningNumbersMap[field]
				if found {
					cardMatches++
				}
			}
		}

		if cardMatches > 0 {
			partOne += uint64(math.Pow(2, float64(cardMatches-1)))
		}

		for i := 0; i < cardMatches; i++ {
			cards[index+i+1] += cards[index]
		}
	}

	for _, s := range cards {
		partTwo += s
	}

	fmt.Printf("Part One: %d\nPart Two: %d\n", partOne, partTwo)
}
