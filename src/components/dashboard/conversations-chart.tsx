"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ChartDataPoint } from "@/types/dashboard";

interface ConversationsChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

export function ConversationsChart({ data, loading }: ConversationsChartProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Evolução dos atendimentos (últimos 7 dias)
      </h3>
      {loading && (
        <div className="h-[200px] flex items-center justify-center">
          <div className="w-full h-32 bg-gray-100 rounded animate-pulse" />
        </div>
      )}
      {!loading && (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAtendimentos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#374151", fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="atendimentos"
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#colorAtendimentos)"
              dot={{ fill: "#6366F1", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

interface IntentionChartProps {
  orderQuestions: number;
  otherQuestions: number;
}

const COLORS = ["#6366F1", "#10B981"];

export function IntentionChart({ orderQuestions, otherQuestions }: IntentionChartProps) {
  const total = orderQuestions + otherQuestions;

  const data = [
    { name: "Pergunta sobre pedido", value: orderQuestions },
    { name: "Outro assunto", value: otherQuestions },
  ];

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribuição de intenções</h3>
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <p className="text-gray-400 text-sm">Nenhuma conversa ainda</p>
          <p className="text-gray-300 text-xs mt-1">Inicie um atendimento no Chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribuição de intenções</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "12px" }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", color: "#6B7280" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
