"use client";

import { useState } from "react";

const PERIODS = ["7j", "30j", "90j", "12m"];

const METRICS = [
  { label: "IMPRESSIONS", value: "1.2M", delta: "+18%", up: true, color: "text-blue-400" },
  { label: "CLICS", value: "47.3K", delta: "+12%", up: true, color: "text-eclat" },
  { label: "CTR MOYEN", value: "3.94%", delta: "+0.3pts", up: true, color: "text-green-500" },
  { label: "COÛT TOTAL", value: "31.7K€", delta: "+8%", up: true, color: "text-amber-500" },
  { label: "CONVERSIONS", value: "847", delta: "+24%", up: true, color: "text-green-500" },
  { label: "CPA MOYEN", value: "37.4€", delta: "-18%", up: false, color: "text-red-400" },
  { label: "ROAS", value: "4.2x", delta: "+0.5x", up: true, color: "text-green-500" },
  { label: "QUALITY SCORE", value: "7.3", delta: "+0.4", up: true, color: "text-blue-400" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30j");

  // Deterministic chart bars (seeded)
  const bars = Array.from({ length: 30 }, (_, i) => {
    const seed = (i * 7 + 13) % 100;
    return 20 + ((seed * 3 + i * 5) % 60) + (i > 20 ? 15 : 0);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-mono text-2xl font-semibold tracking-tight" style={{ color: "var(--t)" }}>
            <span className="text-eclat">##</span> Analytics
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--t2)" }}>
            Performances cross-compte agrégées.
          </p>
        </div>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="font-mono text-[10px] px-3 py-1.5 rounded transition-all"
              style={{
                background: period === p ? "var(--eclat)" : "var(--bg3)",
                color: period === p ? "#0e0f11" : "var(--t3)",
                border: `1px solid ${period === p ? "var(--eclat)" : "var(--line2)"}`,
                fontWeight: period === p ? 600 : 400,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-[7px] overflow-hidden mb-6"
        style={{ background: "var(--line)", border: "1px solid var(--line)" }}
      >
        {METRICS.map((m, i) => (
          <div key={i} className="kpi-cell" style={{ background: "var(--bg2)" }}>
            <div className="kpi-label" style={{ color: "var(--t3)" }}>{m.label}</div>
            <div className={`kpi-value ${m.color}`}>{m.value}</div>
            <div className={`text-[10px] mt-1 ${m.up ? "text-green-500" : "text-red-400"}`}>
              {m.up ? "↑" : "↓"} {m.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card-os">
          <div className="card-os-header">
            <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
              Conversions ({period})
            </span>
          </div>
          <div className="card-os-body">
            <div className="flex items-end gap-[3px] h-[120px]">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm min-h-[4px] transition-all"
                  style={{
                    height: `${h}%`,
                    background: h > 60 ? "var(--eclat)" : h > 40 ? "rgba(108,92,231,0.5)" : "rgba(108,92,231,0.25)",
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 font-mono text-[9px]" style={{ color: "var(--t3)" }}>
              <span>01/02</span>
              <span>15/02</span>
              <span>01/03</span>
            </div>
          </div>
        </div>

        <div className="card-os">
          <div className="card-os-header">
            <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
              Budget par client
            </span>
          </div>
          <div className="card-os-body space-y-3">
            {[
              { name: "BioMarket", pct: 47, val: "15K€", color: "bg-green-500" },
              { name: "TechFlow SaaS", pct: 27, val: "8.5K€", color: "bg-eclat" },
              { name: "Immo Premium", pct: 16, val: "5K€", color: "bg-blue-400" },
              { name: "FitZone", pct: 10, val: "3.2K€", color: "bg-amber-500" },
            ].map((b) => (
              <div key={b.name} className="flex items-center gap-3">
                <span className="font-mono text-[10px] w-[100px] shrink-0 truncate" style={{ color: "var(--t2)" }}>
                  {b.name}
                </span>
                <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: "var(--bg4)" }}>
                  <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%` }} />
                </div>
                <span className="font-mono text-[10px] w-10 text-right" style={{ color: "var(--t2)" }}>
                  {b.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance by campaign type */}
      <div className="card-os mt-5">
        <div className="card-os-header">
          <span className="font-mono text-[11px] font-medium" style={{ color: "var(--t)" }}>
            Performance par type de campagne
          </span>
        </div>
        <table className="table-os">
          <thead>
            <tr>
              <th>Type</th>
              <th>Impressions</th>
              <th>Clics</th>
              <th>CTR</th>
              <th>Coût</th>
              <th>Conv.</th>
              <th>CPA</th>
              <th>ROAS</th>
            </tr>
          </thead>
          <tbody>
            {[
              { type: "Search", imp: "420K", clics: "18.9K", ctr: "4.5%", cout: "12.3K€", conv: "312", cpa: "39€", roas: "3.8x" },
              { type: "Shopping", imp: "380K", clics: "15.2K", ctr: "4.0%", cout: "9.1K€", conv: "285", cpa: "32€", roas: "5.2x" },
              { type: "Performance Max", imp: "310K", clics: "10.5K", ctr: "3.4%", cout: "7.8K€", conv: "198", cpa: "39€", roas: "4.1x" },
              { type: "Display", imp: "89K", clics: "2.7K", ctr: "3.0%", cout: "2.5K€", conv: "52", cpa: "48€", roas: "2.8x" },
            ].map((row) => (
              <tr key={row.type}>
                <td className="font-medium" style={{ color: "var(--t)" }}>{row.type}</td>
                <td className="font-mono">{row.imp}</td>
                <td className="font-mono">{row.clics}</td>
                <td className="font-mono">{row.ctr}</td>
                <td className="font-mono">{row.cout}</td>
                <td className="font-mono font-medium text-green-500">{row.conv}</td>
                <td className="font-mono">{row.cpa}</td>
                <td className="font-mono font-medium text-blue-400">{row.roas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
