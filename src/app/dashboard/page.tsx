"use client";

import { useEffect, useState } from "react";
import { Users, MessageSquare, ShoppingCart, HelpCircle } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import {
  ConversationsChart,
  IntentionChart,
} from "@/components/dashboard/conversations-chart";
import { clientsService } from "@/services/clients.service";
import { dashboardService } from "@/services/dashboard.service";
import { ChartDataPoint } from "@/types/dashboard";

export default function DashboardPage() {
  const [totalClients, setTotalClients] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [orderMessages, setOrderMessages] = useState(0);
  const [otherMessages, setOtherMessages] = useState(0);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [clients, stats] = await Promise.all([
          clientsService.list(),
          dashboardService.getStats(),
        ]);
        setTotalClients(clients.length);
        setTotalMessages(stats.totalMessages);
        setOrderMessages(stats.orderMessages);
        setOtherMessages(stats.otherMessages);
        setChartData(stats.chartData);
      } catch {
        setError("Não foi possível carregar os dados do dashboard.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm text-red-500 underline hover:text-red-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 pt-14 lg:pt-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Visão geral dos atendimentos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={Users}
          title="Clientes cadastrados"
          value={loading ? "—" : totalClients}
          description="Total de clientes na base"
          variant="indigo"
          loading={loading}
        />
        <MetricCard
          icon={MessageSquare}
          title="Mensagens atendidas"
          value={loading ? "—" : totalMessages}
          description="Total de mensagens trocadas"
          variant="emerald"
          loading={loading}
        />
        <MetricCard
          icon={ShoppingCart}
          title="Sobre pedidos"
          value={loading ? "—" : orderMessages}
          description="Classificadas como ORDER"
          variant="violet"
          loading={loading}
        />
        <MetricCard
          icon={HelpCircle}
          title="Outro assunto"
          value={loading ? "—" : otherMessages}
          description="Classificadas como OTHER"
          variant="amber"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ConversationsChart data={chartData} loading={loading} />
        </div>
        <div>
          <IntentionChart
            orderQuestions={orderMessages}
            otherQuestions={otherMessages}
          />
        </div>
      </div>
    </div>
  );
}
