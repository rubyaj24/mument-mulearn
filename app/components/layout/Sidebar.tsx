
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Role } from "@/types/user"
import { permissions } from "@/lib/permissions"
import {
  LayoutDashboard,
  User,
  MessageSquareText,
  MapPin,
  CalendarCheck,
  Inbox,
  Megaphone,
  ShieldCheck
} from "lucide-react"

type Props = {
  role: Role
}

export default function Sidebar({ role }: Props) {
  const pathname = usePathname();

  // Helper to apply active styling
  const getLinkStyle = (href: string) => {
    const isActive = pathname === href;
    return `group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/10 ${isActive ? "text-white font-semibold bg-white/5" : "text-white/70"
      }`;
  };

  return (
    <aside className="w-64 h-[calc(100vh-2rem)] m-4 rounded-3xl bg-brand-blue text-white flex flex-col p-6 shadow-xl sticky top-4 font-redhat">

      {/* Brand Logo Section */}
      <div className="mb-10 px-2 flex flex-col items-center">
        <div className="relative w-full h-14">
          <Image
            src="/logo_white.png"
            width={200}
            height={100}
            alt="Mument 2.0"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar">
        <ul className="flex flex-col gap-2">
          <li>
            <Link href="/dashboard" className={getLinkStyle("/dashboard")}>
              <LayoutDashboard size={20} className={pathname === "/dashboard" ? "text-brand-yellow" : ""} />
              Dashboard
              {pathname === "/dashboard" && <div className="absolute left-0 w-1.5 h-6 bg-brand-yellow rounded-r-full" />}
            </Link>
          </li>
          <li>
            <Link href="/profile" className={getLinkStyle("/profile")}>
              <User size={20} className={pathname === "/profile" ? "text-brand-yellow" : ""} />
              Profile
              {pathname === "/profile" && <div className="absolute left-0 w-1.5 h-6 bg-brand-yellow rounded-r-full" />}
            </Link>
          </li>
          <li>
            <Link href="/feedback/submit" className={getLinkStyle("/feedback/submit")}>
              <MessageSquareText size={20} className={pathname === "/feedback/submit" ? "text-brand-yellow" : ""} />
              Submit Feedback
            </Link>
          </li>
          <li>
            <Link href="/checkpoints" className={getLinkStyle("/checkpoints")}>
              <MapPin size={20} className={pathname === "/checkpoints" ? "text-brand-yellow" : ""} />
              Checkpoints
            </Link>
          </li>
          <li>
            <Link href="/daily-update" className={getLinkStyle("/daily-update")}>
              <CalendarCheck size={20} className={pathname === "/daily-update" ? "text-brand-yellow" : ""} />
              Daily Update
            </Link>
          </li>

          {/* Role-Based Permissions Logic */}
          {permissions.canViewFeedbackInbox(role) && (
            <li>
              <Link href="/feedback/inbox" className={getLinkStyle("/feedback/inbox")}>
                <Inbox size={20} className={pathname === "/feedback/inbox" ? "text-brand-yellow" : ""} />
                Feedback Inbox
              </Link>
            </li>
          )}

          {permissions.canManageCheckpoints(role) && (
            <li>
              <Link href="/checkpoints" className={getLinkStyle("/checkpoints")}>
                <MapPin size={20} className={pathname === "/checkpoints" ? "text-brand-yellow" : ""} />
                Manage Checkpoints
              </Link>
            </li>
          )}

          {permissions.canCreateAnnouncements(role) && (
            <li>
              <Link href="/announcements" className={getLinkStyle("/announcements")}>
                <Megaphone size={20} className={pathname === "/announcements" ? "text-brand-yellow" : ""} />
                Announcements
              </Link>
            </li>
          )}

          {role === "admin" && (
            <li>
              <Link href="/admin" className={getLinkStyle("/admin")}>
                <ShieldCheck size={20} className={pathname === "/admin" ? "text-brand-yellow" : ""} />
                Admin
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Role Footer */}
      <div className="pt-6 border-t border-white/10 mt-auto">
        <p className="text-[10px] uppercase tracking-wider text-white/40 px-4 mb-1">Role</p>
        <p className="text-xs font-bold text-white/80 px-4 uppercase">{role}</p>
      </div>
    </aside>
  )
}