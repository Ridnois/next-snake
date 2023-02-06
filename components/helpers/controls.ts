import { useState } from "react";

export const keyBoard = (turn: (direction: string) => void) => (e: any) => {
  e.preventDefault()
  if (e.isComposing || e.keyCode === 229) {
    return;
  }

  switch (e.key) {
    case 'w':
      turn('up')
      break;
    case 's':
      turn('down')
      break;
    case 'a':
      turn('left')
      break;
    case 'd':
      turn('right')
      break;
  }
}

export function useTouch(turn: (direction: string) => void) {
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {

    setStartX(event.touches[0].clientX);
    setStartY(event.touches[0].clientY);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const xDiff = event.changedTouches[0].clientX - startX;
    const yDiff = event.changedTouches[0].clientY - startY;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        turn('right');
      } else {
        turn('left');
      }
    } else {
      if (yDiff > 0) {
        turn('down')
      } else {
        turn('up');
      }
    }
  };

  return {
    handleTouchStart,
    handleTouchEnd
  }
}
