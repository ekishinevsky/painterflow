"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Customer {
  id: string;
  name: string;
}

interface LineItem {
  label: string;
  quantity: number;
  rate: number;
}

interface Estimate {
  id: string;
  total: number;
  created_at: string;
  customers: { name: string }[] | { name: string } | null;
}

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { label: "", quantity: 1, rate: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const fetchEstimates = async () => {
    const { data } = await supabase
      .from("estimates")
      .select("id, total, created_at, customers(name)")
      .order("created_at", { ascending: false });
    setEstimates(data ?? []);
  };

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from("customers")
      .select("id, name")
      .order("name");
    setCustomers(data ?? []);
  };

  useEffect(() => {
    fetchEstimates();
    fetchCustomers();
  }, []);

  const total = items.reduce((sum, i) => sum + i.quantity * i.rate, 0);

  const updateItem = (index: number, field: keyof LineItem, value: string) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "label" ? value : parseFloat(value) || 0,
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { label: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || items.length === 0) return;
    setSubmitting(true);

    const { data: estimate } = await supabase
      .from("estimates")
      .insert({ customer_id: customerId, total })
      .select("id")
      .single();

    if (estimate) {
      await supabase.from("estimate_items").insert(
        items.map((item) => ({
          estimate_id: estimate.id,
          label: item.label,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.quantity * item.rate,
        }))
      );
    }

    setCustomerId("");
    setItems([{ label: "", quantity: 1, rate: 0 }]);
    setShowForm(false);
    setSubmitting(false);
    fetchEstimates();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Estimates</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            New Estimate
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-md border border-gray-200 bg-white p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer *</label>
            <select
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Line Items</label>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    required
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) => updateItem(i, "label", e.target.value)}
                    className="flex-1 min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(i, "quantity", e.target.value)}
                    className="w-16 rounded-md border border-gray-300 px-2 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateItem(i, "rate", e.target.value)}
                    className="w-24 rounded-md border border-gray-300 px-2 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="w-20 text-right text-sm text-gray-600">
                    ${(item.quantity * item.rate).toFixed(2)}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              + Add line item
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-lg font-bold text-gray-900">
              Total: ${total.toFixed(2)}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setCustomerId("");
                  setItems([{ label: "", quantity: 1, rate: 0 }]);
                }}
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Estimate"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {estimates.length === 0 && !showForm && (
          <p className="text-sm text-gray-500">No estimates yet.</p>
        )}
        {estimates.map((est) => (
          <div key={est.id} className="rounded-md border border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                {(Array.isArray(est.customers) ? est.customers[0]?.name : est.customers?.name) ?? "Unknown customer"}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(est.created_at).toLocaleDateString()}
              </p>
            </div>
            <p className="text-lg font-bold text-gray-900">
              ${est.total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
