import { useEffect, useState } from "react"
import { Grid } from "./Grid"
import { keyBoard, logarithmicReduction, useTouch } from "./helpers/controls"
import { defaultGameState, newGrid, randomFood, renderGrid } from "./helpers/grid"
import { positionSnake } from "./helpers/snake"

export function SnakeController() {
  const [grid, setGrid] = useState(newGrid(16, 16))
  const [food, setFood] = useState(randomFood(newGrid(16, 16)))
  const [dead, setDead] = useState(false)
  const [score, setScore] = useState<{ snakeLength: number, movements: number, cycles: number }>({ snakeLength: 3, movements: 1, cycles: 4 })
  const [movements, setMovements] = useState(0)

  const [gameState, setGameState] = useState(defaultGameState)

  const {
    handleTouchStart,
    handleTouchEnd,
  } = useTouch(turn)

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (gameState.started) {
      interval = setInterval(() => {
        setGameState(g => ({
          ...g,
          cycles: g.cycles + 1,
          speed: (g.speed / 100) * 99,
        }))
      }, gameState.speed)
    }
    return () => {
      clearInterval(interval)
    }
  }, [gameState.started, gameState.speed])

  useEffect(() => {
    const fn = keyBoard(turn)
    window.addEventListener('keydown', fn)
    return () => {
      window.removeEventListener('keydown', fn)
    }
  }, [gameState.cycles])

  useEffect(() => {
    setGrid(renderGrid(grid, gameState.snake, food))
  }, [gameState.snake])

  useEffect(() => {
    const nextSnake = positionSnake(
      gameState.snake,
      gameState.direction,
      grid,
      () => setFood(randomFood(grid)),
      (e: unknown) => restart(true)
    )
    if (nextSnake) {
      setGameState(g => ({ ...g, snake: nextSnake }))
    }
  }, [gameState.cycles])

  useEffect(() => {
    setGameState(g => ({ ...g, renders: g.renders + 1 }))
  }, [grid])

  function afterDead() {
    setScore({
      snakeLength: gameState.snake.length,
      movements,
      cycles: gameState.cycles,
    })
    setDead(true)
  }
  function cleanUp() {
    setGrid(newGrid(16, 16))
    setGameState(defaultGameState)
  }

  function restart(endGame = false) {
    if (endGame) {
      afterDead()
    } else {
      setDead(false)
    }

    cleanUp()
  }

  function setDirection(direction: string) {
    setGameState(g => ({ ...g, direction: direction }))
  }

  function turn(_direction: string) {
    const { direction } = gameState
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
      <button onClick={() => setGameState(g => ({ ...g, started: !g.started }))}>
        {gameState.started ? 'stop' : 'start'}
      </button>
      {(gameState.started) && (
        <>
          <p>Speed {gameState.speed}</p>
          <p>Cycles {gameState.cycles}</p>
          <p>renders {gameState.renders}</p>
          <button onClick={() => restart()}>restart</button>
          <Grid grid={grid} />
        </>
      )}
      {(dead && !gameState.started) && (
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
