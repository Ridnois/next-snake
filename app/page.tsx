'use client'
import { SnakeController } from '@/components'
import SourceCode from '@/components/GithubLogo'

export default function Home() {
  return (
    <div className='flex flex-col justify-center h-screen items-center'>
      <SnakeController />
      <SourceCode />
    </div>
  )
}
