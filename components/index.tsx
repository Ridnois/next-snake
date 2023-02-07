import { useEffect, useState } from "react"
import { Grid } from "./Grid"
import { keyBoard, useTouch } from "./helpers/controls"
import { defaultSnake, newGrid, randomFood, renderGrid } from "./helpers/grid"
import { positionSnake } from "./helpers/snake"

const gameState = {
  started: false,
  cycles: 0,
  snake: defaultSnake,
  renders: 0
}

export function SnakeController() {
  const [started, setStarted] = useState(false)
  const [grid, setGrid] = useState(newGrid(16, 16))
  const [speed, setSpeed] = useState(500)
  const [cycles, setCycles] = useState(0)
  const [snake, setSnake] = useState(defaultSnake)
  const [food, setFood] = useState(randomFood(newGrid(16, 16)))
  const [direction, setDirection] = useState('right')
  const [renders, setRenders] = useState(0)
  const [dead, setDead] = useState(false)
  const [score, setScore] = useState<{ snakeLength: number, movements: number, cycles: number }>({ snakeLength: 3, movements: 1, cycles: 4 })
  const [movements, setMovements] = useState(0)

  const {
    handleTouchStart,
    handleTouchEnd,
  } = useTouch(turn)

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (started) {
      interval = setInterval(() => {
        setSpeed(s => (s / 100) * 99)
        setCycles(c => c + 1)
      }, speed)
    }
    return () => {
      clearInterval(interval)
    }
  }, [started, speed])

  useEffect(() => {
    const fn = keyBoard(turn)
    window.addEventListener('keydown', fn)
    return () => {
      window.removeEventListener('keydown', fn)
    }
  }, [cycles])

  useEffect(() => {
    console.log('snake moved')
    setGrid(renderGrid(grid, snake, food))
  }, [snake])

  useEffect(() => {
    const nextSnake = positionSnake(
      snake,
      direction,
      grid,
      () => setFood(randomFood(grid)),
      (e: unknown) => restart(true)
    )
    if (nextSnake) {
      setSnake(nextSnake)
    }
  }, [cycles])

  useEffect(() => {
    setRenders(r => r + 1)
  }, [grid])

  function afterDead() {
    setScore({
      snakeLength: snake.length,
      movements,
      cycles,
    })
    setDead(true)
  }
  function cleanUp() {
    setStarted(false)
    setSpeed(500)
    setGrid(newGrid(16, 16))
    setCycles(0)
    setSnake(defaultSnake)
    setRenders(0)
  }

  function restart(endGame = false) {
    if (endGame) {
      afterDead()
    } else {
      setDead(false)
    }

    cleanUp()
  }

  function turn(_direction: string) {
    setMovements(m => m + 1)
    switch (_direction) {
      case 'up':
        if (direction !== 'down') {
          setDirection(_direction)
        }
        break;
      case 'down':
        if (direction !== 'up') {
          setDirection(_direction)
        }
        break;
      case 'left':
        if (direction !== 'right') {
          setDirection(_direction)
        }
        break;
      case 'right':
        if (direction !== 'left') {
          setDirection(_direction)
        }
        break;
    }
  }

  return (
    <div
      className='touch-none'
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      Snake
      <button onClick={() => setStarted(s => !s)}>
        {started ? 'stop' : 'start'}
      </button>
      {(started) && (
        <>
          <p>Speed {speed}</p>
          <p>Cycles {cycles}</p>
          <p>renders {renders}</p>
          <button onClick={() => restart()}>restart</button>
          <Grid grid={grid} />
        </>
      )}
      {(dead && !started) && (
        <div className='border rounded-lg p-4 m-4'>
          <h1>Nice try!</h1>
          <p>
            cycles: {score.cycles}
          </p>
          <p>
            eaten: {score.snakeLength - 3}
          </p>
          <p>
            movements: {score.movements}
          </p>
        </div>
      )}
    </div>
  )
}
