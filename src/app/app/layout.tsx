"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const tabs = [
  { label: "Dashboard", href: "/app" },
  { label: "Customers", href: "/app/customers" },
  { label: "Estimates", href: "/app/estimates" },
  { label: "Calendar", href: "/app/calendar" },
  { label: "Jobs", href: "/app/jobs" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}

function TopBar() {
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 h-14">
        <Link href="/app" className="text-lg font-bold text-blue-600 shrink-0">
          Painterflow
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto mx-4">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="shrink-0 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
