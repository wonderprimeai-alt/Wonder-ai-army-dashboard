'use client';

import { GitBranch, Package, Settings, Code, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface BuildEvent {
  event_id: string;
  event_type: string;
  severity: string;
  agent_id?: string;
  timestamp: string;
  data: any; // JSON data
}

interface BuildActivityProps {
  events: BuildEvent[];
}

export default function BuildActivity({ events }: BuildActivityProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const eventTypes = ['deployment', 'dependency_install', 'config_change', 'git_commit', 'build_success', 'build_failed'];
  const severities = ['debug', 'info', 'warning', 'error', 'critical'];

  const filteredEvents = events.filter(event => {
    const typeMatch = selectedType === 'all' || event.event_type === selectedType;
    const severityMatch = selectedSeverity === 'all' || event.severity === selectedSeverity;
    return typeMatch && severityMatch;
  });

  // Group events by date
  const groupedEvents: { [key: string]: BuildEvent[] } = {};
  filteredEvents.forEach(event => {
    const date = new Date(event.timestamp).toLocaleDateString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    if (!groupedEvents[date]) {
      groupedEvents[date] = [];
    }
    groupedEvents[date].push(event);
  });

  const getEventIcon = (type: string) => {
    if (type.includes('git') || type.includes('commit')) return <GitBranch className="w-4 h-4" />;
    if (type.includes('dependency') || type.includes('install')) return <Package className="w-4 h-4" />;
    if (type.includes('config')) return <Settings className="w-4 h-4" />;
    if (type.includes('deployment') || type.includes('build')) return <Code className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500 text-red-400';
      case 'error': return 'bg-orange-500/20 border-orange-500 text-orange-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'info': return 'bg-blue-500/20 border-blue-500 text-blue-400';
      case 'debug': return 'bg-gray-500/20 border-gray-500 text-gray-400';
      default: return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };

  // Calculate stats
  const stats = {
    total: filteredEvents.length,
    deployments: filteredEvents.filter(e => e.event_type.includes('deployment')).length,
    builds: filteredEvents.filter(e => e.event_type.includes('build')).length,
    commits: filteredEvents.filter(e => e.event_type.includes('git') || e.event_type.includes('commit')).length,
    errors: filteredEvents.filter(e => e.severity === 'error' || e.severity === 'critical').length,
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Code className="w-6 h-6 text-green-400" />
          Build Activity Tracker
        </h2>
        <div className="text-sm text-gray-400">
          {filteredEvents.length} events
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Events" value={stats.total} color="purple" />
        <StatCard label="Deployments" value={stats.deployments} color="green" />
        <StatCard label="Builds" value={stats.builds} color="blue" />
        <StatCard label="Commits" value={stats.commits} color="yellow" />
        <StatCard label="Errors" value={stats.errors} color="red" />
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Event Types</option>
          {eventTypes.map(type => (
            <option key={type} value={type}>
              {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </option>
          ))}
        </select>

        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Severities</option>
          {severities.map(sev => (
            <option key={sev} value={sev}>
              {sev.charAt(0).toUpperCase() + sev.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div className="space-y-6 max-h-[600px] overflow-y-auto">
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No build activity recorded yet</p>
          </div>
        ) : (
          Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm py-2 mb-3 border-b border-white/10 z-10">
                <h3 className="text-sm font-bold text-gray-300">{date}</h3>
              </div>

              {/* Events for this date */}
              <div className="space-y-3 ml-4">
                {dateEvents.map((event) => (
                  <div
                    key={event.event_id}
                    className={`rounded-lg p-4 border-l-4 ${getSeverityColor(event.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.event_type)}
                        <span className="font-bold text-sm uppercase">{event.event_type.replace(/_/g, ' ')}</span>
                        <span className="text-xs px-2 py-1 bg-white/10 rounded">{event.severity}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(event.timestamp).toLocaleTimeString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </div>

                    {event.agent_id && (
                      <div className="text-xs text-gray-400 mb-2">
                        Agent: <span className="text-blue-400 font-semibold">{event.agent_id}</span>
                      </div>
                    )}

                    {/* Event Data */}
                    {event.data && typeof event.data === 'object' && (
                      <div className="mt-3 bg-black/30 rounded p-3 font-mono text-xs">
                        {Object.entries(event.data).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="text-gray-400">{key}:</span>
                            <span className="text-gray-200">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors = {
    purple: 'bg-purple-500/20 border-purple-500',
    green: 'bg-green-500/20 border-green-500',
    blue: 'bg-blue-500/20 border-blue-500',
    yellow: 'bg-yellow-500/20 border-yellow-500',
    red: 'bg-red-500/20 border-red-500',
  };

  return (
    <div className={`rounded-lg p-4 border ${colors[color as keyof typeof colors]}`}>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
