package main

import (
	"aoc-2023/utils"
	"bufio"
	"fmt"
	"sort"
	"strings"
)

type Range struct {
	start  int
	length int
}

type RangeByStart []Range

func (a RangeByStart) Len() int           { return len(a) }
func (a RangeByStart) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a RangeByStart) Less(i, j int) bool { return a[i].start < a[j].start }

type ConversionMapEntryByStart []ConversionMapEntry

func (a ConversionMapEntryByStart) Len() int      { return len(a) }
func (a ConversionMapEntryByStart) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a ConversionMapEntryByStart) Less(i, j int) bool {
	return a[i].source.start < a[j].source.start
}

type ConversionMap struct {
	maps []ConversionMapEntry
}

type ConversionMapEntry struct {
	source Range
	offset int
}

func main() {
	almanac := strings.Join(utils.ReadInputFile(false), "\n")
	seeds, seedToSoilMap, soilToFertilizerMap, fertilizerToWaterMap, waterToLightMap, lightToTemperatureMap, temperatureToHumidityMap, humidityToLocationMap := parseAlmanac(almanac)

	partOneSeeds := makePartOneList(seeds)
	var partOneLocations []Range
	partOneLocations = convertSeedRangeToLocationRanges(partOneSeeds, seedToSoilMap, soilToFertilizerMap, fertilizerToWaterMap, waterToLightMap, lightToTemperatureMap, temperatureToHumidityMap, humidityToLocationMap)
	sort.Sort(RangeByStart(partOneLocations))
	fmt.Printf("Part One: %d\n", partOneLocations[0].start)

	partTwoSeeds := makePartTwoList(seeds)
	var partTwoLocations []Range
	partTwoLocations = convertSeedRangeToLocationRanges(partTwoSeeds, seedToSoilMap, soilToFertilizerMap, fertilizerToWaterMap, waterToLightMap, lightToTemperatureMap, temperatureToHumidityMap, humidityToLocationMap)
	sort.Sort(RangeByStart(partTwoLocations))
	fmt.Printf("Part Two: %d\n", partTwoLocations[0].start)
}

func makePartTwoList(seeds []int) []Range {
	var ranges []Range
	if len(seeds)%2 != 0 {
		panic("The length of the seed ranges is odd")
	}

	for i := 0; i < len(seeds); i += 2 {
		ranges = append(ranges, Range{
			start:  seeds[i],
			length: seeds[i+1],
		})
	}

	return ranges
}

func makePartOneList(seeds []int) []Range {
	var ranges []Range
	for i := 0; i < len(seeds); i++ {
		ranges = append(ranges, Range{
			start:  seeds[i],
			length: 1,
		})
	}

	return ranges
}

func parseAlmanac(almanac string) ([]int, ConversionMap, ConversionMap, ConversionMap, ConversionMap, ConversionMap, ConversionMap, ConversionMap) {
	scanner := bufio.NewScanner(strings.NewReader(almanac))

	var seeds []int
	var seedToSoilMap, soilToFertilizerMap, fertilizerToWaterMap, waterToLightMap, lightToTemperatureMap, temperatureToHumidityMap, humidityToLocationMap ConversionMap

	for scanner.Scan() {
		line := scanner.Text()

		if strings.HasPrefix(line, "seeds:") {
			seeds = utils.ParseNumbers(line)
		} else if strings.HasPrefix(line, "seed-to-soil map:") {
			seedToSoilMap = parseConversionMap(scanner)
		} else if strings.HasPrefix(line, "soil-to-fertilizer map:") {
			soilToFertilizerMap = parseConversionMap(scanner)
		} else if strings.HasPrefix(line, "fertilizer-to-water map:") {
			fertilizerToWaterMap = parseConversionMap(scanner)
		} else if strings.HasPrefix(line, "water-to-light map:") {
			waterToLightMap = parseConversionMap(scanner)
		} else if strings.HasPrefix(line, "light-to-temperature map:") {
			lightToTemperatureMap = parseConversionMap(scanner)
		} else if strings.HasPrefix(line, "temperature-to-humidity map:") {
			temperatureToHumidityMap = parseConversionMap(scanner)
		} else if strings.HasPrefix(line, "humidity-to-location map:") {
			humidityToLocationMap = parseConversionMap(scanner)
		}
	}

	return seeds, seedToSoilMap, soilToFertilizerMap, fertilizerToWaterMap, waterToLightMap, lightToTemperatureMap, temperatureToHumidityMap, humidityToLocationMap
}

func parseConversionMap(scanner *bufio.Scanner) ConversionMap {
	var conversionMap ConversionMap

	for scanner.Scan() {
		line := scanner.Text()

		if line == "" {
			break
		}

		values := utils.ParseNumbers(line)
		if len(values) == 3 {
			conversionMap.maps = append(conversionMap.maps, ConversionMapEntry{
				source: Range{
					start:  values[1],
					length: values[2],
				},
				offset: values[0] - values[1],
			})
		}
	}

	filledMap := fillGapsInConversionMap(conversionMap)
	return filledMap
}

