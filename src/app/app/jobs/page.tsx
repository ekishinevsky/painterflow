"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Customer {
  id: string;
  name: string;
}

interface Job {
  id: string;
  date: string;
  status: "scheduled" | "in_progress" | "done";
  areas: string | null;
  paint_colors: string | null;
  finish: string | null;
  materials: string | null;
  notes: string | null;
  customer_id: string | null;
  customers: { name: string }[] | { name: string } | null;
}

function getCustomerName(job: Job): string {
  if (!job.customers) return "No customer";
  if (Array.isArray(job.customers)) return job.customers[0]?.name ?? "No customer";
  return job.customers.name;
}

const statusColors = {
  scheduled: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
};

const statusLabels = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  done: "Done",
};

const finishOptions = ["flat", "eggshell", "satin", "semi-gloss", "gloss"];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"scheduled" | "in_progress" | "done">("scheduled");
  const [areas, setAreas] = useState("");
  const [paintColors, setPaintColors] = useState("");
  const [finish, setFinish] = useState("");
  const [materials, setMaterials] = useState("");
  const [notes, setNotes] = useState("");

  const fetchJobs = async () => {
    const { data } = await supabase
      .from("jobs")
      .select("*, customers(name)")
      .order("date", { ascending: true });
    setJobs(data ?? []);
  };

  const fetchCustomers = async () => {
    const { data } = await supabase.from("customers").select("id, name").order("name");
    setCustomers(data ?? []);
  };

  useEffect(() => {
    fetchJobs();
    fetchCustomers();
  }, []);

  const resetForm = () => {
    setCustomerId("");
    setDate("");
    setStatus("scheduled");
    setAreas("");
    setPaintColors("");
    setFinish("");
    setMaterials("");
    setNotes("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    setSubmitting(true);

    await supabase.from("jobs").insert({
      customer_id: customerId || null,
      date,
      status,
      areas: areas || null,
      paint_colors: paintColors || null,
      finish: finish || null,
      materials: materials || null,
      notes: notes || null,
    });

    resetForm();
    setShowForm(false);
    setSubmitting(false);
    fetchJobs();
  };

  const today = new Date().toISOString().split("T")[0];
  const upcomingJobs = jobs.filter((j) => j.date >= today && j.status !== "done");
  const pastJobs = jobs.filter((j) => j.date < today || j.status === "done");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            New Job
          </button>
        )}
      </div>

      {/* New Job Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-gray-200 bg-white p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">New Job</h2>
            <button
              type="button"
              onClick={() => { setShowForm(false); resetForm(); }}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "scheduled" | "in_progress" | "done")}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Finish</label>
              <select
                value={finish}
                onChange={(e) => setFinish(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select finish</option>
                {finishOptions.map((f) => (
                  <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Areas</label>
              <input
                value={areas}
                onChange={(e) => setAreas(e.target.value)}
                placeholder="e.g., Living room, Kitchen, Master bedroom"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Paint Colors</label>
              <input
                value={paintColors}
                onChange={(e) => setPaintColors(e.target.value)}
                placeholder="e.g., SW Agreeable Gray, BM White Dove"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Materials Needed</label>
              <textarea
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                rows={2}
                placeholder="e.g., 3 gal paint, primer, drop cloths..."
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Any special instructions..."
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); resetForm(); }}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Job"}
            </button>
          </div>
        </form>
      )}

      {/* Upcoming Jobs */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Jobs</h2>
        {upcomingJobs.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming jobs.</p>
        ) : (
          <div className="space-y-3">
            {upcomingJobs.map((job) => (
              <Link
                key={job.id}
                href={`/app/jobs/${job.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{getCustomerName(job)}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(job.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[job.status]}`}>
                    {statusLabels[job.status]}
                  </span>
                </div>
                {job.notes && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{job.notes}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Past Jobs */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Past Jobs</h2>
        {pastJobs.length === 0 ? (
          <p className="text-sm text-gray-500">No past jobs.</p>
        ) : (
          <div className="space-y-3">
            {pastJobs.map((job) => (
              <Link
                key={job.id}
                href={`/app/jobs/${job.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{getCustomerName(job)}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(job.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[job.status]}`}>
                    {statusLabels[job.status]}
                  </span>
                </div>
                {job.notes && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{job.notes}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
