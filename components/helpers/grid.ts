export interface Cell {
  state: 'snake' | 'food' | 'empty'
}

export type Row = Cell[]
export type Grid = Row[]

export interface SnakeCell {
  x: number,
  y: number
}

export type Snake = SnakeCell[]

export const defaultSnake = [
  {
    x: 7, y: 7
  },
  {
    x: 6, y: 7
  },
  {
    x: 5, y: 7
  },
]

export const defaultGrid = (rows: number, columns: number) => new Array(columns).fill(new Array(rows).fill({
  state: 'empty'
}))

export function changeCellState(grid: Grid, cell: SnakeCell, state: 'snake' | 'food' | 'empty'): Grid {
  const newGrid = [...grid]
  const newRow = [...newGrid[cell.y]]
  newRow[cell.x] = { state }
  newGrid[cell.y] = newRow

  return newGrid
}

export function gridWithSnake(grid: Grid, snake: Snake, index = 0): Grid {
  const newGrid = [...changeCellState(grid, snake[index], 'snake')]
  if (index < snake.length - 1) {
    return gridWithSnake(newGrid, snake, index + 1)
  }
  return newGrid
}

export function randomFood(grid: Grid): SnakeCell {
  const x = Math.floor(Math.random() * grid[0].length)
  const y = Math.floor(Math.random() * grid.length)

  return { x, y }
}

export function gridWithFood(grid: Grid): Grid {
  const { x, y } = randomFood(grid)
  if (grid[y][x].state === 'snake') {
    return gridWithFood(grid)
  }
  return [...changeCellState(grid, { x, y }, 'food')]
}

export function newGrid(rows: number, columns: number) {
  const grid = defaultGrid(rows, columns)
  const withSnake = gridWithSnake(grid, defaultSnake)
  const withFood = gridWithFood(withSnake)

  return withFood
}

export function renderGrid(grid: Grid, snake: Snake, food: SnakeCell): Grid {
  const _grid = defaultGrid(grid.length, grid[0].length)
  const withSnake = gridWithSnake(_grid, snake)
  const withFood = [...changeCellState(withSnake, food, 'food')]
  return withFood
}


export const defaultGameState = {
  started: false,
  cycles: 0,
  snake: defaultSnake,
  renders: 0,
  speed: 250,
  direction: 'right'
}

