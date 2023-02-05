interface BoxProps {
  state: 'empty' | 'snake' | 'food'
}

export function Box(props: BoxProps) {
  return (
    <div className={`
         h-6
         rounded-sm
         w-8
         ${props.state === 'snake' ? 'bg-cyan-500' : props.state === 'food' ? 'bg-red-400' : 'bg-slate-900'}
        `}
    >
    </div>
  )
}
