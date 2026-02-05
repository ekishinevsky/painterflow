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
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <button
          onClick={() => openNewEvent()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Event
        </button>
      </div>

      {/* Month navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button onClick={prevMonth} className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
          &larr; Prev
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {monthName} {year}
        </h2>
        <button onClick={nextMonth} className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
          Next &rarr;
        </button>
      </div>

      {/* Calendar grid */}
      <div className="mt-4 rounded-md border border-gray-200 bg-white overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {dayNames.map((d) => (
            <div key={d} className="px-1 py-2 text-center text-xs font-medium text-gray-500">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-gray-100 bg-gray-50/50" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = eventsOnDay(day);
            const isToday = day === todayDay;

            return (
              <div
                key={day}
                onClick={() => openNewEvent(day)}
                className="min-h-[80px] border-b border-r border-gray-100 p-1 cursor-pointer hover:bg-blue-50/50 transition-colors"
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    isToday ? "bg-blue-600 text-white" : "text-gray-700"
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
                      className="block w-full truncate rounded bg-blue-100 px-1 py-0.5 text-left text-[10px] font-medium text-blue-800 hover:bg-blue-200"
                    >
                      {formatTime(evt.start_at)} {evt.title}
                    </button>
                  ))}
                  {dayEvents.length > 2 && (
                    <p className="text-[10px] text-gray-500 px-1">+{dayEvents.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event detail panel */}
      {selectedEvent && !showForm && (
        <div className="mt-6 rounded-md border border-gray-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
              {getCustomerName(selectedEvent) && (
                <p className="text-sm text-gray-600">{getCustomerName(selectedEvent)}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Close
            </button>
          </div>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
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
        <form onSubmit={handleSubmit} className="mt-6 rounded-md border border-gray-200 bg-white p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">New Event</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Close
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">None</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Event"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
