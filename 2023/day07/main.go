package main

import (
	"aoc-2023/utils"
	"fmt"
	"sort"
	"strconv"
	"strings"
)

type Hand struct {
	cards []string
	bid   int
	kind  int
}

const (
	fiveOfAKind  int = 6
	fourOfAKind  int = 5
	fullHouse    int = 4
	threeOfAKind int = 3
	twoPair      int = 2
	onePair      int = 1
	highCard     int = 0
)

var cardRank map[string]int = map[string]int{
	"A": 14,
	"K": 13,
	"Q": 12,
	"J": 0, // Put this back to an 11 for Part One
	"T": 10,
	"9": 9,
	"8": 8,
	"7": 7,
	"6": 6,
	"5": 5,
	"4": 4,
	"3": 3,
	"2": 2,
}

type SortByHand []Hand

func (a SortByHand) Len() int           { return len(a) }
func (a SortByHand) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a SortByHand) Less(i, j int) bool { return HandLess(a[i], a[j]) }

// returns true if a < b
func HandLess(a, b Hand) bool {
	// Type of hand
	if a.kind < b.kind {
		return true
	}
	if b.kind < a.kind {
		return false
	}
	// Higher Card
	for i := 0; i < len(a.cards); i++ {
		aVal := cardRank[a.cards[i]]
		bVal := cardRank[b.cards[i]]
		if aVal < bVal {
			return true
		} else if bVal < aVal {
			return false
		}
	}
	fmt.Println("Same exact hand???")
	return false
}

func getKindWithJokers(hand string) int {
	var cards map[string]int = map[string]int{}
	for _, card := range strings.Split(hand, "") {
		val, ok := cards[card]
		if ok {
			cards[card] = val + 1
		} else {
			cards[card] = 1
		}
	}

	jokers := cards["J"]
	// Remove the Jokers during counting
	cards["J"] = 0

	highest, secondHighest := 0, 0
	for _, count := range cards {
		if count >= highest {
			secondHighest = highest
			highest = count
		} else if count >= secondHighest {
			secondHighest = count
		}
	}

	if highest == 5 || (highest+jokers == 5) {
		return fiveOfAKind
	} else if highest == 4 || (highest+jokers == 4) {
		return fourOfAKind
	} else if (highest == 3 && secondHighest == 2) || (jokers == 1 && highest == 2 && secondHighest == 2) {
		return fullHouse
	} else if highest == 3 || (jokers+highest == 3) {
		if jokers > 1 && highest > 1 {
			panic("You should never go for three of a kind when you could do better")
		}
		return threeOfAKind
	} else if highest == 2 && secondHighest == 2 {
		if jokers > 0 {
			panic("You should never go for two pair when you have a joker")
		}
		return twoPair
	} else if (highest == 2 && secondHighest == 1) || (jokers == 1 && highest == 1) {
		return onePair
	} else {
		return highCard
	}
}

func getKind(hand string) int {
	var cards map[string]int = map[string]int{}
	for _, card := range strings.Split(hand, "") {
		val, ok := cards[card]
		if ok {
			cards[card] = val + 1
		} else {
			cards[card] = 1
		}
	}

	highest, secondHighest := 0, 0
	for _, count := range cards {
		if count >= highest {
			secondHighest = highest
			highest = count
		} else if count >= secondHighest {
			secondHighest = count
		}
	}
	// fmt.Println(cards, highest, secondHighest)

	if highest == 5 {
		return fiveOfAKind
	} else if highest == 4 {
		return fourOfAKind
	} else if highest == 3 && secondHighest == 2 {
		return fullHouse
	} else if highest == 3 {
		return threeOfAKind
	} else if highest == 2 && secondHighest == 2 {
		return twoPair
	} else if highest == 2 && secondHighest == 1 {
		return onePair
	} else {
		return highCard
	}
}

func main() {
	partOne := 0
	partTwo := 0

	lines := utils.ReadInputFile(false)
	var partOneHands []Hand
	var partTwoHands []Hand
	for _, line := range lines {
		split := strings.Fields(line)
		bid, err := strconv.Atoi(split[1])
		if err != nil {
			panic("Issue parsing hands")
		}

		partOneHand := Hand{
			kind:  getKind(split[0]),
			cards: strings.Split(split[0], ""),
			bid:   bid,
		}
		partTwoHand := Hand{
			kind:  getKindWithJokers(split[0]),
			cards: strings.Split(split[0], ""),
			bid:   bid,
		}

		partOneHands = append(partOneHands, partOneHand)
		partTwoHands = append(partTwoHands, partTwoHand)
	}
	sort.Sort(SortByHand(partOneHands))
	sort.Sort(SortByHand(partTwoHands))

	for i, hand := range partTwoHands {
		partTwo += (hand.bid * (i + 1))
	}

	for i, hand := range partOneHands {
		partOne += (hand.bid * (i + 1))
	}

	fmt.Printf("Part One: %d\nPart Two: %d\n", partOne, partTwo)
}
