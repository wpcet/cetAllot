import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Bell,
  Users,
  CheckCircle2,
  BarChart3,
  PieChart,
  GraduationCap,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, color = "primary" }) {
  const colorMap = {
    primary: "from-primary/10 to-primary/5 border-primary/20 text-primary",
    emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-600",
    amber: "from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-600",
    violet: "from-violet-500/10 to-violet-500/5 border-violet-500/20 text-violet-600",
    rose: "from-rose-500/10 to-rose-500/5 border-rose-500/20 text-rose-600",
    sky: "from-sky-500/10 to-sky-500/5 border-sky-500/20 text-sky-600",
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
    </motion.div>
  );
}

function BarChart({ data = [], height = 200, barColor = "var(--primary)", title }) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const svgWidth = Math.max(data.length * 60 + 40, 240);
  const slotWidth = 60;
  const totalBarWidth = data.length * slotWidth;
  const startX = (svgWidth - totalBarWidth) / 2;

  return (
    <div className="space-y-3 flex flex-col h-full">
      {title && (
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span>{title}</span>
        </div>
      )}
      <div className="flex-1 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${height}`}
          className="w-full max-w-[280px] h-auto mx-auto block"
          preserveAspectRatio="xMidYMid meet"
        >
          {data.map((d, i) => {
            const barH = (d.value / max) * (height - 85);
            const x = startX + i * slotWidth + (slotWidth - 32) / 2;
            const y = height - 55 - barH;
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
                  y={height - 35}
                  textAnchor="end"
                  transform={`rotate(-35, ${x + 16}, ${height - 35})`}
                  className="fill-muted-foreground text-[10px] font-medium"
                  fontSize="10"
                >
                  {d.label.length > 12 ? d.label.slice(0, 10) + "\u2026" : d.label}
                </text>
                <text
                  x={x + 16}
                  y={y - 8}
                  textAnchor="middle"
                  className="fill-foreground font-semibold"
                  fontSize="11"
                >
                  {d.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function DonutChart({ data = [], size = 110, title }) {
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
    <div className="flex flex-col h-full justify-between gap-3">
      {title && (
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <PieChart className="h-4 w-4 text-primary" />
          <span>{title}</span>
        </div>
      )}
      <div className="flex items-center justify-between gap-2 flex-1">
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
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
                  className="hover:opacity-100 transition-opacity cursor-pointer"
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
              fontSize="16"
            >
              {total}
            </text>
          </svg>
        </div>
        <div className="flex-1 space-y-1 bg-muted/20 p-2 rounded-lg max-h-[120px] overflow-y-auto w-full">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[10px]">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="text-muted-foreground truncate max-w-[80px]" title={d.label}>
                {d.label}
              </span>
              <span className="font-semibold text-foreground ml-auto">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardStats({
  applications = [],
  mtechApplications = [],
  notices = [],
  allottedCount = 0,
  mtechAllottedCount = 0,
}) {
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

  const categoryCounts = {};
  applications.forEach((app) => {
    const cat = app.reservationCategory || "Unknown";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const eduCounts = {};
  applications.forEach((app) => {
    const edu = app.highestEducation || "Unknown";
    eduCounts[edu] = (eduCounts[edu] || 0) + 1;
  });
  const eduData = Object.entries(eduCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const mtechSpecCounts = {};
  mtechApplications.forEach((app) => {
    const spec = app.specialization || "Unknown";
    mtechSpecCounts[spec] = (mtechSpecCounts[spec] || 0) + 1;
  });
  const mtechSpecData = Object.entries(mtechSpecCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="B.Tech Applications"
          value={applications.length}
          sub={`${applications.filter((a) => a.submittedAt).length} submitted`}
          color="primary"
        />
        <StatCard
          icon={GraduationCap}
          label="M.Tech Applications"
          value={mtechApplications.length}
          sub={`${mtechApplications.filter((a) => a.submittedAt).length} submitted`}
          color="violet"
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
          value={allottedCount + mtechAllottedCount}
          sub={`${allottedCount} B.Tech + ${mtechAllottedCount} M.Tech`}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {branchData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-border/50 bg-card p-4 shadow-sm"
          >
            <BarChart data={branchData} barColor="var(--primary)" title="B.Tech Branches" />
          </motion.div>
        )}

        {mtechSpecData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border/50 bg-card p-4 shadow-sm"
          >
            <DonutChart data={mtechSpecData} size={110} title="M.Tech Specs" />
          </motion.div>
        )}

        {categoryData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-border/50 bg-card p-4 shadow-sm"
          >
            <DonutChart data={categoryData} size={110} title="B.Tech Reservation" />
          </motion.div>
        )}

        {eduData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl border border-border/50 bg-card p-4 shadow-sm"
          >
            <BarChart data={eduData} barColor="#8b5cf6" title="B.Tech Education" />
          </motion.div>
        )}
      </div>
    </div>
  );
}

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
