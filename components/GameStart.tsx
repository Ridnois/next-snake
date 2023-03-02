import { lobster } from './fonts'
import SnakeLogo from './SnakeLogo'

export default function GameStart({ startFn }: { startFn: any }) {
  return (
    <div
      className='
      p-8
      m-4
      flex
      flex-col
      items-center
      gap-4
      border-4
      dark:border-slate-800
      border-slate-300
      rounded-xl
    '
    > 
      <h1 className='text-8xl'>🐍</h1>
      <h1 className={`${lobster.variable} font-sans text-3xl text-red-500`}>Snake</h1>
      <p className='text-center'>
        Use gestures on mobile devices, or <b>WASD</b> on keyboards.
      </p>
      <button
        className='
          p-2
          px-4
          font-extrabold
          text-xl
          text-slate-200/90
          bg-cyan-700
          rounded-xl
        '
        onClick={startFn}
      >
        Start
      </button>
    </div>
  )
}
