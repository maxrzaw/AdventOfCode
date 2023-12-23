package main

import (
	"aoc-2023/utils"
	"fmt"
	"strconv"
	"strings"
)

type node struct {
	label       string
	focalLength int
	next        *node
	prev        *node
}

func main() {
	input := utils.ReadInputFile(false)
	steps := strings.Split(input[0], ",")
	sum := 0
	for _, step := range steps {
		sum += calculateHash(step)
	}
	fmt.Printf("Part One: %d\n", sum)

	boxes := make([]*node, 256)

	for _, step := range steps {
		label, operation, focalLength := "", "", 0
		var err error
		last := step[len(step)-1:]
		if last == "-" {
			operation = "-"
			label = step[:len(step)-1]
		} else {
			focalLength, err = strconv.Atoi(last)
			if err != nil {
				fmt.Println(err)
			}
			operation = "="
			label = step[:len(step)-2]
		}
		hash := calculateHash(label)
		if operation == "-" {
			removeLens(label, hash, &boxes)
		} else {
			addLens(label, hash, focalLength, &boxes)
		}
	}
	totalFocusingPower := calculateFocusingPower(&boxes)
	fmt.Printf("Part Two: %d\n", totalFocusingPower)
}

func removeLens(label string, box int, boxes *[]*node) {
	node := (*boxes)[box]
	if node == nil {
		return
	}
	if node.label == label {
		(*boxes)[box] = node.next
		return
	}
	for node != nil {
		if node.label == label {
			if node.prev != nil {
				node.prev.next = node.next
			}
			if node.next != nil {
				node.next.prev = node.prev
			}
			return
		}
		node = node.next
	}
}

func addLens(label string, box, focalLength int, boxes *[]*node) {
	n := (*boxes)[box]
	if n == nil {
		(*boxes)[box] = &node{label: label, prev: nil, next: nil, focalLength: focalLength}
		return
	}

	if n.label == label {
		n.focalLength = focalLength
		return
	}

	for n.next != nil {
		n = n.next
		if n.label == label {
			n.focalLength = focalLength
			return
		}
	}
	n.next = &node{label: label, prev: n, next: nil, focalLength: focalLength}
}

func printBoxes(boxes *[]*node) {
	for i, box := range *boxes {
		fmt.Printf("%d: ", i)
		for box != nil {
			fmt.Printf("%s ", box.label)
			box = box.next
		}
		fmt.Println()
	}
}

func calculateHash(s string) int {
	currentValue := 0
	for _, c := range s {
		// Determine the ASCII code for the current character of the string.
		asciiCode := int(c)
		// Increase the current value by the ASCII code you just determined.
		currentValue += asciiCode
		// Set the current value to itself multiplied by 17.
		currentValue *= 17
		// Set the current value to the remainder of dividing itself by 256.
		currentValue %= 256
	}
	return currentValue
}

func calculateFocusingPower(boxes *[]*node) int {
	sum := 0
	for i, box := range *boxes {
		slot := 1
		for box != nil {
			sum += (slot * (i + 1) * box.focalLength)
			slot++
			box = box.next
		}
	}
	return sum
}
