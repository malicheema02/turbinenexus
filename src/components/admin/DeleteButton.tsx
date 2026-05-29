"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteButtonProps {
  apiPath: string;
  confirmMessage: string;
  redirectTo: string;
  label?: string;
}

export function DeleteButton({ apiPath, confirmMessage, redirectTo, label = "Delete" }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(confirmMessage)) return;
    setLoading(true);
    try {
      const res = await fetch(apiPath, { method: "DELETE" });
      if (res.ok) {
        router.push(redirectTo);
        router.refresh();
      } else {
        alert("Delete failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}
