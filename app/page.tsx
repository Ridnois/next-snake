'use client'
import { Box } from '@/components'
import { useEffect, useState } from 'react'

const defaultGrid = new Array(16).fill(new Array(16).fill({
  state: 'empty'
}))

const defaultSnake = [
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

interface Cell {
  state: 'snake' | 'food' | 'empty'
}

type Row = Cell[]
type Grid = Row[]

interface SnakeCell {
  x: number,
  y: number
}

type Snake = SnakeCell[]

export default function Home() {
  const [grid, setGrid] = useState<Grid>(defaultGrid)
  const [snake, setSnake] = useState<Snake>(defaultSnake)
  const [started, setStarted] = useState(false)
  const [direction, setDirection] = useState('right')
  const [cycles, setCycles] = useState(0)
  const [intervalDuration, setIntervalDuration] = useState(150)

  const [foodPosition, setFoodPosition] = useState(randomCoordenate())
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  // Every time a new cycle starts, update the grid
  useEffect(() => {
    move(direction)
  }, [cycles])

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault()

    setStartX(event.touches[0].clientX);
    setStartY(event.touches[0].clientY);
  };

  const initialGrid = () => {
    const newGrid = gridWithSnake(defaultGrid, snake)
    setGrid(newGrid)
  }

  const renderGrid = () => {
    const newGrid = gridWithSnake(defaultGrid, snake)
    const withFood = drawFood(newGrid, foodPosition)
    setGrid(withFood)
  }

  const modifyCell = (grid: Grid, cell: SnakeCell, state: 'snake' | 'food' | 'empty') => {
    const newGrid = [...grid]
    const newRow = [...newGrid[cell.y]]
    newRow[cell.x] = { state }
    newGrid[cell.y] = newRow
    return newGrid
  }

  const drawSnake = (grid: Grid, snake: Snake, index = 0): any => {
    const newGrid = [...modifyCell(grid, snake[index], 'snake')]
    if (index < snake.length - 1) {
      return drawSnake(newGrid, snake, index + 1)
    }
    return newGrid
  }

  const gridWithSnake = (grid: Grid, snake: Snake) => {
    const newGrid = drawSnake(grid, snake)
    return newGrid
  }

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    const updateCycles = () => {
      setCycles((c) => c + 1)
      setIntervalDuration(i => i - 20)
    }

    if (started) {
      intervalId = setInterval(updateCycles, intervalDuration)
    }

    window.addEventListener('keydown', keyBoard)

    return () => {
      setIntervalDuration(150)
      window.removeEventListener('keydown', keyBoard)
      clearInterval(intervalId)
      initialGrid()
    }
  }, [started])

  function turn(_direction: string) {
    setDirection(_direction)
  }

  function randomCoordenate(): any {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)

    if (grid[y][x].state === 'snake') {
      return randomCoordenate()
    }
    return { x, y }
  }

  function drawFood(grid: Grid, _foodPosition: SnakeCell = randomCoordenate()) {
    const { x, y } = _foodPosition;
    const newGrid = [...grid]
    const newRow = [...newGrid[y]]
    newRow[x] = { state: 'food' }
    newGrid[y] = newRow
    return newGrid
  }

  function move(direction: string) {
    try {

      const body = [...snake]
      const [head] = body
      let { x, y } = head

      // This should depends on if the snake must grow

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
      if (grid[y][x].state !== 'food') {
        body.pop()
      }
      if (grid[y][x].state === 'food') {
        setFoodPosition(randomCoordenate())
      }
      setSnake([{ x, y }, ...body])
      renderGrid()
    } catch (e) {
      console.log('snake lost')
      setFoodPosition(randomCoordenate())
      setSnake(defaultSnake)
      setDirection('right')
      restart()
    }
  }

  function keyBoard(e: any) {
    if (e.isComposing || e.keyCode === 229) {
      return;
    }

    console.log(e.key)
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
  const handleTouchMove = (event: React.TouchEvent) => {
    event.preventDefault()
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

  function restart() {
    setStarted((s) => !s)
  }

  return (
    <main className='flex justify-center mt-4'>
      <div className='w-11/12 border-4 border-slate-700 rounded-2xl p-2 my-4 relative'>
        <div className='flex flex-col'>
          <h1 className='
                  font-bold
                  text-2xl
                  text-center
                  mb-4
                '
          >
            {snake.length > 3 ? snake.length : ':)'} {cycles}
          </h1>
        </div>
        {/*
        <button className='
        bg-purple-600
        font-bold
        p-2 px-4 rounded-xl mb-4
        ' onClick={() => turn('left')}>
          Left
        </button>

        <button className='
        bg-purple-600
        font-bold
        p-2 px-4 rounded-xl mb-4
        ' onClick={() => turn('right')}>
          Right
        </button>
        <button className='
        bg-purple-600
        font-bold
        p-2 px-4 rounded-xl mb-4
        ' onClick={() => turn('up')}>
          Up
        </button>
        <button className='
        bg-purple-600
        font-bold
        p-2 px-4 rounded-xl mb-4
        ' onClick={() => turn('down')}>
          Down
        </button>
*/}
        <div className={`
             ${started ? 'hidden' : 'flex'}
             z-10 w-full left-0 absolute top-16 h-96
             rounded-2xl my-auto bg-gray-900/90
             p-4
             flex-col  items-center
            `}
        >
          <h1 className='
              text-3xl
              font-extrabold
              my-6
            '
          >Amazing snake</h1>
          <h2 className='
              mt-6 mb-4
              text-md
              text-center
          '
          >
            Eat food and grow, if you touch outside you're gone. You can
            go back and step your own tail!</h2>
          <p className='
              text-center
              text-sm
              text-slate-400
            '
          >
            Use <b>WASD</b> for movement, or swipe on mobile devices.</p>
          <button
            className='
            font-extrabold
            my-4
            bg-cyan-600
            py-4 px-8 
            rounded-2xl
          '
            onClick={restart}
          >
            Start
          </button>
        </div>
        <div className='
          flex flex-col justify-between gap-y-0 
          dark:bg-cyan-900
          rounded-sm
          overflow-hidden
          mb-2
          touch-none
          '
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchMove}
        >

          {
            grid.map((row, i) => (
              <div className='flex justify-between m-0' key={i}>
                {row.map((box: any, j: number) => <Box {...box} key={j} />)}
              </div>
            ))
          }
        </div>
      </div>
    </main >
  )
}
