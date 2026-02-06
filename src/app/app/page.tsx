"use client";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Analytics {
  totalCustomers: number;
  jobsThisMonth: number;
  totalEstimates: number;
  customerGrowth: number;
  jobsGrowth: number;
}

const quickLinks = [
  {
    title: "Customers",
    description: "Manage your customer contacts and details",
    href: "/app/customers",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Calendar",
    description: "View and schedule your upcoming jobs",
    href: "/app/calendar",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Estimates",
    description: "Create and manage project estimates",
    href: "/app/estimates",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Jobs",
    description: "Track active and completed jobs",
    href: "/app/jobs",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalCustomers: 0,
    jobsThisMonth: 0,
    totalEstimates: 0,
    customerGrowth: 0,
    jobsGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!user) return;

      try {
        // Get current date info
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const lastOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

        // Fetch total customers
        const { count: totalCustomers } = await supabase
          .from("customers")
          .select("*", { count: "exact", head: true });

        // Fetch customers from last month for growth calculation
        const { count: customersLastMonth } = await supabase
          .from("customers")
          .select("*", { count: "exact", head: true })
          .lt("created_at", firstOfMonth);

        // Fetch jobs this month
        const { count: jobsThisMonth } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .gte("created_at", firstOfMonth);

        // Fetch jobs last month for growth calculation
        const { count: jobsLastMonth } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .gte("created_at", firstOfLastMonth)
          .lt("created_at", firstOfMonth);

        // Fetch total estimates
        const { count: totalEstimates } = await supabase
          .from("estimates")
          .select("*", { count: "exact", head: true });

        // Calculate growth percentages
        const prevCustomers = customersLastMonth || 0;
        const currentCustomers = totalCustomers || 0;
        const newCustomersThisMonth = currentCustomers - prevCustomers;
        const customerGrowth = prevCustomers > 0
          ? Math.round((newCustomersThisMonth / prevCustomers) * 100)
          : newCustomersThisMonth > 0 ? 100 : 0;

        const prevJobs = jobsLastMonth || 0;
        const currentJobs = jobsThisMonth || 0;
        const jobsGrowth = prevJobs > 0
          ? Math.round(((currentJobs - prevJobs) / prevJobs) * 100)
          : currentJobs > 0 ? 100 : 0;

        setAnalytics({
          totalCustomers: totalCustomers || 0,
          jobsThisMonth: jobsThisMonth || 0,
          totalEstimates: totalEstimates || 0,
          customerGrowth,
          jobsGrowth,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [user]);

  const analyticsCards = [
    {
      title: "Total Customers",
      value: analytics.totalCustomers,
      growth: analytics.customerGrowth,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "Jobs This Month",
      value: analytics.jobsThisMonth,
      growth: analytics.jobsGrowth,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Total Estimates",
      value: analytics.totalEstimates,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-neutral-400">{user?.email}</p>
      </div>

      {/* Analytics Cards */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-300 mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {analyticsCards.map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                  {card.icon}
                </div>
                {card.growth !== undefined && (
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      card.growth >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {card.growth >= 0 ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                    {Math.abs(card.growth)}%
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-white">
                  {loading ? "—" : card.value}
                </p>
                <p className="mt-1 text-sm text-neutral-400">{card.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links Grid */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-300 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group relative p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/50 hover:border-green-500/50 transition-all duration-300"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500/20 transition-colors duration-300">
                  {link.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
                    {link.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">
                    {link.description}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-neutral-600 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
