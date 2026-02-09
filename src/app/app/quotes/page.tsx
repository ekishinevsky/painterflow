"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
}

interface EstimateItem {
  label: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Estimate {
  id: string;
  total: number;
  customer_id: string;
  customers: Customer | Customer[] | null;
}

interface Quote {
  id: string;
  quote_number: number;
  estimate_id: string | null;
  customer_id: string | null;
  valid_until: string | null;
  tax_rate: number;
  subtotal: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  terms: string | null;
  status: "draft" | "sent" | "accepted" | "rejected";
  created_at: string;
  customers: Customer | Customer[] | null;
}

function getCustomer(item: { customers: Customer | Customer[] | null }): Customer | null {
  if (!item.customers) return null;
  if (Array.isArray(item.customers)) return item.customers[0] ?? null;
  return item.customers;
}

const statusColors = {
  draft: "bg-neutral-500/20 text-neutral-400",
  sent: "bg-blue-500/20 text-blue-400",
  accepted: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
};

const statusLabels = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  rejected: "Rejected",
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [quoteItems, setQuoteItems] = useState<EstimateItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [estimateId, setEstimateId] = useState("");
  const [validDays, setValidDays] = useState(30);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("Payment due within 30 days of project completion. 50% deposit required to begin work.");

  const fetchQuotes = async () => {
    const { data } = await supabase
      .from("quotes")
      .select("*, customers(*)")
      .order("created_at", { ascending: false });
    setQuotes(data ?? []);
  };

  const fetchEstimates = async () => {
    const { data } = await supabase
      .from("estimates")
      .select("id, total, customer_id, customers(*)")
      .order("created_at", { ascending: false });
    setEstimates(data ?? []);
  };

  useEffect(() => {
    fetchQuotes();
    fetchEstimates();
  }, []);

