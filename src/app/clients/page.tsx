"use client";

import { useEffect, useState, useCallback } from "react";
import { UserPlus, AlertCircle, RefreshCw } from "lucide-react";
import { Client } from "@/types/client";
import { clientsService } from "@/services/clients.service";
import { ClientsTable } from "@/components/clients/clients-table";
import { ClientForm } from "@/components/clients/client-form";
import { DeleteClientDialog } from "@/components/clients/delete-client-dialog";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  // undefined = form closed, null = creating new, Client = editing
  const [formClient, setFormClient] = useState<Client | null | undefined>(
    undefined
  );
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientsService.list();
      setClients(data);
    } catch {
      setError("Não foi possível carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  async function handleSave(data: Omit<Client, "id" | "createdAt">) {
    if (formClient) {
      const updated = await clientsService.update(formClient.id, data);
      setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      const created = await clientsService.create(data);
      setClients((prev) => [created, ...prev]);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await clientsService.delete(deleteTarget.id);
    setClients((prev) => prev.filter((c) => c.id !== deleteTarget.id));
  }

  return (
    <div className="p-6 pt-14 lg:pt-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gerencie os clientes cadastrados
          </p>
        </div>
        <button
          onClick={() => setFormClient(null)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <UserPlus size={16} />
          Novo cliente
        </button>
      </div>

      {error ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center gap-3 text-center">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-gray-600 font-medium">{error}</p>
          <button
            onClick={fetchClients}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <RefreshCw size={14} />
            Tentar novamente
          </button>
        </div>
      ) : (
        <ClientsTable
          clients={clients}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          onEdit={(c) => setFormClient(c)}
          onDelete={(c) => setDeleteTarget(c)}
        />
      )}

      {formClient !== undefined && (
        <ClientForm
          client={formClient}
          onClose={() => setFormClient(undefined)}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteClientDialog
          client={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
