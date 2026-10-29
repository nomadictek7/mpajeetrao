import Link from "next/link";
import { Suspense } from "react";
import { logout } from "../actions";
import AdminNav from "./AdminNav";

export default function Panel({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-saffron text-white">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/bjp-logo.svg" alt="BJP" className="h-6 w-6 object-contain" />
            </span>
            <span className="font-bold tracking-[1px]">Website Dashboard</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" target="_blank" className="hidden font-semibold hover:opacity-80 sm:inline">
              View website ↗
            </Link>
            <form action={logout}>
              <button className="rounded-full border border-white/70 px-3 py-1 font-semibold hover:bg-white/10">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <aside className="sticky top-[60px] z-40 border-b border-line bg-surface px-2 py-2 lg:fixed lg:bottom-0 lg:left-0 lg:top-[60px] lg:w-64 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-3 lg:py-6">
        <Suspense>
          <AdminNav />
        </Suspense>
      </aside>

      <main className="mx-auto max-w-6xl px-4 py-8 lg:ml-64 lg:px-10">{children}</main>
    </>
  );
}
