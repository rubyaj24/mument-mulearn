export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-blue-600 via-blue-500 to-blue-400">
      <div className="w-full max-w-6xl">
        {children}
      </div>
    </div>
  )
}