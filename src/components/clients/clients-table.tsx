"use client";

import { Pencil, Trash2, Search } from "lucide-react";
import { Client } from "@/types/client";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-cyan-500",
];

function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientsTable({
  clients,
  loading,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}: ClientsTableProps) {
  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="px-4 py-3 font-medium text-gray-500">Cliente</th>
              <th className="px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">
                E-mail
              </th>
              <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">
                Telefone
              </th>
              <th className="px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">
                Cadastro
              </th>
              <th className="px-4 py-3 font-medium text-gray-500 text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
                  </td>
                </tr>
              ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  {search
                    ? "Nenhum cliente encontrado para esta busca."
                    : "Nenhum cliente cadastrado ainda."}
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${avatarColor(client.name)}`}
                      >
                        {getInitials(client.name)}
                      </div>
                      <span className="font-medium text-gray-900">
                        {client.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {client.email}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {client.phone}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                    {formatDate(client.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(client)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(client)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remover"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length > 0 && (
        <div className="px-4 py-3 text-xs text-gray-400 border-t border-gray-100">
          {filtered.length}{" "}
          {filtered.length === 1 ? "cliente" : "clientes"}
          {search
            ? filtered.length === 1
              ? " encontrado"
              : " encontrados"
            : filtered.length === 1
              ? " cadastrado"
              : " cadastrados"}
        </div>
      )}
    </div>
  );
}
