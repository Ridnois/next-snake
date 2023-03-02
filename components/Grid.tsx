import { Grid } from "./helpers/grid"
import { Box } from "./Box"

export function Grid({ grid }: { grid: Grid }) {
  return (
    <div className='touch-none flex flex-col items-center border-4 rounded-xl bg-border-slate-300 dark:border-slate-800'>
      <div className='rounded-xl overflow-hidden dark:bg-slate-800'>
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
