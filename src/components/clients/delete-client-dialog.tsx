"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Client } from "@/types/client";

interface DeleteClientDialogProps {
  client: Client;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteClientDialog({
  client,
  onClose,
  onConfirm,
}: DeleteClientDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Remover cliente
          </h2>
          <p className="text-sm text-gray-500">
            Tem certeza que deseja remover{" "}
            <strong className="text-gray-700">{client.name}</strong>? Esta ação
            não pode ser desfeita.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Removendo..." : "Remover"}
          </button>
        </div>
      </div>
    </div>
  );
}
