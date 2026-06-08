import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Bell,
  Users,
  CheckCircle2,
  BarChart3,
  PieChart,
} from "lucide-react";

// ─── Stat Card ─────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
function StatCard({ icon: Icon, label, value, sub, color = "primary", trend }) {
  const colorMap = {
    primary: "from-primary/10 to-primary/5 border-primary/20 text-primary",
    emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-600",
    amber: "from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-600",
    violet: "from-violet-500/10 to-violet-500/5 border-violet-500/20 text-violet-600",
    rose: "from-rose-500/10 to-rose-500/5 border-rose-500/20 text-rose-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorMap[color] || colorMap.primary} p-5`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium opacity-70">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {sub && <p className="text-xs opacity-60">{sub}</p>}
        </div>
        <div className="rounded-lg bg-background/50 p-2.5 backdrop-blur-sm">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium">
          <span className={trend > 0 ? "text-emerald-600" : "text-rose-600"}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
          <span className="opacity-50">vs last period</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Simple SVG Bar Chart ──────────────────────────────────────────────────
function BarChart({ data = [], height = 180, barColor = "var(--primary)" }) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <BarChart3 className="h-4 w-4" />
        <span>Distribution</span>
      </div>
      <svg
        viewBox={`0 0 ${data.length * 60 + 40} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {data.map((d, i) => {
          const barH = (d.value / max) * (height - 40);
          const x = i * 60 + 20;
          const y = height - 20 - barH;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={32}
                height={barH}
                rx={4}
                fill={barColor}
                opacity={0.8}
                className="hover:opacity-100 transition-opacity"
              >
                <title>{d.label}: {d.value}</title>
              </rect>
              <text
                x={x + 16}
                y={height - 4}
                textAnchor="end"
                transform={`rotate(-35, ${x + 16}, ${height - 4})`}
                className="fill-muted-foreground text-[10px]"
                fontSize="10"
              >
                {d.label.length > 12 ? d.label.slice(0, 10) + "…" : d.label}
              </text>
              <text
                x={x + 16}
                y={y - 8}
                textAnchor="middle"
                className="fill-foreground font-medium"
                fontSize="11"
              >
                {d.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Simple SVG Donut Chart ────────────────────────────────────────────────
function DonutChart({ data = [], size = 120 }) {
  if (data.length === 0) return null;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 12;
  const colors = [
    "var(--primary)",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#06b6d4",
    "#f97316",
  ];

  let cumulative = 0;
  const arcs = data.map((d, i) => {
    const startAngle = (cumulative / total) * 360;
    cumulative += d.value;
    const endAngle = (cumulative / total) * 360;
    return { ...d, startAngle, endAngle, color: colors[i % colors.length] };
  });

  return (
    <div className="flex items-center justify-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((arc, i) => {
          const startRad = ((arc.startAngle - 90) * Math.PI) / 180;
          const endRad = ((arc.endAngle - 90) * Math.PI) / 180;
          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);
          const large = arc.endAngle - arc.startAngle > 180 ? 1 : 0;

          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
              fill={arc.color}
              opacity={0.85}
              className="hover:opacity-100 transition-opacity"
            >
              <title>{arc.label}: {arc.value}</title>
            </path>
          );
        })}
        <circle cx={cx} cy={cy} r={r - 6} fill="var(--card)" />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground font-bold"
          fontSize="18"
        >
          {total}
        </text>
      </svg>
      <div className="space-y-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className="text-muted-foreground">{d.label}</span>
            <span className="font-medium text-foreground ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard Stats Component ────────────────────────────────────────
export function DashboardStats({ applications = [], notices = [], allottedCount = 0, isPublished = false }) {
  // Count apps by branch (from priority 1)
  const branchCounts = {};
  applications.forEach((app) => {
    const branch = app.priorityChoices?.["1"];
    if (branch) {
      branchCounts[branch] = (branchCounts[branch] || 0) + 1;
    }
  });

  const branchData = Object.entries(branchCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  // Count by reservation category
  const categoryCounts = {};
  applications.forEach((app) => {
    const cat = app.reservationCategory || "Unknown";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Education distribution
  const eduCounts = {};
  applications.forEach((app) => {
    const edu = app.highestEducation || "Unknown";
    eduCounts[edu] = (eduCounts[edu] || 0) + 1;
  });
  const eduData = Object.entries(eduCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Total Applications"
          value={applications.length}
          sub={`${applications.filter((a) => a.submittedAt).length} submitted`}
          color="primary"
        />
        <StatCard
          icon={Bell}
          label="Notices"
          value={notices.length}
          sub={`${notices.filter((n) => n.important).length} important`}
          color="amber"
        />
        <StatCard
          icon={Users}
          label="Allotted Seats"
          value={allottedCount}
          sub="LET + Non-LET candidates"
          color="emerald"
        />
        <StatCard
          icon={CheckCircle2}
          label="Publication Status"
          value={isPublished ? "Published" : "Draft"}
          sub={isPublished ? "Visible to applicants" : "Not yet published"}
          color={isPublished ? "emerald" : "rose"}
        />
      </div>

      {/* Charts Row */}
      {branchData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications by Branch */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-border/50 bg-card p-5"
          >
            <BarChart data={branchData} barColor="var(--primary)" />
          </motion.div>

          {/* Category Distribution */}
          {categoryData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-xl border border-border/50 bg-card p-5"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                <PieChart className="h-4 w-4" />
                <span>Reservation Categories</span>
              </div>
              <DonutChart data={categoryData} size={130} />
            </motion.div>
          )}
        </div>
      )}

      {/* Education Distribution */}
      {eduData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl border border-border/50 bg-card p-5"
        >
          <BarChart data={eduData} barColor="#8b5cf6" height={150} />
        </motion.div>
      )}
    </div>
  );
}

// ─── Skeleton Version ──────────────────────────────────────────────────────
export function DashboardStatsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl bg-muted/60 p-5 space-y-3">
            <div className="h-3 w-20 bg-muted/80 rounded" />
            <div className="h-8 w-16 bg-muted/80 rounded" />
            <div className="h-3 w-28 bg-muted/80 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-muted/60 p-5 h-48" />
        <div className="rounded-xl bg-muted/60 p-5 h-48" />
      </div>
    </div>
  );
}
