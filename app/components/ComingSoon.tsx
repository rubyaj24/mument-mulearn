import Image from "next/image"

type Props = {
  title?: string
  message?: string
  src?: string
  width?: number
  height?: number
  className?: string
}

export default function ComingSoon({
  title = "Not yet...",
  message = "This feature is coming soon. Stay tuned!",
  src = "/penguin-new.gif",
  width = 120,
  height = 200,
  className = "",
}: Props) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[70vh] p-6 gap-10 ${className}`}>
      <h1 className="text-5xl font-bold text-blue-500">{title}</h1>

      <Image src={src} alt={message} width={width} height={height} />

      <p className="text-blue-500 text-xl font-bold">{message}</p>
    </div>
  )
}
