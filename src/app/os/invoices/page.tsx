"use client";

import { useState } from "react";
import { Plus, Eye, Download } from "lucide-react";

const INVOICES = [
  { id: "INV-2025-001", client: "BioMarket", date: "01/03/2025", echeance: "31/03/2025", montant: 2500, statut: "payee" },
  { id: "INV-2025-002", client: "TechFlow SaaS", date: "01/03/2025", echeance: "31/03/2025", montant: 1200, statut: "envoyee" },
  { id: "INV-2025-003", client: "FitZone", date: "01/03/2025", echeance: "31/03/2025", montant: 600, statut: "envoyee" },
  { id: "INV-2025-004", client: "BioMarket", date: "01/02/2025", echeance: "28/02/2025", montant: 2500, statut: "payee" },
  { id: "INV-2025-005", client: "TechFlow SaaS", date: "01/02/2025", echeance: "28/02/2025", montant: 1200, statut: "payee" },
  { id: "INV-2025-006", client: "Immo Premium", date: "20/01/2025", echeance: "20/02/2025", montant: 800, statut: "retard" },
];

const STATUT_STYLE: Record<string, string> = {
  payee: "badge-green",
  envoyee: "badge-blue",
  brouillon: "badge-amber",
  retard: "badge-red",
};

const STATUT_LABEL: Record<string, string> = {
  payee: "Payée",
  envoyee: "Envoyée",
  brouillon: "Brouillon",
  retard: "En retard",
};

export default function InvoicesPage() {
  const totalCA = INVOICES.reduce((s, i) => s + i.montant, 0);
  const totalPaye = INVOICES.filter((i) => i.statut === "payee").reduce((s, i) => s + i.montant, 0);
  const totalEnAttente = INVOICES.filter((i) => i.statut === "envoyee").reduce((s, i) => s + i.montant, 0);
  const totalRetard = INVOICES.filter((i) => i.statut === "retard").reduce((s, i) => s + i.montant, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-mono text-2xl font-semibold tracking-tight" style={{ color: "var(--t)" }}>
            <span className="text-eclat">##</span> Facturation
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--t2)" }}>
            Gestion des factures et suivi des paiements.
          </p>
        </div>
        <button className="btn-os-primary text-[11px]">
          <Plus size={12} /> Nouvelle facture
        </button>
      </div>

      {/* KPI */}
      <div
        className="grid grid-cols-4 gap-px rounded-[7px] overflow-hidden mb-6"
        style={{ background: "var(--line)", border: "1px solid var(--line)" }}
      >
        {[
          { label: "CA TOTAL", value: `${(totalCA / 1000).toFixed(1)}K€`, color: "text-eclat" },
          { label: "PAYÉ", value: `${(totalPaye / 1000).toFixed(1)}K€`, color: "text-green-500" },
          { label: "EN ATTENTE", value: `${(totalEnAttente / 1000).toFixed(1)}K€`, color: "text-blue-400" },
          { label: "EN RETARD", value: `${totalRetard}€`, color: "text-red-400" },
        ].map((k, i) => (
          <div key={i} className="kpi-cell" style={{ background: "var(--bg2)" }}>
            <div className="kpi-label" style={{ color: "var(--t3)" }}>{k.label}</div>
            <div className={`kpi-value ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card-os">
        <table className="table-os">
          <thead>
            <tr>
              <th>N° Facture</th>
              <th>Client</th>
              <th>Date</th>
              <th>Échéance</th>
              <th>Montant HT</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv) => (
              <tr key={inv.id}>
                <td className="font-mono font-medium" style={{ color: "var(--t)" }}>{inv.id}</td>
                <td>{inv.client}</td>
                <td className="font-mono">{inv.date}</td>
                <td className="font-mono">{inv.echeance}</td>
                <td className="font-mono font-medium" style={{ color: "var(--t)" }}>
                  {inv.montant.toLocaleString("fr-FR")}€
                </td>
                <td>
                  <span className={`badge ${STATUT_STYLE[inv.statut]}`}>
                    {STATUT_LABEL[inv.statut]}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn-os text-[9px] py-0.5"><Eye size={10} /></button>
                    <button className="btn-os text-[9px] py-0.5"><Download size={10} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
