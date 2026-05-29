import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPower(mw: number | null | undefined): string {
  if (!mw) return "N/A";
  return `${mw.toFixed(1)} MW`;
}

export function formatHours(hours: number | null | undefined): string {
  if (!hours && hours !== 0) return "N/A";
  return `${hours.toLocaleString()} hrs`;
}

export function parseJsonSafe<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export const STATUS_COLORS: Record<string, string> = {
  Available: "bg-emerald-100 text-emerald-800",
  UnderNegotiation: "bg-amber-100 text-amber-800",
  Sold: "bg-gray-100 text-gray-600",
};

export const STATUS_LABELS: Record<string, string> = {
  Available: "Available",
  UnderNegotiation: "Under Negotiation",
  Sold: "Sold",
};

export const INQUIRY_STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-800",
  Contacted: "bg-purple-100 text-purple-800",
  MeetingScheduled: "bg-yellow-100 text-yellow-800",
  OfferReceived: "bg-amber-100 text-amber-800",
  CounterOfferSent: "bg-orange-100 text-orange-800",
  UnderNDA: "bg-indigo-100 text-indigo-800",
  OfferMade: "bg-orange-100 text-orange-800",
  Closed: "bg-green-100 text-green-800",
  Lost: "bg-red-100 text-red-800",
};

export const INQUIRY_STATUS_LABELS: Record<string, string> = {
  New: "New",
  Contacted: "Contacted",
  MeetingScheduled: "Meeting Scheduled",
  OfferReceived: "Offer Received",
  CounterOfferSent: "Counter-Offer Sent",
  UnderNDA: "Under NDA",
  OfferMade: "Offer Made",
  Closed: "Closed / Won",
  Lost: "Lost",
};

export const PRIORITY_COLORS: Record<string, string> = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-red-100 text-red-700",
};
