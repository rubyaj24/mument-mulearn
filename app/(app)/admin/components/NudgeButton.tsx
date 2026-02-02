"use client"

import { useState } from "react"
import { BellRing, Loader2, CheckCircle, XCircle } from "lucide-react"
import { triggerDailyNudgeAction } from "../../../actions"

export default function NudgeButton() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const handleNudge = async () => {
        if (!confirm("Send daily notifications to everyone who hasn't updated today? (Randomized per user)")) return

        setLoading(true)
        setResult(null)
        try {
            const res = await triggerDailyNudgeAction()
            if (res.success) {
                setResult(`Sent ${res.count} nudges!`)
            } else {
                setResult("Failed: " + res.error)
            }
        } catch (e) {
            setResult("Error occurred")
        }
        setLoading(false)
    }

    return (
        <div className="flex items-center gap-3">
            {result && <span className="text-sm font-medium text-emerald-600">{result}</span>}
            <button
                onClick={handleNudge}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <BellRing size={16} />}
                Send Daily Nudge
            </button>
        </div>
    )
}
