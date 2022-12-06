# Plan

## Parsing

To parse this, it is probably easiest to do it in two passes to start.

### First Pass

Read in all the letters and get their coordinates. There are 8
sides that need to be read in and have slightly different math to find the
coordinates of the portal.

### Second Pass

Read in all the walls and paths. I am thinking that a graph structure will be
needed for this problem so it will be useful to know if an open coordinate is
next to a portal as well as the adjacent open coordinates.

## Solving

As far as a strategy for solving this problem, I think that a BFS seems pretty
well suited for part one. Who knows what part two has in store. One thing I am
not sure of yet is if the portals count as moves or if it is not counted. After
reading the prompt a little more, the portals do not add a step. We can treat
two coordinates connected by a portal as if they are adjacent.
