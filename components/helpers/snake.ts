import { Snake } from "./grid";

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


