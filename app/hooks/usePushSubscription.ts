"use client"

import { useState, useEffect } from "react"
import { deleteSubscriptionAction, saveSubscriptionAction } from "@/actions"

export function usePushSubscription() {
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isInitializing, setIsInitializing] = useState(true)
    const [isMutating, setIsMutating] = useState(false)
    const [lastError, setLastError] = useState<string | null>(null)

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            registerServiceWorker()
        } else {
            setIsInitializing(false)
        }
    }, [])

    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none',
            })
            const sub = await registration.pushManager.getSubscription()
            setSubscription(sub)
            setIsSubscribed(!!sub)
        } catch (error) {
            console.error("SW Register failed", error)
        } finally {
            setIsInitializing(false)
        }
    }

    async function getActiveSubscription() {
        if (!isSupported) return null

        if (subscription) {
            return subscription
        }

        try {
            const registration = await navigator.serviceWorker.ready
            const existingSubscription = await registration.pushManager.getSubscription()
            setSubscription(existingSubscription)
            setIsSubscribed(!!existingSubscription)
            return existingSubscription
        } catch (error) {
            console.warn("Could not read existing push subscription", error)
            return null
        }
    }

    async function subscribeToPush(retries = 3): Promise<boolean> {
        if (!isSupported || isMutating) {
            return false
        }

        setLastError(null)

        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidPublicKey) {
            console.error("No VAPID public key found")
            setLastError("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY in environment.")
            return false
        }

        let applicationServerKey: Uint8Array
        try {
            applicationServerKey = new Uint8Array(urlBase64ToUint8Array(vapidPublicKey))
            if (applicationServerKey.length !== 65) {
                throw new Error("Invalid VAPID public key format (decoded length must be 65 bytes)")
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Invalid VAPID public key"
            console.error(message)
            setLastError(message)
            return false
        }

        setIsMutating(true)

        const existingSubscription = await getActiveSubscription()
        if (existingSubscription) {
            setIsMutating(false)
            return true
        }

        const currentPermission = Notification.permission
        if (currentPermission === 'denied') {
            console.error("Notification permission denied")
            setLastError("Notification permission denied in browser settings.")
            setIsMutating(false)
            return false
        }

        let permission: NotificationPermission = currentPermission
        if (currentPermission === 'default') {
            console.log("Requesting notification permission...")
            permission = await Notification.requestPermission()
        }

        if (permission !== 'granted') {
            console.error("Permission not granted:", permission)
            setLastError("Notification permission was not granted.")
            setIsMutating(false)
            return false
        }

        for (let i = 0; i < retries; i++) {
            try {
                console.log(`Attempt ${i + 1}/${retries}: Waiting for Service Worker...`)

                // Race between SW ready and timeout
                const registration = await Promise.race([
                    navigator.serviceWorker.ready,
                    new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error("Service Worker timeout")), 5000)
                    )
                ]) as ServiceWorkerRegistration

                const existingSub = await registration.pushManager.getSubscription()
                if (existingSub) {
                    setSubscription(existingSub)
                    setIsSubscribed(true)
                    setIsMutating(false)
                    return true
                }

                console.log("Subscribing to PushManager...")
                const sub = await Promise.race([
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: applicationServerKey as unknown as BufferSource,
                    }),
                    new Promise<PushSubscription>((_, reject) =>
                        setTimeout(() => reject(new Error("Subscription timeout")), 10000)
                    )
                ])

                console.log("Subscription successful:", sub)
                setSubscription(sub)
                setIsSubscribed(true)

                console.log("Saving to server...")
                const saveResult = await saveSubscriptionAction(JSON.parse(JSON.stringify(sub)))
                if (!saveResult?.success) {
                    const message = saveResult?.message ?? "Failed to save push subscription"
                    setLastError(message)
                    console.warn(message)
                    setSubscription(null)
                    setIsSubscribed(false)
                    setIsMutating(false)
                    return false
                }
                console.log("Saved to server.")

                setIsMutating(false)
                return true
            } catch (error) {
                console.warn(`Subscription attempt ${i + 1} failed:`, error)
                if (i === retries - 1) {
                    const message = error instanceof Error ? error.message : "Unknown subscribe error"
                    const normalizedMessage = message.includes("push service error")
                        ? "Browser push service registration failed. Verify browser settings."
                        : message
                    setLastError(normalizedMessage)
                    console.warn("All subscription attempts failed.")
                    setIsMutating(false)
                    return false
                }
                // Wait 1s before retrying
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        }
        setIsMutating(false)
        return false
    }

    async function unsubscribeFromPush(): Promise<boolean> {
        if (!isSupported || isMutating) {
            return false
        }

        setIsMutating(true)
        try {
            const activeSubscription = await getActiveSubscription()

            if (!activeSubscription) {
                setSubscription(null)
                setIsSubscribed(false)
                return true
            }

            const endpoint = activeSubscription.endpoint
            await activeSubscription.unsubscribe()

            const result = await deleteSubscriptionAction(endpoint)
            if (!result.success) {
                console.error(result.message)
                return false
            }

            setSubscription(null)
            setIsSubscribed(false)
            return true
        } catch (error) {
            console.error("Failed to unsubscribe from push", error)
            return false
        } finally {
            setIsMutating(false)
        }
    }

    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4)
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/')

        const rawData = window.atob(base64)
        const outputArray = new Uint8Array(rawData.length)

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
    }

    return {
        isSupported,
        subscription,
        isSubscribed,
        isInitializing,
        isMutating,
        lastError,
        subscribeToPush,
        unsubscribeFromPush,
    }
}
