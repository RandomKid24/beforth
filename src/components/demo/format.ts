/* All money is INR with Indian digit grouping; all times are 12-hour IST. */

const IST = 'Asia/Kolkata';

export const inr = (n: number) => Math.round(n).toLocaleString('en-IN');
export const rupees = (n: number) => `₹${inr(n)}`;

/**
 * Compact money for summaries: lakh and crore from ₹1,00,000 up, full figures
 * below that. Records and tables always use `rupees()` so the exact amount is
 * one click away.
 */
export function lakh(n: number): string {
  const a = Math.abs(n);
  const s = n < 0 ? '−' : '';
  if (a >= 1e7) return `${s}₹${(a / 1e7).toFixed(2)} Cr`;
  if (a >= 1e5) return `${s}₹${(a / 1e5).toFixed(1)} L`;
  return `${s}₹${inr(a)}`;
}

/** Whole-lakh figure for chart axes, e.g. 7.2 → "₹7.2 L". */
export const lakhK = (thousands: number) => lakh(thousands * 1000);

/* ------------------------------ time ------------------------------ */

/** Minutes since midnight → "9:42 AM". */
export function clock(min: number): string {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, '0');
  return `${h % 12 === 0 ? 12 : h % 12}:${mm} ${h < 12 ? 'AM' : 'PM'}`;
}

/** A real calendar date `offset` days from today, in IST. */
export function dayOf(offset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

export const fmtDay = (offset: number) =>
  dayOf(offset).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: IST });

export const fmtLongDay = (offset = 0) =>
  dayOf(offset).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: IST });

/** "Today, 9:42 AM" / "Yesterday, 4:00 PM" / "28 Sep". */
export function fmtAt(at: number, now: number): string {
  const diff = Math.floor(now / 1440) - Math.floor(at / 1440);
  if (diff <= 0) return clock(at);
  if (diff === 1) return `Yest ${clock(at)}`;
  return fmtDay(Math.floor(at / 1440));
}

export function ago(at: number, now: number): string {
  const d = now - at;
  if (d < 1) return 'just now';
  if (d < 60) return `${Math.round(d)} min ago`;
  if (d < 1440) return `${Math.floor(d / 60)} hr ago`;
  return `${Math.floor(d / 1440)}d ago`;
}

export function duration(mins: number): string {
  const m = Math.abs(Math.round(mins));
  if (m < 60) return `${m}m`;
  if (m < 1440) return `${Math.floor(m / 60)}h ${m % 60}m`;
  return `${Math.floor(m / 1440)}d ${Math.floor((m % 1440) / 60)}h`;
}

/* ------------------------------ csv ------------------------------ */

export function csvEscape(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(headers: string[], rows: (string | number)[][]): string {
  return [headers, ...rows].map((r) => r.map(csvEscape).join(',')).join('\n');
}

export function downloadCsv(filename: string, csv: string) {
  // The BOM lets Excel read the ₹ symbol correctly.
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