  const selectedEstimate = estimates.find((e) => e.id === estimateId);
  const subtotal = selectedEstimate?.total ?? 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estimateId || !selectedEstimate) return;
    setSubmitting(true);

    const customer = getCustomer(selectedEstimate);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validDays);

    await supabase.from("quotes").insert({
      estimate_id: estimateId,
      customer_id: customer?.id || null,
      valid_until: validUntil.toISOString().split("T")[0],
      tax_rate: taxRate,
      subtotal: subtotal,
      tax_amount: taxAmount,
      total: total,
      notes: notes || null,
      terms: terms || null,
      status: "draft",
    });

    setEstimateId("");
    setValidDays(30);
    setTaxRate(0);
    setNotes("");
    setShowForm(false);
    setSubmitting(false);
    fetchQuotes();
  };

  const handleDeleteQuote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quote?")) return;
    await supabase.from("quotes").delete().eq("id", id);
    fetchQuotes();
  };

  const viewQuote = async (quote: Quote) => {
    setSelectedQuote(quote);
    // Fetch estimate items for this quote
    if (quote.estimate_id) {
      const { data } = await supabase
        .from("estimate_items")
        .select("label, quantity, rate, amount")
        .eq("estimate_id", quote.estimate_id);
      setQuoteItems(data ?? []);
    } else {
      setQuoteItems([]);
    }
  };

  const updateQuoteStatus = async (id: string, status: Quote["status"]) => {
    await supabase.from("quotes").update({ status }).eq("id", id);
    fetchQuotes();
    if (selectedQuote?.id === id) {
      setSelectedQuote({ ...selectedQuote, status });
    }
  };

  // Quote detail view
  if (selectedQuote) {
    const customer = getCustomer(selectedQuote);
    return (
      <div>
        <button
          onClick={() => setSelectedQuote(null)}
          className="mb-4 text-sm text-neutral-400 hover:text-white flex items-center gap-1"
        >
          ← Back to Quotes
        </button>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
          {/* Quote Header */}
          <div className="flex items-start justify-between border-b border-neutral-800 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Quote #{selectedQuote.quote_number}</h1>
              <p className="text-sm text-neutral-400 mt-1">
                Created {new Date(selectedQuote.created_at).toLocaleDateString()}
              </p>
              {selectedQuote.valid_until && (
                <p className="text-sm text-neutral-400">
                  Valid until {new Date(selectedQuote.valid_until).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedQuote.status}
                onChange={(e) => updateQuoteStatus(selectedQuote.id, e.target.value as Quote["status"])}
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white focus:border-green-500 focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Customer Info */}
          {customer && (
            <div className="py-6 border-b border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-400 mb-2">BILL TO</h2>
              <p className="text-white font-semibold">{customer.name}</p>
              {customer.address && <p className="text-sm text-neutral-400">{customer.address}</p>}
              {customer.phone && <p className="text-sm text-neutral-400">{customer.phone}</p>}
              {customer.email && <p className="text-sm text-neutral-400">{customer.email}</p>}
            </div>
          )}

          {/* Line Items */}
          <div className="py-6 border-b border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-400 mb-4">ITEMS</h2>
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-neutral-400 pb-2 border-b border-neutral-800">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              {quoteItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 text-sm py-2">
                  <div className="col-span-6 text-white">{item.label}</div>
                  <div className="col-span-2 text-right text-neutral-400">{item.quantity}</div>
                  <div className="col-span-2 text-right text-neutral-400">${item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right text-white">${item.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="py-6 border-b border-neutral-800">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="text-white">${selectedQuote.subtotal.toFixed(2)}</span>
                </div>
                {selectedQuote.tax_rate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Tax ({selectedQuote.tax_rate}%)</span>
                    <span className="text-white">${selectedQuote.tax_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
                  <span className="text-white">Total</span>
                  <span className="text-green-500">${selectedQuote.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {(selectedQuote.notes || selectedQuote.terms) && (
            <div className="py-6 space-y-4">
              {selectedQuote.notes && (
                <div>
                  <h2 className="text-sm font-medium text-neutral-400 mb-1">NOTES</h2>
                  <p className="text-sm text-white">{selectedQuote.notes}</p>
                </div>
              )}
              {selectedQuote.terms && (
                <div>
                  <h2 className="text-sm font-medium text-neutral-400 mb-1">TERMS & CONDITIONS</h2>
                  <p className="text-sm text-white">{selectedQuote.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Quotes</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-black hover:bg-green-400 transition-colors"
          >
            New Quote
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Create Quote</h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-neutral-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300">Select Estimate *</label>
            <select
              required
              value={estimateId}
              onChange={(e) => setEstimateId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="">Choose an estimate</option>
              {estimates.map((est) => {
                const customer = getCustomer(est);
                return (
                  <option key={est.id} value={est.id}>
                    {customer?.name ?? "Unknown"} - ${est.total.toFixed(2)}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300">Valid for (days)</label>
              <input
                type="number"
                min="1"
                value={validDays}
                onChange={(e) => setValidDays(parseInt(e.target.value) || 30)}
                className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300">Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any additional notes for the customer..."
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300">Terms & Conditions</label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {selectedEstimate && (
            <div className="rounded-lg bg-neutral-800 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Tax ({taxRate}%)</span>
                  <span className="text-white">${taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-700">
                <span className="text-white">Total</span>
                <span className="text-green-500">${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !estimateId}
              className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-black hover:bg-green-400 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Creating..." : "Create Quote"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {quotes.length === 0 && !showForm && (
          <p className="text-sm text-neutral-500">No quotes yet. Create your first quote from an estimate.</p>
        )}
        {quotes.map((quote) => {
          const customer = getCustomer(quote);
          return (
            <div key={quote.id} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => viewQuote(quote)}
                >
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-white">Quote #{quote.quote_number}</p>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[quote.status]}`}>
                      {statusLabels[quote.status]}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">
                    {customer?.name ?? "Unknown customer"} • {new Date(quote.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-green-500">${quote.total.toFixed(2)}</p>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuote(quote.id)}
                    className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
