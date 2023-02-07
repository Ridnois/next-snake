import SnakeLogo from './SnakeLogo'

export default function GameStart({ startFn }: { startFn: any }) {
  return (
    <div
      className='
      p-8
      flex
      flex-col
      items-center
    '
    >
      <SnakeLogo size={100} />
      <h1
        className='
        text-cyan-500
        font-extrabold
        text-center
        m-4
      '
      >Snake</h1>
      <p className='text-center'>
        Use gestures on mobile devices, or <b>WASD</b> on keyboards
      </p>
      <button
        className='
          my-4
          py-1
          px-4
          font-extrabold
          text-slate-200
          bg-cyan-500
          rounded-xl
        '
        onClick={startFn}
      >
        Start
      </button>
    </div>
  )
}