func fillGapsInConversionMap(m ConversionMap) ConversionMap {
	sort.Sort(ConversionMapEntryByStart(m.maps))

	var fillers []ConversionMapEntry
	for i, entry := range m.maps {
		if i == len(m.maps)-1 {
			continue
		}
		if entry.source.start+entry.source.length < m.maps[i+1].source.start {
			rangeFiller := createFillerRange(entry.source, m.maps[i+1].source)
			fillers = append(fillers, rangeFiller)
		}
	}

	for _, rf := range fillers {
		m.maps = append(m.maps, rf)
	}

	sort.Sort(ConversionMapEntryByStart(m.maps))
	return m
}

func createFillerRange(left Range, right Range) ConversionMapEntry {
	return ConversionMapEntry{
		source: Range{
			start:  left.start + left.length,
			length: right.start - (left.start + left.length),
		},
		offset: 0,
	}
}

func convertSeedRangeToLocationRanges(seedRange []Range, seedToSoilMap, soilToFertilizerMap, fertilizerToWaterMap, waterToLightMap, lightToTemperatureMap, temperatureToHumidityMap, humidityToLocationMap ConversionMap) []Range {
	soils := convertSourceRangesWithMap(seedRange, seedToSoilMap, false)
	fertilizers := convertSourceRangesWithMap(soils, soilToFertilizerMap, false)
	waters := convertSourceRangesWithMap(fertilizers, fertilizerToWaterMap, false)
	lights := convertSourceRangesWithMap(waters, waterToLightMap, false)
	temperatures := convertSourceRangesWithMap(lights, lightToTemperatureMap, false)
	humidities := convertSourceRangesWithMap(temperatures, temperatureToHumidityMap, false)
	locations := convertSourceRangesWithMap(humidities, humidityToLocationMap, false)
	return locations
}

func convertSourceRangesWithMap(source []Range, m ConversionMap, debug bool) []Range {
	var destinations []Range
	for _, r := range source {
		splitRanges := splitRange(r, m, debug)
		if debug {
			fmt.Printf("Split Ranges: %v\n\n", splitRanges)
		}
		for _, sr := range splitRanges {
			i := findFirstRangeIndex(sr.start, m.maps)
			if i == -1 {
				// This range was not found
				if debug {
					fmt.Printf("The first range was not found for: %v\n", sr)
				}
				destinations = append(destinations, sr)
				continue
			}
			cr, err := convertRange(sr, m.maps[i])
			if err != nil {
				// The range was not contained in the map
				panic(err)
			}
			destinations = append(destinations, cr)
		}
	}
	return destinations
}

func splitRange(r Range, m ConversionMap, debug bool) []Range {
	if debug {
		fmt.Printf("Splitting Range: %v\nMap: %v\n", r, m.maps)
	}
	var ranges []Range
	// Find the first map entry that works and find out how much of the range we can take away
	for r.length > 0 {
		firstRange, err := getFirstRange(&r, m.maps)
		if err != nil {
			// The range is not contained in any of the conversion maps entries
			ranges = append(ranges, r)
			return ranges
		}
		ranges = append(ranges, firstRange)
	}
	if debug {
		fmt.Printf("Ranges: %v\n", ranges)
	}
	return ranges
}

func getFirstRange(r *Range, entries []ConversionMapEntry) (Range, error) {
	if r.length <= 0 {
		panic("Range should not be less than or equal to zero")
	}

	index := findFirstRangeIndex(r.start, entries)
	if index < 0 {
		return Range{}, fmt.Errorf("The start of the provided range is past the end of the entries provided")
	}

	fr := entries[index]

	var result Range
	result.start = r.start
	if r.start+r.length > fr.source.start+fr.source.length {
		// the first range cannot contain all of r
		result.length = fr.source.start + fr.source.length - r.start
		r.length = r.length - result.length
	} else {
		// the first range contains all of r
		result.length = r.length
		r.length = 0
	}

	// update the start and length of range. Ok to be less than zero
	r.start = fr.source.start + fr.source.length

	return result, nil
}

func findFirstRangeIndex(n int, entries []ConversionMapEntry) int {
	for i, e := range entries {
		if isInRange(n, e.source) {
			return i
		}
	}
	return -1
}

func isInRange(n int, r Range) bool {
	return n >= r.start && n < r.start+r.length
}

func convertRange(r Range, rm ConversionMapEntry) (Range, error) {
	if !isContainedInRange(r, rm.source) {
		return Range{}, fmt.Errorf("range %v is not in entry %v", r, rm)
	}

	r.start += rm.offset

	return r, nil
}

func isContainedInRange(inner Range, outer Range) bool {
	return inner.start >= outer.start && inner.start+inner.length <= outer.start+outer.length
}
