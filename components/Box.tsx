export interface BoxProps {
  state: 'empty' | 'snake' | 'food'
}

export function Box(props: BoxProps) {
  const rand = Math.floor(Math.random() * 2)
  const snakebg = rand === 0 ? 'bg-cyan-500' : 'bg-cyan-500 opacity-90'
  return (
    <div className={`
         h-[22px] md:h-[42px]
         w-5 md:w-[42px]
         rounded-md
         ${props.state === 'snake' ? snakebg : props.state === 'food' ? 'bg-red-500 shadow-2xl shadow-slate-100' : 'dark:bg-slate-900 bg-slate-200'}
        `}
    >
    </div>
  )
}

