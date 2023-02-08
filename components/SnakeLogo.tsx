import Image from 'next/image'
export default function SnakeLogo({ size = 200 }: { size?: number }) {
  return (
    <Image
      alt='snake logo'
      src={'/snake 2.png'}
      height={size}
      width={size}
      priority
    />
  )
}
