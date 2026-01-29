import Image from "next/image"

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-purple-100 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Left Panel - Illustration */}
                <div className="w-full lg:w-1/2 max-w-md">
                    <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-2xl overflow-hidden aspect-[3/4]">
                        {/* Background Image - Full Panel */}
                        <div className="absolute inset-0">
                            <Image
                                src="/penguin-image.jpeg"
                                alt="µment 2.0 - Penguin Illustration"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full lg:w-1/2 max-w-md">
                    {children}
                </div>
            </div>
        </div>
    )
}