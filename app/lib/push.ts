
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:admin@mument.com',
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    )
}

export async function sendPushNotification(userId: string, title: string, body: string, url: string) {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
        console.warn("VAPID keys not configured. Skipping push.")
        return
    }

    const supabase = await createClient()

    // 1. Get user subscriptions
    const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId)

    if (!subs || subs.length === 0) return

    // 2. Send to all devices
    const payload = JSON.stringify({ title, body, url })

    const promises = subs.map(async (sub) => {
        const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
                p256dh: sub.p256dh,
                auth: sub.auth
            }
        }

        try {
            await webpush.sendNotification(pushSubscription, payload)
        } catch (error: any) {
            if (error.statusCode === 410 || error.statusCode === 404) {
                // Subscription is gone, delete it
                await supabase.from('push_subscriptions').delete().eq('id', sub.id)
            } else {
                console.error("Error sending push:", error)
            }
        }
    })

    await Promise.all(promises)
}

export async function sendBroadcastNotification(title: string, body: string, url: string) {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return

    const supabase = await createClient()

    // 1. Get ALL subscriptions
    // optimize: chunking if needed, but for now fetch all
    const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('*')

    if (!subs || subs.length === 0) return

    const payload = JSON.stringify({ title, body, url })

    const promises = subs.map(async (sub) => {
        const pushSubscription = {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth }
        }

        try {
            await webpush.sendNotification(pushSubscription, payload)
        } catch (error: any) {
            if (error.statusCode === 410 || error.statusCode === 404) {
                await supabase.from('push_subscriptions').delete().eq('id', sub.id)
            } else {
                console.error("Broadcast error:", error)
            }
        }
    })

    await Promise.all(promises)
}
