import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-muted/60",
        className
      )}
      {...props}
    />
  );
}

// Skeleton for notice/announcement cards
function SkeletonCard({ className }) {
  return (
    <div className={cn("bg-card border border-border/40 rounded-xl p-6 space-y-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

// Skeleton for table rows
function SkeletonTableRow({ columns = 5 }) {
  return (
    <tr className="border-b border-border/40">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className={cn("h-4", i === 0 ? "w-8" : i === 1 ? "w-32" : "w-20")} />
        </td>
      ))}
    </tr>
  );
}

// Skeleton for a full table with header
function SkeletonTable({ rows = 5, columns = 5 }) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border/40">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <Skeleton className="h-4 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <SkeletonTableRow key={i} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Skeleton for notice cards in dashboard
function SkeletonNoticeCard() {
  return (
    <div className="bg-card border border-border/40 rounded-xl p-5 space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonTableRow,
  SkeletonNoticeCard,
};
