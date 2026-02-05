"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"scheduled" | "in_progress" | "done">("scheduled");
  const [areas, setAreas] = useState("");
  const [paintColors, setPaintColors] = useState("");
  const [finish, setFinish] = useState("");
  const [materials, setMaterials] = useState("");
  const [notes, setNotes] = useState("");

  const fetchJob = async () => {
    const { data } = await supabase
      .from("jobs")
      .select("*, customers(name)")
      .eq("id", jobId)
      .single();

    if (data) {
      setJob(data);
      setCustomerId(data.customer_id ?? "");
      setDate(data.date);
      setStatus(data.status);
      setAreas(data.areas ?? "");
      setPaintColors(data.paint_colors ?? "");
      setFinish(data.finish ?? "");
      setMaterials(data.materials ?? "");
      setNotes(data.notes ?? "");
    }
    setLoading(false);
  };

  const fetchCustomers = async () => {
    const { data } = await supabase.from("customers").select("id, name").order("name");
    setCustomers(data ?? []);
  };

  useEffect(() => {
    fetchJob();
    fetchCustomers();
  }, [jobId]);

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from("jobs")
      .update({
        customer_id: customerId || null,
        date,
        status,
        areas: areas || null,
        paint_colors: paintColors || null,
        finish: finish || null,
        materials: materials || null,
        notes: notes || null,
      })
      .eq("id", jobId);

    await fetchJob();
    setEditing(false);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Job not found.</p>
        <Link href="/app/jobs" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/app/jobs" className="text-sm text-blue-600 hover:underline">
            &larr; Back to Jobs
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{getCustomerName(job)}</h1>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </div>

      {/* View Mode */}
      {!editing && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {new Date(job.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusColors[job.status]}`}>
              {statusLabels[job.status]}
            </span>
          </div>

          {job.areas && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Areas</p>
              <p className="mt-1 text-gray-900">{job.areas}</p>
            </div>
          )}

          {job.paint_colors && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Paint Colors</p>
              <p className="mt-1 text-gray-900">{job.paint_colors}</p>
            </div>
          )}

          {job.finish && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Finish</p>
              <p className="mt-1 text-gray-900 capitalize">{job.finish}</p>
            </div>
          )}

          {job.materials && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Materials Needed</p>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{job.materials}</p>
            </div>
          )}

          {job.notes && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</p>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{job.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Edit Mode */}
      {editing && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 space-y-4">
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
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
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
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                // Reset to original values
                if (job) {
                  setCustomerId(job.customer_id ?? "");
                  setDate(job.date);
                  setStatus(job.status);
                  setAreas(job.areas ?? "");
                  setPaintColors(job.paint_colors ?? "");
                  setFinish(job.finish ?? "");
                  setMaterials(job.materials ?? "");
                  setNotes(job.notes ?? "");
                }
              }}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
