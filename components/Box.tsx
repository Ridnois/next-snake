export interface BoxProps {
  state: 'empty' | 'snake' | 'food'
}

export function Box(props: BoxProps) {
  const rand = Math.floor(Math.random() * 2)
  const snakebg = rand === 0 ? 'bg-cyan-500' : 'bg-cyan-500 opacity-50'
  return (
    <div className={`
         h-6
         rounded-sm
         w-5
         ${props.state === 'snake' ? snakebg : props.state === 'food' ? 'bg-red-400' : 'bg-slate-900'}
        `}
    >
    </div>
  )
}

