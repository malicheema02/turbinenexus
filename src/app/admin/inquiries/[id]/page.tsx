"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Save,
  Loader2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  INQUIRY_STATUS_LABELS,
  INQUIRY_STATUS_COLORS,
  PRIORITY_COLORS,
} from "@/lib/utils";
import type { PublicInquiry } from "@/types";

const STATUSES = ["New", "Contacted", "MeetingScheduled", "OfferMade", "Closed", "Lost"];
const PRIORITIES = ["Low", "Medium", "High"];

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [inquiry, setInquiry] = useState<PublicInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    fetch(`/api/admin/inquiries/${id}`)
      .then((r) => r.json())
      .then(setInquiry)
      .finally(() => setLoading(false));
  }, [id]);

  const saveStatus = async (status: string, priority?: string) => {
    setSaving(true);
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        priority: priority ?? inquiry?.priority,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setInquiry(updated);
    }
    setSaving(false);
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    const log = parseLog(inquiry?.communicationLog ?? null);
    log.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      author: "Admin",
      note: newNote.trim(),
    });
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: inquiry?.status,
        priority: inquiry?.priority,
        communicationLog: JSON.stringify(log),
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setInquiry(updated);
      setNewNote("");
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#1B3A5C]" />
    </div>
  );

  if (!inquiry) return (
    <div className="p-8 text-center text-slate-500">Inquiry not found.</div>
  );

  const log = parseLog(inquiry.communicationLog ?? null);

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            {inquiry.companyName}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Inquiry #{inquiry.id.slice(-8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact & Message */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-bold text-[#0F172A] mb-4">Inquiry Details</h2>
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-[#1B3A5C] shrink-0" />
                <span className="font-semibold">{inquiry.companyName}</span>
                <span className="text-slate-400">·</span>
                <span>{inquiry.contactName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#1B3A5C] shrink-0" />
                <a href={`mailto:${inquiry.contactEmail}`} className="text-[#1B3A5C] hover:underline">
                  {inquiry.contactEmail}
                </a>
              </div>
              {inquiry.contactPhone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-[#1B3A5C] shrink-0" />
                  <span>{inquiry.contactPhone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-[#1B3A5C] shrink-0" />
                <span className="text-slate-500">
                  {new Date(inquiry.createdAt).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {inquiry.equipment && (
                <div className="flex items-center gap-3 text-sm">
                  <Package className="w-4 h-4 text-[#1B3A5C] shrink-0" />
                  <span className="text-slate-600">Asset: </span>
                  <Link
                    href={`/inventory/${(inquiry.equipment as { id: string; title: string; manufacturer: string; model: string; slug?: string }).slug ?? ""}`}
                    className="text-[#1B3A5C] hover:underline font-medium"
                    target="_blank"
                  >
                    {inquiry.equipment.title}
                  </Link>
                </div>
              )}
            </div>
            <div className="bg-[#F8FAFC] rounded-xl p-4 border border-slate-200">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Original Message
              </p>
              <p className="text-slate-700 text-sm whitespace-pre-line">{inquiry.message}</p>
            </div>
          </div>

          {/* Communication Log */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-bold text-[#0F172A] mb-4">Communication Log</h2>
            <div className="space-y-3 mb-5">
              {log.length === 0 ? (
                <p className="text-slate-400 text-sm">No log entries yet.</p>
              ) : (
                log.map((entry) => (
                  <div key={entry.id} className="border-l-2 border-[#1B3A5C]/30 pl-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className="font-semibold text-slate-600">{entry.author}</span>
                      <span>·</span>
                      <span>
                        {new Date(entry.timestamp).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{entry.note}</p>
                  </div>
                ))
              )}
            </div>
            <div className="space-y-2">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note (e.g. Emailed client, awaiting response…)"
                rows={3}
              />
              <Button onClick={addNote} variant="default" size="sm" disabled={saving || !newNote.trim()}>
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <MessageSquare className="w-3.5 h-3.5 mr-1" />}
                Add Note
              </Button>
            </div>
          </div>
        </div>

        {/* Right: CRM Controls */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-[#0F172A] mb-3">Pipeline Status</h3>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => saveStatus(s)}
                  disabled={saving}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all border ${
                    inquiry.status === s
                      ? "border-[#1B3A5C] bg-[#1B3A5C] text-white font-semibold"
                      : "border-slate-200 hover:border-[#1B3A5C]/40 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {INQUIRY_STATUS_LABELS[s] ?? s}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-[#0F172A] mb-3">Priority</h3>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => saveStatus(inquiry.status, p)}
                  disabled={saving}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                    inquiry.priority === p
                      ? "border-[#1B3A5C] bg-[#1B3A5C] text-white"
                      : `border-slate-200 text-slate-600 hover:border-slate-400 ${PRIORITY_COLORS[p] ?? ""}`
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-[#0F172A] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button asChild variant="amber" className="w-full" size="sm">
                <a href={`mailto:${inquiry.contactEmail}?subject=Re: Your Turbine Nexus Inquiry`}>
                  <Mail className="w-3.5 h-3.5 mr-1" />
                  Reply via Email
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <a href="#" target="_blank">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  Schedule Teams Meeting
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LogEntry {
  id: string;
  timestamp: string;
  author: string;
  note: string;
}

function parseLog(json: string | null): LogEntry[] {
  if (!json) return [];
  try {
    return JSON.parse(json) as LogEntry[];
  } catch {
    return [];
  }
}
