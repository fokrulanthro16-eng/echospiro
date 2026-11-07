'use client';

import React from 'react';
import {
  History,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { TriageResult } from '@/lib/triageClassifier';

export interface TrendSnapshot {
  id: string;
  timestamp: string;
  label: string;
  bpm: number;
  ieRatio: string;
  tidalVolumeMl: number;
  wheezeIndex: number;
  status: string;
  severity: 'green' | 'yellow' | 'red';
  sqi: number;
}

interface TrendLogProps {
  currentTriage: TriageResult;
  snapshots: TrendSnapshot[];
  onCaptureSnapshot: (label: string) => void;
  onClearSnapshots: () => void;
}

export const TrendLog: React.FC<TrendLogProps> = ({
  snapshots,
  onCaptureSnapshot,
  onClearSnapshots,
}) => {
  const [selectedTag, setSelectedTag] = React.useState<string>('Baseline Pre-Intervention');

  const defaultTags = [
    'Baseline Pre-Intervention',
    'Post-Bronchodilator (SABA) +15m',
    'Post-Nebulizer Follow-up',
    'Post-Exertion Recovery',
  ];

  const handleCapture = () => {
    onCaptureSnapshot(selectedTag);
  };

  const baseline = snapshots[0] || null;

  return (
    <section id="trend-tracker-container" className="glass-panel rounded-2xl p-5 border border-cyan-500/25 space-y-4">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/15 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              Volatile Longitudinal Trend Tracker
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Pre / Post-Intervention Log (RAM Only)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Captures up to 5 transient clinical session snapshots to evaluate therapeutic response (e.g. Albuterol).
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none"
          >
            {defaultTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <button
            onClick={handleCapture}
            disabled={snapshots.length >= 5}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Capture Snapshot ({snapshots.length}/5)</span>
          </button>

          {snapshots.length > 0 && (
            <button
              onClick={onClearSnapshots}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-red-400 transition-colors"
              title="Clear Session Snapshots"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* SNAPSHOTS TIMELINE GRID */}
      {snapshots.length === 0 ? (
        <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-800/80 text-center space-y-2">
          <Sparkles className="h-6 w-6 text-cyan-400 mx-auto opacity-60" />
          <div className="text-xs font-mono text-slate-300">
            No clinical snapshots captured yet in this volatile session.
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Click &quot;Capture Snapshot&quot; to log initial baseline kinematics and monitor post-bronchodilator changes.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 font-mono text-xs">
          {snapshots.map((snap, idx) => {
            const isBaseline = idx === 0;
            const deltaBpm = isBaseline ? 0 : Number((snap.bpm - baseline.bpm).toFixed(1));
            const deltaTv = isBaseline ? 0 : snap.tidalVolumeMl - baseline.tidalVolumeMl;
            const deltaWheeze = isBaseline ? 0 : snap.wheezeIndex - baseline.wheezeIndex;

            const badgeBg = {
              green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
              yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
              red: 'bg-red-500/15 text-red-400 border-red-500/40',
            }[snap.severity];

            return (
              <div
                key={snap.id}
                className={`p-3.5 rounded-xl border relative transition-all ${
                  isBaseline
                    ? 'bg-cyan-950/20 border-cyan-500/35 ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Tag & Time */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/20 truncate max-w-[130px]">
                    #{idx + 1} {snap.label}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(snap.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="mb-2.5">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badgeBg}`}>
                    {snap.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-1.5 text-[11px] pt-1 border-t border-slate-800">
                  {/* BPM with Delta */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">RR:</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-white">{snap.bpm.toFixed(1)} BPM</span>
                      {!isBaseline && deltaBpm !== 0 && (
                        <span
                          className={`text-[10px] flex items-center font-bold ${
                            deltaBpm < 0 ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {deltaBpm > 0 ? (
                            <TrendingUp className="h-3 w-3 inline" />
                          ) : (
                            <TrendingDown className="h-3 w-3 inline" />
                          )}
                          {deltaBpm > 0 ? `+${deltaBpm}` : deltaBpm}
                        </span>
                      )}
                      {isBaseline && (
                        <span className="text-[9px] text-cyan-400 bg-cyan-950/60 px-1 rounded">
                          BASE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* I:E Ratio */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">I:E:</span>
                    <span className="font-bold text-cyan-300">{snap.ieRatio}</span>
                  </div>

                  {/* Tidal Volume with Delta */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">TV:</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-white">{snap.tidalVolumeMl} mL</span>
                      {!isBaseline && deltaTv !== 0 && (
                        <span
                          className={`text-[10px] font-bold ${
                            deltaTv > 0 ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {deltaTv > 0 ? `+${deltaTv}` : deltaTv}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Wheeze Index with Delta */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Wheeze:</span>
                    <div className="flex items-center space-x-1">
                      <span
                        className={`font-bold ${
                          snap.wheezeIndex > 40 ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {snap.wheezeIndex}%
                      </span>
                      {!isBaseline && deltaWheeze !== 0 && (
                        <span
                          className={`text-[10px] font-bold ${
                            deltaWheeze < 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {deltaWheeze > 0 ? `+${deltaWheeze}%` : `${deltaWheeze}%`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Therapeutic Response Summary Badge */}
                {!isBaseline && (
                  <div className="mt-2.5 pt-1.5 border-t border-slate-800 text-[10px] flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Response:</span>
                    <span
                      className={`font-bold ${
                        deltaWheeze < 0 || (baseline.status === 'OBSTRUCTIVE_PATTERN' && snap.status === 'NORMAL')
                          ? 'text-emerald-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {baseline.status === 'OBSTRUCTIVE_PATTERN' && snap.status === 'NORMAL'
                        ? '✓ Reversible (SABA+)'
                        : deltaWheeze < 0
                        ? 'Airway Dilated'
                        : 'Stable'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER PRIVACY NOTICE */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>Volatile Session Storage: Clears automatically upon tab close / refresh.</span>
        </span>
        <span className="text-slate-500">Max 5 sequential clinical snapshots</span>
      </div>
    </section>
  );
};
