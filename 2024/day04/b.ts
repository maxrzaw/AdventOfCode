import * as fs from 'fs';

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');
const board = input.split('\n').map((row) => row.split(''));

const emptyBoard: string[][] = [];
for (const row of board) {
  emptyBoard.push(new Array(row.length).fill(' '));
}

function countWordInstances(board: string[][]): number {
  const rows = board.length;
  const cols = board[0].length;
  let count = 0;

  function findX(row: number, col: number): boolean {
    if (row < 1 || row >= rows - 1 || col < 1 || col >= cols - 1 || board[row][col] !== 'A') {
      return false;
    }

    let found = false;
    const topLeft = board[row - 1][col - 1];
    const topRight = board[row - 1][col + 1];
    const bottomLeft = board[row + 1][col - 1];
    const bottomRight = board[row + 1][col + 1];
    if (
      ((topLeft === 'M' && bottomRight === 'S') || (topLeft === 'S' && bottomRight === 'M')) &&
      ((bottomLeft === 'M' && topRight === 'S') || (bottomLeft === 'S' && topRight === 'M'))
    ) {
      found = true;
    }
    return found;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (findX(row, col)) {
        count++;
      }
    }
  }

  return count;
}

console.log(countWordInstances(board));
