import { Grid, randomFood, Snake } from "./grid";

export function moveSnake(direction: string, snake: Snake): Snake {
  const body = [...snake]
  const [head] = body

  let { x, y } = head

  switch (direction) {
    case 'left':
      x -= 1;
      break;
    case 'right':
      x += 1;
      break;
    case 'up':
      y -= 1;
      break;
    case 'down':
      y += 1;
      break;
  }

  return [{ x, y }, ...body]
}

export function positionSnake(
  snake: Snake,
  direction: string,
  grid: Grid,
  cb: () => void,
  deadFn: (e: unknown) => void,
) {
  try {
    const newSnake = moveSnake(direction, snake)
    const [head, ...body] = newSnake
    const { x, y } = head

    // steped on itself
    if (grid[y][x].state === 'snake') {
      throw 'Snake byte its tail'
    }
    // landed on empty cell
    if (grid[y][x].state !== 'food') {
      body.pop()
    } else {
      // Ate function
      cb()
    }
    // Snake outside of grid
    if (x >= grid.length || y >= grid.length || x < 0 || y < 0) {
      throw 'outside borders'
    }

    return [head, ...body]
  } catch (e: unknown) {
    deadFn(e)
  }
}
