"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Customer {
  id: string;
  name: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  notes: string | null;
  customer_id: string | null;
  customers: { name: string }[] | { name: string } | null;
}

function getCustomerName(evt: CalendarEvent): string | null {
  if (!evt.customers) return null;
  if (Array.isArray(evt.customers)) return evt.customers[0]?.name ?? null;
  return evt.customers.name;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [notes, setNotes] = useState("");

  const fetchEvents = async () => {
    const startOfMonth = new Date(year, month, 1).toISOString();
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

    const { data } = await supabase
      .from("events")
      .select("id, title, start_at, end_at, notes, customer_id, customers(name)")
      .gte("start_at", startOfMonth)
      .lte("start_at", endOfMonth)
      .order("start_at");
    setEvents(data ?? []);
  };

  const fetchCustomers = async () => {
    const { data } = await supabase.from("customers").select("id, name").order("name");
    setCustomers(data ?? []);
  };

  useEffect(() => {
    fetchEvents();
  }, [year, month]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
  };

  const openNewEvent = (day?: number) => {
    setSelectedEvent(null);
    setTitle("");
    setCustomerId("");
    setDate(
      day
        ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        : ""
    );
    setStartTime("09:00");
    setEndTime("10:00");
    setNotes("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    setSubmitting(true);

    await supabase.from("events").insert({
      title,
      customer_id: customerId || null,
      start_at: new Date(`${date}T${startTime}`).toISOString(),
      end_at: new Date(`${date}T${endTime}`).toISOString(),
      notes: notes || null,
    });

    setShowForm(false);
    setSubmitting(false);
    fetchEvents();
  };

  const handleDeleteEvent = async (id: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"? This cannot be undone.`)) return;
    await supabase.from("events").delete().eq("id", id);
    setSelectedEvent(null);
    fetchEvents();
  };

  // Build calendar grid
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });

  const eventsOnDay = (day: number) => {
    return events.filter((evt) => {
      const d = new Date(evt.start_at);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const todayDay = today.getFullYear() === year && today.getMonth() === month ? today.getDate() : -1;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
        <button
          onClick={() => openNewEvent()}
          className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-black hover:bg-green-400 transition-colors"
        >
          New Event
        </button>
      </div>

      {/* Month navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button onClick={prevMonth} className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-400 hover:bg-neutral-800">
          &larr; Prev
        </button>
        <h2 className="text-lg font-semibold text-white">
          {monthName} {year}
        </h2>
        <button onClick={nextMonth} className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-400 hover:bg-neutral-800">
          Next &rarr;
        </button>
      </div>

      {/* Calendar grid */}
      <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-neutral-800 bg-neutral-800/50">
          {dayNames.map((d) => (
            <div key={d} className="px-1 py-2 text-center text-xs font-medium text-neutral-400">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-neutral-800 bg-neutral-900/30" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = eventsOnDay(day);
            const isToday = day === todayDay;

            return (
              <div
                key={day}
                onClick={() => openNewEvent(day)}
                className="min-h-[80px] border-b border-r border-neutral-800 p-1 cursor-pointer hover:bg-neutral-800/50 transition-colors"
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    isToday ? "bg-green-500 text-black" : "text-neutral-300"
                  }`}
                >
                  {day}
                </span>
                <div className="mt-0.5 space-y-0.5">
                  {dayEvents.slice(0, 2).map((evt) => (
                    <button
                      key={evt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(evt);
                        setShowForm(false);
                      }}
                      className="block w-full truncate rounded bg-green-500/20 px-1 py-0.5 text-left text-[10px] font-medium text-green-400 hover:bg-green-500/30"
                    >
                      {formatTime(evt.start_at)} {evt.title}
                    </button>
                  ))}
                  {dayEvents.length > 2 && (
                    <p className="text-[10px] text-neutral-500 px-1">+{dayEvents.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event detail panel */}
      {selectedEvent && !showForm && (
        <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{selectedEvent.title}</h3>
              {getCustomerName(selectedEvent) && (
                <p className="text-sm text-neutral-400">{getCustomerName(selectedEvent)}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDeleteEvent(selectedEvent.id, selectedEvent.title)}
                className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
          <div className="mt-3 space-y-1 text-sm text-neutral-400">
            <p>
              {new Date(selectedEvent.start_at).toLocaleDateString()} &middot;{" "}
              {formatTime(selectedEvent.start_at)} &ndash; {formatTime(selectedEvent.end_at)}
            </p>
            {selectedEvent.notes && <p className="mt-2">{selectedEvent.notes}</p>}
          </div>
        </div>
      )}

      {/* New event form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">New Event</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-neutral-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300">Title *</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="">None</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-neutral-300">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300">Start *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300">End *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
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
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-black hover:bg-green-400 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Saving..." : "Save Event"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
