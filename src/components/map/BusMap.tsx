import React from "react";
import { AlertCircle, Bus as BusIcon, Clock3, Flag, MapPin, Route as RouteIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getBusProgressDetails } from "@/lib/transport";
import { cn } from "@/lib/utils";
import type { BusWithDetails } from "@/types/bus";

interface BusMapProps {
  buses: BusWithDetails[];
  selectedBusId?: string;
  className?: string;
}

const toneClasses = {
  default: "border-primary/20 bg-primary/10 text-primary",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  destructive: "border-destructive/20 bg-destructive/10 text-destructive",
};

export const BusMap: React.FC<BusMapProps> = ({ buses, selectedBusId, className = "h-[400px]" }) => {
  const selectedBus = buses.find((bus) => bus.id === selectedBusId) ?? buses[0];
  const progressDetails = selectedBus ? getBusProgressDetails(selectedBus, selectedBus.route) : null;

  if (!selectedBus || !progressDetails) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center text-muted-foreground",
          className,
        )}
      >
        No mock tracking data is available for this selection yet.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-50 shadow-xl",
        className,
      )}
    >
      <div className="flex h-full flex-col p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="border border-white/10 bg-white/10 text-slate-100">
                Mock tracking
              </Badge>
              <Badge variant="secondary" className="border border-white/10 bg-white/5 text-slate-300">
                Future live GPS ready
              </Badge>
            </div>
            <h3 className="text-xl font-semibold">{selectedBus.busNumber}</h3>
            <p className="text-sm text-slate-300">{selectedBus.route?.name ?? "Unassigned route"}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Last refreshed</p>
            <p className="mt-1 text-sm font-medium">
              {selectedBus.lastUpdated
                ? new Date(selectedBus.lastUpdated).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Not available"}
            </p>
          </div>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
              <MapPin className="h-3.5 w-3.5" />
              Current point
            </p>
            <p className="text-lg font-semibold">{progressDetails.currentWaypoint.label}</p>
            <p className="text-sm text-slate-300">{progressDetails.currentWaypoint.time}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
              <Flag className="h-3.5 w-3.5" />
              Next point
            </p>
            <p className="text-lg font-semibold">{progressDetails.nextWaypoint?.label ?? "Route complete"}</p>
            <p className="text-sm text-slate-300">{progressDetails.nextWaypoint?.time ?? "No pending stop"}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
              <BusIcon className="h-3.5 w-3.5" />
              Seat status
            </p>
            <p className="text-lg font-semibold">
              {selectedBus.vacantSeats} of {selectedBus.capacity} seats open
            </p>
            <p className="text-sm text-slate-300">{selectedBus.driver?.name ? `Driver: ${selectedBus.driver.name}` : "Driver not assigned"}</p>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-200">{progressDetails.summaryLabel}</p>
              <p className="text-xs text-slate-400">
                {Math.round(progressDetails.progressPercent)}% through {progressDetails.totalWaypoints} checkpoints
              </p>
            </div>
            <div className={cn("rounded-full border px-3 py-1 text-xs font-semibold", toneClasses[progressDetails.tone])}>
              {progressDetails.statusLabel}
            </div>
          </div>

          <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 transition-all"
              style={{ width: `${progressDetails.progressPercent}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {selectedBus.route?.startTime} start
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {selectedBus.route?.dropTime} finish
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {selectedBus.route?.stops.length ?? 0} stops
            </span>
          </div>
        </div>

        <div className="grid flex-1 gap-3 overflow-auto md:grid-cols-2">
          {buses.map((bus) => {
            const details = getBusProgressDetails(bus, bus.route);

            if (!details) {
              return null;
            }

            const isSelected = bus.id === selectedBus.id;

            return (
              <div
                key={bus.id}
                className={cn(
                  "rounded-xl border p-4 transition-all",
                  isSelected ? "border-cyan-300/40 bg-cyan-400/10" : "border-white/10 bg-white/5",
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{bus.busNumber}</p>
                    <p className="text-sm text-slate-300">{bus.route?.name ?? "No route assigned"}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn("border capitalize", toneClasses[details.tone])}
                  >
                    {details.statusLabel}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <RouteIcon className="h-4 w-4 text-cyan-300" />
                    <span>{details.currentWaypoint.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-cyan-300" />
                    <span>{details.nextWaypoint ? `Next: ${details.nextWaypoint.label}` : "Shift wrapped for this bus"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-cyan-300" />
                    <span>{details.summaryLabel}</span>
                  </div>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300"
                    style={{ width: `${details.progressPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
