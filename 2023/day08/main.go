package main

import (
	"aoc-2023/utils"
	"fmt"
	"strings"
)

type Node struct {
	value string
	left  string
	right string
}

type Ghost struct {
	start   string
	current string
	done    bool
	finish  int
}

func parseNode(line string) Node {
	fields := strings.Fields(line)
	return Node{
		value: fields[0],
		left:  fields[2][1:4],
		right: fields[3][:3],
	}
}

func main() {
	partOne(false)
	partTwo(false)
}
func partOne(example bool) {
	fmt.Println("Part One:")
	lines := utils.ReadInputFile(example)
	instructions := strings.Split(lines[0], "")

	var nodes map[string]Node = map[string]Node{}

	nodeLines := lines[2:]
	for _, nodeLine := range nodeLines {
		node := parseNode(nodeLine)
		nodes[node.value] = node
	}

	var curr Node = nodes["AAA"]
	for i := 0; ; i++ {
		if curr.value == "ZZZ" {
			fmt.Printf("Found ZZZ after %d iterations\n", i)
			break
		}
		if instructions[i%len(instructions)] == "L" {
			curr = nodes[curr.left]
		} else {
			curr = nodes[curr.right]
		}
	}
}

func partTwo(example bool) {
	fmt.Println("Part Two:")
	lines := utils.ReadInputFile(example)
	instructions := strings.Split(lines[0], "")

	var nodes map[string]Node = map[string]Node{}
	var ghosts []Ghost

	nodeLines := lines[2:]
	for _, nodeLine := range nodeLines {
		node := parseNode(nodeLine)
		nodes[node.value] = node
		if strings.Split(node.value, "")[2] == "A" {
			ghosts = append(ghosts, Ghost{
				start:   node.value,
				current: node.value,
			})
		}
	}

	for i := 0; ; i++ {
		instruction := instructions[i%len(instructions)]
		for j := 0; j < len(ghosts); j++ {
			currentGhost := &ghosts[j]
			if strings.Split(currentGhost.current, "")[2] == "Z" {
				fmt.Printf("Ghost: %d\tInstruction: %d\tInstructions / instruction Count: %f\n", j, i, float32(float32(i)/269.000))
				currentGhost.done = true
				currentGhost.finish = i
			}
			if instruction == "L" {
				currentGhost.current = nodes[currentGhost.current].left
			} else {
				currentGhost.current = nodes[currentGhost.current].right
			}
		}
		if checkGhosts(ghosts) == true {
			break
		}
	}
	result := leastCommonMultiple(ghosts)
	fmt.Printf("All ghosts will be at the end after %d instructions.\n", result)
}

func checkGhosts(ghosts []Ghost) bool {
	success := true
	for i := range ghosts {
		ghost := &ghosts[i]
		if !ghost.done {
			success = false
		}
	}
	return success
}

func leastCommonMultiple(ghosts []Ghost) int {
	var nums []int
	for _, ghost := range ghosts {
		nums = append(nums, ghost.finish)
	}
	return utils.CalculateLCM(nums)
}
