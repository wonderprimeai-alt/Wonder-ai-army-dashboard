'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Brain, Zap, TrendingUp, AlertCircle, Users } from 'lucide-react';

interface DashboardData {
  timestamp: string;
  sessions: any[];
  communications: any[];
  metrics: {
    totalAgentsDeployed: number;
    totalAgentsPlanned: number;
    totalMessagesProcessed: number;
    totalTokensUsed: number;
    avgResponseTime: number;
    uptime: number;
    cronJobsActive: number;
    cronJobsScheduled: number;
  };
  hierarchy: any;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/status');
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Wonder AI Army...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            🦾 WONDER AI ARMY
          </h1>
          <p className="text-xl text-gray-300">Live Command Center • Real-Time Intelligence</p>
          <p className="text-sm text-gray-400 mt-2">
            Last updated: {new Date(data.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-8 h-8" />}
            title="Agents Deployed"
            value={`${data.metrics.totalAgentsDeployed}/${data.metrics.totalAgentsPlanned}`}
            subtitle={`${Math.round((data.metrics.totalAgentsDeployed / data.metrics.totalAgentsPlanned) * 100)}% deployed`}
            color="purple"
          />
          <StatCard
            icon={<Activity className="w-8 h-8" />}
            title="Messages Processed"
            value={data.metrics.totalMessagesProcessed.toLocaleString()}
            subtitle="Total interactions"
            color="blue"
          />
          <StatCard
            icon={<Brain className="w-8 h-8" />}
            title="Tokens Used"
            value={`${(data.metrics.totalTokensUsed / 1000).toFixed(1)}K`}
            subtitle="AI compute"
            color="green"
          />
          <StatCard
            icon={<Zap className="w-8 h-8" />}
            title="Avg Response"
            value={`${data.metrics.avgResponseTime.toFixed(2)}s`}
            subtitle={`${data.metrics.uptime}% uptime`}
            color="yellow"
          />
        </div>

        {/* Active Agents */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Active Agents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.sessions.map((agent, idx) => (
              <AgentCard key={idx} agent={agent} />
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Agent Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.sessions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="messagesHandled" fill="#8b5cf6" name="Messages" />
              <Bar dataKey="tokensUsed" fill="#06b6d4" name="Tokens (scaled)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Communication Feed */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-400" />
            Live Communication Feed
          </h2>
          <div className="space-y-4">
            {data.communications.map((comm, idx) => (
              <CommunicationItem key={idx} comm={comm} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color }: any) {
  const colorClasses = {
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-lg rounded-xl p-6 border`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-gray-300">{icon}</div>
      </div>
      <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}

function AgentCard({ agent }: any) {
  const statusColors = {
    online: 'bg-green-500',
    monitoring: 'bg-blue-500',
    scheduled: 'bg-yellow-500',
    pending: 'bg-gray-500',
  };

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{agent.emoji}</span>
        <div className="flex-1">
          <h3 className="font-bold">{agent.name}</h3>
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[agent.status]} text-white mt-1`}>
            {agent.status.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-400 space-y-1">
        <div>Messages: <span className="text-white font-semibold">{agent.messagesHandled}</span></div>
        <div>Tokens: <span className="text-white font-semibold">{(agent.tokensUsed / 1000).toFixed(1)}K</span></div>
        <div>Response: <span className="text-white font-semibold">{agent.avgResponseTime.toFixed(1)}s</span></div>
      </div>
    </div>
  );
}

function CommunicationItem({ comm }: any) {
  const priorityColors = {
    critical: 'border-red-500',
    high: 'border-orange-500',
    normal: 'border-blue-500',
  };

  return (
    <div className={`bg-white/5 rounded-lg p-4 border-l-4 ${priorityColors[comm.priority]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-purple-400">{comm.from.toUpperCase()}</span>
          <span className="text-gray-400">→</span>
          <span className="font-bold text-blue-400">{comm.to.toUpperCase()}</span>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(comm.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </span>
      </div>
      <p className="text-gray-300 text-sm">{comm.message}</p>
    </div>
  );
}
