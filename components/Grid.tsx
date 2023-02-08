import { Grid } from "./helpers/grid"
import { Box } from "./Box"

export function Grid({ grid }: { grid: Grid }) {
  return (
    <div className='touch-none flex flex-col items-center'>
      <div className='rounded-xl overflow-hidden dark:bg-slate-700'>
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
