"use client"

import Link from "next/link"
import { Role } from "@/types/user"
import { permissions } from "@/lib/permissions"

type Props = {
  role: Role
}

export default function Sidebar({ role }: Props) {
  return (
    <nav style={{ borderRight: "1px solid #ddd", padding: "1rem" }}>
      <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/profile">Profile</Link></li>
        <li><Link href="/feedback/submit">Submit Feedback</Link></li>
        <li><Link href="/checkpoints">Checkpoints</Link></li>
        <li><Link href="/daily-update">Daily Update</Link></li>

        {permissions.canViewFeedbackInbox(role) && (
          <li><Link href="/feedback/inbox">Feedback Inbox</Link></li>
        )}

        {permissions.canManageCheckpoints(role) && (
          <li><Link href="/checkpoints">Manage Checkpoints</Link></li>
        )}

        {permissions.canCreateAnnouncements(role) && (
          <li><Link href="/announcements">Announcements</Link></li>
        )}

        {role === "admin" && (
          <li><Link href="/admin">Admin</Link></li>
        )}
      </ul>
    </nav>
  )
}
