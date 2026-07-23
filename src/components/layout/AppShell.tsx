import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopNav />
        <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
