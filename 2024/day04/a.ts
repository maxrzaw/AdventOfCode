import * as fs from 'fs';

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');
const board = input.split('\n').map((row) => row.split(''));

function countWordInstances(board: string[][], word: string): number {
  const rows = board.length;
  const cols = board[0].length;
  let count = 0;

  function dfs(row: number, col: number, index: number, direction: number[]): boolean {
    // Base case: all characters in the word are matched
    if (index === word.length) {
      return true;
    }

    // Check boundaries and if current cell matches the character
    if (row < 0 || row >= rows || col < 0 || col >= cols || board[row][col] !== word[index]) {
      return false;
    }

    // Temporarily mark the cell as visited
    const temp = board[row][col];
    board[row][col] = '•';

    let found = false;
    const [dx, dy] = direction;
    if (dfs(row + dx, col + dy, index + 1, direction)) {
      found = true;
    }

    // Backtrack: unmark the cell
    board[row][col] = temp;

    return found;
  }

  // Explore all 8 directions
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [1, 1],
    [1, -1],
    [-1, 0],
    [-1, 1],
    [-1, -1],
  ];

  // Iterate through each cell in the grid as a starting point
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      for (let d = 0; d < directions.length; d++) {
        if (dfs(row, col, 0, directions[d])) {
          count++;
        }
      }
    }
  }

  return count;
}

console.log(countWordInstances(board, 'XMAS'));
