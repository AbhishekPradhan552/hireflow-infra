"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import AuthGuard from "@/components/AuthGuard"
import { LayoutDashboard, Briefcase, CreditCard, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import InviteModal from "@/components/ui/invite-modal";

export default function DashboardLayout({ children }) {

  const pathname = usePathname()
  const [user, setUser] = useState(null)

  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const displayName =
    user?.email?.split("@")[0] || "User"

  const role =
    user?.role
      ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
      : ""

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return (
    <AuthGuard>
      {/*PREMIUM BACKGROUND */}
      <div className="h-screen flex relative overflow-hidden bg-gradient-to-br from-zinc-100 via-white to-emerald-50/30">

        {/* subtle gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-400/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-3xl rounded-full opacity-40" />

        {/* MOBILE OVERLAY */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed md:static z-50
            ${collapsed ? "md:w-20" : "md:w-64"} w-64 p-3 sm:p-4
            transform transition-all duration-300 ease-in-out
            ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="
            sticky top-4
            h-[calc(100vh-1rem)] rounded-2xl overflow-hidden
            bg-gradient-to-b from-white to-zinc-50/80 
            backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] 
            border border-zinc-200/60
            transition-all duration-300 ease-in-out
            flex flex-col
          ">

            {/* LOGO */}
            <div className="px-4 pt-4 pb-6 text-lg font-semibold tracking-tight">
              {collapsed ? "H" : "HireFlow"}
            </div>

            {/* NAV */}
            <nav className="px-2 space-y-1 flex-1 overflow-y-auto">

              {/* ITEM */}
              <NavItem
                href="/dashboard"
                active={pathname === "/dashboard"}
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                collapsed={collapsed}
              />

              <NavItem
                href="/dashboard/jobs"
                active={pathname.startsWith("/dashboard/jobs")}
                icon={<Briefcase size={18} />}
                label="Jobs"
                collapsed={collapsed}
              />

              <NavItem
                href="/dashboard/billing"
                active={pathname === "/dashboard/billing"}
                icon={<CreditCard size={18} />}
                label="Billing"
                collapsed={collapsed}
              />

            </nav>

            {/* USER */}
            <div className="mt-auto px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                  {displayName.charAt(0).toUpperCase()}
                </div>

                {!collapsed && (
                  <div className="text-sm">
                    <p className="font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                )}
              </div>

              {!collapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4 rounded-xl"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </div>

          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 flex flex-col px-3 sm:px-4 py-3 sm:py-4 relative z-10 overflow-y-auto">

          {/* TOPBAR */}
          <div className="
            h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6
            rounded-2xl mb-4
            bg-white/80
            backdrop-blur-xl border border-zinc-200/60 shadow-[0_8px_25px_rgba(0,0,0,0.04)] 
            transition-all duration-300 ease-in-out
          ">

            {/* LEFT */}
            <div className="flex items-center gap-3">

              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setOpen(!open)
                  } else {
                    setCollapsed(!collapsed)
                  }
                }}
                className="p-2 rounded-lg hover:bg-muted transition"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-xs sm:text-sm">
                  Welcome back
                </p>
                <p className="font-semibold text-base sm:text-lg">
                  {displayName}
                </p>
              </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 flex-wrap">

              {/* Invite Button (ONLY OWNER) */}
              {user?.role === "OWNER" && (
                <Button
                  variant="outline"
                  className="
                    h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-medium
                    rounded-full
                    border border-emerald-200
                    bg-emerald-50
                    text-emerald-700

                    hover:bg-emerald-100
                    shadow-sm hover:shadow-md

                    transition-all duration-200
                    active:scale-[0.97]
                  "
                  onClick={() => setShowInvite(true)}
                >
                  Invite
                </Button>
              )}

              {/* Existing Create Job Button */}
              <Link href="/dashboard/jobs/new">
                <Button className="rounded-full h-9 sm:h-10 px-3 sm:px-5 text-xs sm:text-sm bg-emerald-600 text-white hover:bg-emerald-700 
                shadow-sm hover:shadow-md transition-all duration-200 ease-in-out">
                  + Create Job
                </Button>
              </Link>

            </div>

          </div>

          {/* CONTENT */}
          <div className="flex-1 px-2 sm:px-6 pb-6 sm:pb-10 bg-transparent">
            <div className="w-full max-w-5xl mx-auto">
              {children}
            </div>
          </div>

          <InviteModal
              open={showInvite}
              onClose={() => setShowInvite(false)}
         />

        </main>

      </div>
    </AuthGuard>
  )
}

/* 🔥 PREMIUM NAV ITEM */
function NavItem({ href, icon, label, active, collapsed }) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ease-in-out
        ${active
          ? "bg-emerald-500/10 text-emerald-700"
          : "text-muted-foreground hover:bg-zinc-100"}
      `}
    >

      {/* active indicator */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-emerald-500 rounded-r-full" />
      )}

      {icon}

      {!collapsed && label}

      {/* tooltip */}
      {collapsed && (
        <span className="
          absolute left-full ml-3 px-2 py-1 text-xs rounded-md
          bg-black text-white opacity-0 group-hover:opacity-100
          transition pointer-events-none whitespace-nowrap
        ">
          {label}
        </span>
      )}

    </Link>
  )
}