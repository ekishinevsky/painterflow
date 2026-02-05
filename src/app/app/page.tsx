"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
      <p className="mt-1 text-gray-600">{user?.email}</p>
    </div>
  );
}
