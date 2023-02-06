import { useEffect, useState } from "react"
import { keyBoard, useTouch } from "./helpers/controls"
import { changeCellState, defaultSnake, Grid, gridWithFood, newGrid, randomFood, renderGrid } from "./helpers/grid"
import { moveSnake } from "./helpers/snake"

export interface BoxProps {
  state: 'empty' | 'snake' | 'food'
}

export function Box(props: BoxProps) {
  return (
    <div className={`
         h-6
         rounded-sm
         w-5
         ${props.state === 'snake' ? 'bg-cyan-500' : props.state === 'food' ? 'bg-red-400' : 'bg-slate-900'}
        `}
    >
    </div>
  )
}

export function Grid({ grid }: { grid: Grid }) {
  return (
    <div className=' flex flex-col items-center'>
      <div className='bg-slate-400'>
        {grid.map((row, y) => (
          <div className='flex' key={y}>
            {
              row.map((cell, x) => (<Box {...cell} key={x} />))
            }
          </div>
        ))}
      </div>
    </div>
  )
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
  const [deadMessage, setDeadMessage] = useState()

  const {
    handleTouchStart,
    handleTouchEnd,
  } = useTouch(turn)

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(s => (s / 100) * 99)
      setCycles(c => c + 1)
    }, speed)
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

  function move() {
    try {
      const newSnake = moveSnake(direction, snake)
      const [head, ...body] = newSnake
      const { x, y } = head
      // steped on itself
      if (grid[y][x].state === 'snake') {
        throw 'Snake byte its tail'
      }
      //// landed on empty cell
      if (grid[y][x].state !== 'food') {
        body.pop()
      } else {
        setFood(randomFood(grid))
      }

      if (x >= grid.length || y >= grid.length || x < 0 || y < 0) {
        throw 'outside borders'
      }
      setSnake([head, ...body])
    } catch (e) {
      restart(true)
    }
  }

  useEffect(() => {
    setGrid(renderGrid(grid, snake, food))
  }, [snake])

  useEffect(() => {
    move()
  }, [cycles])
  useEffect(() => { setRenders(r => r + 1) }, [grid])

  function restart(_dead = false) {
    if (_dead) {
      setScore({
        snakeLength: snake.length,
        movements,
        cycles,
      })
      setDead(true)
    } else {
      setDead(false)
    }

    setStarted(false)
    setSpeed(500)
    setGrid(newGrid(16, 16))
    setCycles(0)
    setSnake(defaultSnake)
    setRenders(0)
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
      className='relative touch-none'
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
          <p>{deadMessage}</p>
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
