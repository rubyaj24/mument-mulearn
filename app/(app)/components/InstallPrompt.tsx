"use client"

import { useEffect, useState } from "react"
import { usePushSubscription } from "@/hooks/usePushSubscription"
import { Download, Bell, X } from "lucide-react"

import { useToast } from "@/components/ToastProvider"

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [isPermissionBlocked, setIsPermissionBlocked] = useState(false)
    const [permissionState, setPermissionState] = useState<NotificationPermission>("default")
    const {
        isSupported,
        isSubscribed,
        isInitializing,
        isMutating,
        lastError,
        subscribeToPush,
        unsubscribeFromPush,
    } = usePushSubscription()
    const { show } = useToast()

    const [isDismissed, setIsDismissed] = useState(() => {
        if (typeof window === "undefined") return false
        return localStorage.getItem("install_prompt_dismissed") === "true"
    })
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {
        const checkStandalone = () => {
            const matches = window.matchMedia('(display-mode: standalone)').matches
            setIsStandalone(matches)
        }
        checkStandalone()
        window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone)

        const handler = (e: Event) => {
            const installEvent = e as BeforeInstallPromptEvent
            installEvent.preventDefault()
            setDeferredPrompt(installEvent)
            setShowPrompt(true)
        }

        window.addEventListener('beforeinstallprompt', handler)
        return () => {
            window.removeEventListener('beforeinstallprompt', handler)
            window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkStandalone)
        }
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return
        setPermissionState(Notification.permission)
        setIsPermissionBlocked(Notification.permission === "denied")
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
            setDeferredPrompt(null)
            setShowPrompt(false)
        }
    }

    const handleSubscribe = async () => {
        try {
            const success = await subscribeToPush()
            setPermissionState(Notification.permission)
            setIsPermissionBlocked(Notification.permission === "denied")
            if (success) {
                show({ title: "Success", description: "Notifications enabled!" })
            } else {
                if (Notification.permission === "denied") {
                    show({
                        title: "Notifications blocked",
                        description: "Enable Notifications in your browser site settings and try again.",
                    })
                } else {
                    show({ title: "Error", description: lastError ?? "Could not enable notifications. Check permissions." })
                }
            }
        } catch (error) {
            console.error(error)
            show({ title: "Error", description: "An unexpected error occurred." })
        }
    }

    const handleUnsubscribe = async () => {
        try {
            const success = await unsubscribeFromPush()
            setPermissionState(Notification.permission)
            if (success) {
                show({ title: "Success", description: "Notifications disabled for this device." })
            } else {
                show({ title: "Error", description: "Could not disable notifications." })
            }
        } catch (error) {
            console.error(error)
            show({ title: "Error", description: "An unexpected error occurred." })
        }
    }



    const handleDismissForever = () => {
        setIsDismissed(true)
        localStorage.setItem('install_prompt_dismissed', 'true')
        setShowPrompt(false)
    }

    if (isStandalone || isDismissed) return null

    // Wait until subscription status is resolved before deciding which prompt to render.
    if (isSupported && isInitializing) return null



    const showNotify = isSupported && !isSubscribed
    const showInstall = !showNotify && showPrompt && deferredPrompt
    // Fallback if system prompt missing but we are clear to show manual
    const showManual = !showNotify && !showInstall && isSubscribed && !isStandalone

    if (!showNotify && !showInstall && !showManual) return null

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-300 border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="font-bold text-xl text-slate-900 mb-1">
                            {showInstall ? "Install App" : showManual ? "Install App" : "Enable Icons & Updates"}
                        </h3>
                    </div>
                    {/* Only allow closing if dismissed or manually checking */}
                    <button onClick={handleDismissForever} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <p className="text-sm text-slate-500 mb-4">
                    {showInstall
                        ? "Install Mument for the best experience and quick access."
                        : showManual
                            ? "Tap your browser menu and select 'Add to Home Screen' to install."
                            : permissionState === "granted"
                                ? "Notifications are allowed. Finish setup to subscribe this device for push updates."
                                : "Enable notifications to stay updated on your feedback."}
                </p>

                {showNotify && isPermissionBlocked && (
                    <p className="text-xs text-amber-700 mb-3">
                        Notifications are blocked in browser settings. Allow this site first.
                    </p>
                )}

                <div className="flex gap-2">
                    {showInstall && (
                        <button
                            onClick={handleInstall}
                            className="flex-1 bg-brand-blue text-white py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                            <Download size={16} /> Install
                        </button>
                    )}

                    {showNotify && (
                        <button
                            onClick={handleSubscribe}
                            disabled={isMutating}
                            className={`flex-1 ${!showInstall ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-700'} py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <Bell size={16} />
                            {isMutating ? "Enabling..." : permissionState === "granted" ? "Finish Setup" : "Enable Updates"}
                        </button>
                    )}

                    {showManual && (
                        <>
                            <button
                                onClick={handleUnsubscribe}
                                disabled={isMutating}
                                className="flex-1 bg-rose-100 text-rose-700 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isMutating ? "Disabling..." : "Disable Updates"}
                            </button>
                            <button
                                onClick={handleDismissForever}
                                className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                            >
                                Do not show again
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
