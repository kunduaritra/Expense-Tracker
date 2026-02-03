// ============================================================================
// ADVANCED ANALYTICS — src/pages/Insights.jsx  (REPLACE ENTIRE FILE)
// ============================================================================
import React, { useState, useMemo } from "react";
import { useExpense } from "../hooks/useExpenses";
import Card from "../components/common/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { EXPENSE_CATEGORIES } from "../utils/constants";

// ── helpers ──
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const Insights = () => {
  const { transactions } = useExpense();
  const [activeTab, setActiveTab] = useState("overview"); // overview | dayTime | merchants | predictions

  // ── derived data ──────────────────────────────────────────────
  const expenses = useMemo(
    () => transactions.filter((t) => t.type === "expense"),
    [transactions],
  );
  const incomes = useMemo(
    () => transactions.filter((t) => t.type === "income"),
    [transactions],
  );

  // Monthly trend (last 6 months)
  const monthlyTrend = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const exp = expenses
        .filter((t) => t.date.startsWith(key))
        .reduce((s, t) => s + t.amount, 0);
      const inc = incomes
        .filter((t) => t.date.startsWith(key))
        .reduce((s, t) => s + t.amount, 0);
      return {
        month: MONTHS[d.getMonth()],
        expense: exp,
        income: inc,
        savings: inc - exp,
      };
    });
  }, [expenses, incomes]);

  // Category pie
  const categoryPie = useMemo(() => {
    const now = new Date();
    const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return EXPENSE_CATEGORIES.map((cat) => ({
      name: cat.name,
      value: expenses
        .filter((t) => t.date.startsWith(key) && t.category === cat.id)
        .reduce((s, t) => s + t.amount, 0),
      color: cat.color,
    }))
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Day-of-week spending
  const dayOfWeek = useMemo(() => {
    const buckets = DAYS.map((d) => ({ day: d, amount: 0, count: 0 }));
    expenses.forEach((t) => {
      const idx = new Date(t.date).getDay();
      buckets[idx].amount += t.amount;
      buckets[idx].count += 1;
    });
    return buckets;
  }, [expenses]);

  // Hourly spending (using createdAt or fallback hour 12)
  const hourlySpend = useMemo(() => {
    const buckets = Array.from({ length: 24 }, (_, h) => ({
      hour: `${h}:00`,
      amount: 0,
    }));
    expenses.forEach((t) => {
      const h = t.createdAt ? new Date(t.createdAt).getHours() : 12;
      buckets[h].amount += t.amount;
    });
    return buckets;
  }, [expenses]);

  // Top merchants
  const topMerchants = useMemo(() => {
    const map = {};
    expenses.forEach((t) => {
      const m = t.description || t.category || "Unknown";
      if (!map[m]) map[m] = { name: m, total: 0, count: 0 };
      map[m].total += t.amount;
      map[m].count += 1;
    });
    return Object.values(map)
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [expenses]);

  // Predictions
  const predictions = useMemo(() => {
    const now = new Date();
    const thisKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const lastKey = (() => {
      const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    })();

    const thisMonthExp = expenses
      .filter((t) => t.date.startsWith(thisKey))
      .reduce((s, t) => s + t.amount, 0);
    const lastMonthExp = expenses
      .filter((t) => t.date.startsWith(lastKey))
      .reduce((s, t) => s + t.amount, 0);
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    const projectedExpense =
      dayOfMonth > 0 ? (thisMonthExp / dayOfMonth) * daysInMonth : 0;
    const change =
      lastMonthExp > 0
        ? ((thisMonthExp - lastMonthExp) / lastMonthExp) * 100
        : 0;

    // Per-category prediction
    const catPredictions = EXPENSE_CATEGORIES.map((cat) => {
      const thisVal = expenses
        .filter((t) => t.date.startsWith(thisKey) && t.category === cat.id)
        .reduce((s, t) => s + t.amount, 0);
      const lastVal = expenses
        .filter((t) => t.date.startsWith(lastKey) && t.category === cat.id)
        .reduce((s, t) => s + t.amount, 0);
      const projected =
        dayOfMonth > 0 ? (thisVal / dayOfMonth) * daysInMonth : 0;
      return { ...cat, thisMonth: thisVal, lastMonth: lastVal, projected };
    })
      .filter((c) => c.projected > 0)
      .sort((a, b) => b.projected - a.projected)
      .slice(0, 5);

    return {
      thisMonthExp,
      lastMonthExp,
      projectedExpense,
      change,
      catPredictions,
    };
  }, [expenses]);

  // ── shared tooltip style ──
  const tooltipStyle = {
    backgroundColor: "#1A1A1A",
    border: "1px solid #2D2D2D",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "13px",
  };

  // ── TAB RENDERERS ─────────────────────────────────────────────
  const renderOverview = () => (
    <div className="space-y-5">
      {/* Monthly Income vs Expense Line */}
      <Card>
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-purple-400" /> 6-Month Trend
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
            <XAxis dataKey="month" stroke="#6B7280" tick={{ fontSize: 12 }} />
            <YAxis
              stroke="#6B7280"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [`₹${Number(v).toLocaleString()}`, undefined]}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "#9CA3AF" }} />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              name="Income"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#EF4444"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              name="Expense"
            />
            <Line
              type="monotone"
              dataKey="savings"
              stroke="#8B5CF6"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={false}
              name="Savings"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Pie */}
      <Card>
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <ShoppingBag size={18} className="text-pink-400" /> This Month – By
          Category
        </h3>
        {categoryPie.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No expenses this month
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={categoryPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryPie.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => `₹${Number(v).toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend list */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
              {categoryPie.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-gray-300"
                >
                  <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ background: c.color }}
                  />
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const renderDayTime = () => (
    <div className="space-y-5">
      {/* Day-of-week bar */}
      <Card>
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-blue-400" /> Spending by Day of
          Week
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dayOfWeek}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
            <XAxis dataKey="day" stroke="#6B7280" tick={{ fontSize: 12 }} />
            <YAxis
              stroke="#6B7280"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Spent"]}
            />
            <Bar dataKey="amount" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Day-of-week summary cards */}
      <div className="grid grid-cols-4 gap-2">
        {dayOfWeek.map((d) => (
          <Card key={d.day} className="p-3 text-center">
            <p className="text-xs text-gray-400">{d.day}</p>
            <p className="font-bold text-sm mt-1">{formatCurrency(d.amount)}</p>
            <p className="text-xs text-gray-500">{d.count} txns</p>
          </Card>
        ))}
      </div>

      {/* Hourly */}
      <Card>
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Clock size={18} className="text-cyan-400" /> Spending by Time of Day
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={hourlySpend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
            <XAxis
              dataKey="hour"
              stroke="#6B7280"
              tick={{ fontSize: 10 }}
              interval={2}
            />
            <YAxis
              stroke="#6B7280"
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Spent"]}
            />
            <Bar dataKey="amount" fill="#EC4899" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );

  const renderMerchants = () => (
    <div className="space-y-5">
      {/* Top merchants bar */}
      <Card>
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <ShoppingBag size={18} className="text-orange-400" /> Top Merchants /
          Descriptions
        </h3>
        {topMerchants.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No merchant data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={topMerchants}
              layout="vertical"
              margin={{ left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
              <XAxis
                type="number"
                stroke="#6B7280"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#6B7280"
                tick={{ fontSize: 11 }}
                width={90}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Total"]}
              />
              <Bar dataKey="total" fill="#F59E0B" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Merchant list with count */}
      <Card>
        <h3 className="text-base font-semibold mb-3">Merchant Details</h3>
        <div className="space-y-2">
          {topMerchants.map((m, i) => {
            const pct =
              topMerchants[0].total > 0
                ? (m.total / topMerchants[0].total) * 100
                : 0;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-dark-bg flex items-center justify-center text-xs font-bold text-gray-400">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium truncate">{m.name}</span>
                    <span className="text-gray-400 ml-2 flex-shrink-0">
                      {m.count} time{m.count > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-1.5 bg-dark-bg rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: "#F59E0B" }}
                    />
                  </div>
                </div>
                <span className="font-bold text-sm flex-shrink-0">
                  {formatCurrency(m.total)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );

  const renderPredictions = () => (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">This Month So Far</p>
          <p className="text-xl font-bold text-red-400">
            {formatCurrency(predictions.thisMonthExp)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">Last Month</p>
          <p className="text-xl font-bold text-gray-300">
            {formatCurrency(predictions.lastMonthExp)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">Projected (End of Month)</p>
          <p className="text-xl font-bold text-purple-400">
            {formatCurrency(predictions.projectedExpense)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">vs Last Month</p>
          <p
            className={`text-xl font-bold flex items-center gap-1 ${predictions.change >= 0 ? "text-red-400" : "text-green-400"}`}
          >
            {predictions.change >= 0 ? (
              <TrendingUp size={18} />
            ) : (
              <TrendingDown size={18} />
            )}
            {Math.abs(predictions.change).toFixed(1)}%
          </p>
        </Card>
      </div>

      {/* Prediction per category */}
      <Card>
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-purple-400" /> Category
          Predictions
        </h3>
        <div className="space-y-4">
          {predictions.catPredictions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Not enough data</p>
          ) : (
            predictions.catPredictions.map((cat, i) => {
              const cat_info = EXPENSE_CATEGORIES.find((c) => c.id === cat.id);
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span>{cat_info?.emoji}</span>
                      <span className="text-sm font-medium">
                        {cat_info?.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">Projected: </span>
                      <span className="text-sm font-bold text-purple-400">
                        {formatCurrency(cat.projected)}
                      </span>
                    </div>
                  </div>
                  {/* bar: actual vs projected */}
                  <div className="h-3 bg-dark-bg rounded-full overflow-hidden flex">
                    <div
                      className="h-full"
                      style={{
                        width: `${cat.projected > 0 ? (cat.thisMonth / cat.projected) * 100 : 0}%`,
                        background: cat_info?.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Spent so far: {formatCurrency(cat.thisMonth)}</span>
                    <span>Last month: {formatCurrency(cat.lastMonth)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* AI insight text cards */}
      <Card>
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-green-400" /> Smart Insights
        </h3>
        <div className="space-y-2">
          {(() => {
            const tips = [];
            if (predictions.change > 20)
              tips.push({
                icon: "⚠️",
                text: `Spending is up ${predictions.change.toFixed(0)}% vs last month. Watch your budget!`,
                color: "text-orange-400",
              });
            if (predictions.change < -10)
              tips.push({
                icon: "🎉",
                text: `Great job! Spending down ${Math.abs(predictions.change).toFixed(0)}% compared to last month.`,
                color: "text-green-400",
              });
            const topCat = predictions.catPredictions[0];
            if (topCat)
              tips.push({
                icon: "📌",
                text: `Your biggest spend is on ${EXPENSE_CATEGORIES.find((c) => c.id === topCat.id)?.name} – projected ₹${topCat.projected.toLocaleString()} this month.`,
                color: "text-blue-400",
              });
            const peakDay = [...dayOfWeek].sort(
              (a, b) => b.amount - a.amount,
            )[0];
            if (peakDay && peakDay.amount > 0)
              tips.push({
                icon: "📅",
                text: `You spend the most on ${peakDay.day}s (₹${peakDay.amount.toLocaleString()}).`,
                color: "text-purple-400",
              });
            if (tips.length === 0)
              tips.push({
                icon: "💡",
                text: "Add more transactions to unlock deeper insights.",
                color: "text-gray-400",
              });
            return tips;
          })().map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-dark-bg rounded-xl"
            >
              <span className="text-lg">{tip.icon}</span>
              <p className={`text-sm ${tip.color}`}>{tip.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="text-purple-400" /> Insights
        </h1>
        <p className="text-gray-400">Understand your money better</p>
      </div>

      {/* Tab Bar */}
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {[
          { id: "overview", label: "📊 Overview" },
          { id: "dayTime", label: "🕐 Day & Time" },
          { id: "merchants", label: "🏪 Merchants" },
          { id: "predictions", label: "🔮 Predictions" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-purple-500 text-white" : "bg-dark-card text-gray-400 hover:text-white"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "dayTime" && renderDayTime()}
      {activeTab === "merchants" && renderMerchants()}
      {activeTab === "predictions" && renderPredictions()}
    </div>
  );
};

export default Insights;
