"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    setCustomers(data ?? []);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await supabase.from("customers").insert({
      name,
      phone: phone || null,
      email: email || null,
    });

    setName("");
    setPhone("");
    setEmail("");
    setSubmitting(false);
    fetchCustomers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Customers</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add customer"}
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {customers.length === 0 && (
          <p className="text-sm text-gray-500">No customers yet.</p>
        )}
        {customers.map((c) => (
          <div key={c.id} className="rounded-md border border-gray-200 bg-white px-4 py-3">
            <p className="font-medium text-gray-900">{c.name}</p>
            <p className="text-sm text-gray-500">
              {[c.phone, c.email].filter(Boolean).join(" · ") || "No contact info"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
