import { useEffect, useState } from "react"
import { Grid } from "./Grid"
import { keyBoard, useTouch } from "./helpers/controls"
import { defaultGameState, newGrid, randomFood, renderGrid } from "./helpers/grid"
import { positionSnake } from "./helpers/snake"
import GameStart from '@/components/GameStart'
import { Box } from "./Box"

function getLogarithmicValue(min: number, max: number, i: number): number {
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  const logVal = logMin + ((logMax - logMin) * (i / 5000));

  return Math.pow(10, logVal);
}

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
      () => {
        setFood(randomFood(grid))
        setGameState((g => ({ ...g, speed: g.speed <= 10 ? g.speed : g.speed - 5 })))
      },
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
    <>
      {(gameState.started && !dead) && (
        <>
          <GameStart startFn={() => setGameState(g => ({ ...g, started: true }))} />
        </>
      )}
      {(!gameState.started) && (
        <>
          <div className='flex flex-col items-center mx-auto w-full px-8 md:w-2/3 md:mx-auto md:gap-4 md:justify-start'>
            <div className='flex gap-4 items-center justify-between w-full my-2'>
              <div className='flex items-center w-1/4 justify-between'>
                <Box state='food' />
                <p className='font-extrabold text-2xl text-cyan-400'>{gameState.snake.length - 3}</p>
              </div>
              <button
                className='p-2 px-4 bg-cyan-800 text-md border-cyan-700 border-4 rounded-xl font-extrabold text-slate-100'
                onClick={() => restart()}
              >
                Restart
              </button>
            </div>
          </div>
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Grid grid={grid} />
          </div>
        </>
      )
      }
      {(dead && !gameState.started) && (
        <>
          <div className='
                flex flex-col items-center justify-around
                p-8
                mx-4
                border-4
                dark:border-slate-800
                border-slate-300
                rounded-xl
          '>
            <h1 className='text-8xl p-2'>
              💀
            </h1>
            <h1
              className='
                text-indigo-500
                font-extrabold
                text-center
                text-3xl
                m-4
              '
            >
              Nice try!
            </h1>

            <p>
              Score: {score.snakeLength - 3}
            </p>

            <button
              className='
                my-4
                py-1
                px-4
                font-extrabold
                text-slate-200/90
                bg-cyan-700
                border-4
                border-cyan-600
                rounded-xl
              '
              onClick={() => setGameState(g => ({ ...g, started: true }))}
            >
              Restart
            </button>
          </div>
        </>
      )}
    </>
  )
}
