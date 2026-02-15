'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Brain, Zap, TrendingUp, AlertCircle, Users, MessageSquare, Lightbulb, CheckCircle } from 'lucide-react';

interface DashboardData {
  timestamp: string;
  sessions: any[];
  communications: any[];
  metrics: any;
  hierarchy: any;
}

interface MissionControlData {
  timestamp: string;
  agentStatuses: any[];
  agentMessages: any[];
  discoveries: any[];
  optimizations: any[];
  tasks: any[];
  stats: any;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [mcData, setMcData] = useState<MissionControlData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, mcRes] = await Promise.all([
          fetch('/api/status', { cache: 'no-store' }),
          fetch('/api/mission-control', { cache: 'no-store' })
        ]);
        
        if (!statusRes.ok || !mcRes.ok) {
          throw new Error(`API error: ${statusRes.status} / ${mcRes.status}`);
        }
        
        const statusData = await statusRes.json();
        const mcDataRes = await mcRes.json();
        setData(statusData);
        setMcData(mcDataRes);
        setError(null);
        setIsConnected(true);
        setConnectionError(null);
        setLastUpdated(new Date());
      } catch (err) {
        setError('Failed to load dashboard data');
        setIsConnected(false);
        setConnectionError(err instanceof Error ? err.message : 'Connection failed');
        console.error('Dashboard fetch error:', err);
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

  if (!data || !mcData) {
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
          <p className="text-xl text-gray-300">Mission Control • Autonomous Intelligence Network</p>
          
          {/* Connection Status & Last Updated */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-semibold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected ? 'LIVE' : 'DISCONNECTED'}
              </span>
            </div>
            
            <div className="text-sm text-gray-400">
              Last updated: <span className="font-semibold text-white">
                {lastUpdated ? lastUpdated.toLocaleTimeString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                }) : 'Loading...'}
              </span>
            </div>
            
            {connectionError && (
              <div className="text-xs text-red-400 bg-red-900/20 px-3 py-1 rounded">
                Error: {connectionError}
              </div>
            )}
          </div>
        </header>

        {/* Mission Control Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <MiniStat icon={<MessageSquare className="w-5 h-5" />} label="Unread Messages" value={mcData.stats.unreadMessages} color="blue" />
          <MiniStat icon={<Lightbulb className="w-5 h-5" />} label="Discoveries" value={mcData.stats.actionableDiscoveries} color="yellow" />
          <MiniStat icon={<TrendingUp className="w-5 h-5" />} label="Optimizations" value={mcData.stats.pendingOptimizations} color="green" />
          <MiniStat icon={<CheckCircle className="w-5 h-5" />} label="Approved" value={mcData.stats.approvedOptimizations} color="green" />
          <MiniStat icon={<Activity className="w-5 h-5" />} label="Pending Tasks" value={mcData.stats.pendingTasks} color="orange" />
          <MiniStat icon={<Zap className="w-5 h-5" />} label="In Progress" value={mcData.stats.tasksInProgress} color="purple" />
        </div>

        {/* Main Stats Grid */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Agent Messages */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-400" />
              Agent-to-Agent Messages
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {mcData.agentMessages.map((msg, idx) => (
                <MessageItem key={idx} msg={msg} />
              ))}
            </div>
          </div>

          {/* Discoveries */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              Agent Discoveries
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {mcData.discoveries.map((disc, idx) => (
                <DiscoveryItem key={idx} discovery={disc} />
              ))}
            </div>
          </div>
        </div>

        {/* Self-Optimizations */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Self-Optimization Proposals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mcData.optimizations.map((opt, idx) => (
              <OptimizationCard key={idx} opt={opt} />
            ))}
          </div>
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

        {/* Communication Feed */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-400" />
            System Communications
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

function MiniStat({ icon, label, value, color }: any) {
  const colors = {
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
    purple: 'text-purple-400'
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
      <div className={`${colors[color]} mb-2`}>{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
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

function MessageItem({ msg }: any) {
  const priorityColors = {
    critical: 'border-red-500 bg-red-500/10',
    high: 'border-orange-500 bg-orange-500/10',
    normal: 'border-blue-500 bg-blue-500/10',
  };

  const statusBadge = msg.status === 'unread' ? (
    <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded">NEW</span>
  ) : null;

  return (
    <div className={`rounded-lg p-4 border-l-4 ${priorityColors[msg.priority]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-purple-400">{msg.from}</span>
          <span className="text-gray-400">→</span>
          <span className="font-bold text-blue-400">{msg.to}</span>
          {statusBadge}
        </div>
        <span className="text-xs text-gray-400">
          {new Date(msg.time).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </span>
      </div>
      <p className="text-gray-300 text-sm">{msg.message}</p>
    </div>
  );
}

function DiscoveryItem({ discovery }: any) {
  const categoryColors = {
    lead: 'bg-green-500/20 border-green-500',
    bug: 'bg-red-500/20 border-red-500',
    trend: 'bg-blue-500/20 border-blue-500',
    opportunity: 'bg-yellow-500/20 border-yellow-500',
  };

  return (
    <div className={`rounded-lg p-4 border-l-4 ${categoryColors[discovery.category]}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="font-bold text-sm text-gray-400 uppercase">{discovery.category}</span>
          {discovery.actionable && <span className="ml-2 px-2 py-1 text-xs bg-orange-500 text-white rounded">ACTIONABLE</span>}
        </div>
        <span className="text-xs text-gray-400">{discovery.agent}</span>
      </div>
      <h4 className="font-bold mb-1">{discovery.title}</h4>
      <p className="text-gray-400 text-sm">{discovery.description}</p>
    </div>
  );
}

function OptimizationCard({ opt }: any) {
  const statusColors = {
    proposed: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    approved: 'bg-green-500/20 border-green-500 text-green-400',
    implemented: 'bg-blue-500/20 border-blue-500 text-blue-400',
  };

  return (
    <div className={`rounded-lg p-4 border ${statusColors[opt.status]}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-bold uppercase">{opt.agent}</span>
        <span className="text-xs px-2 py-1 rounded bg-white/10">{opt.status}</span>
      </div>
      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-1">{opt.type.toUpperCase()}</div>
        <h4 className="font-bold text-sm mb-2">{opt.description}</h4>
        <div className="text-xs space-y-1">
          <div><span className="text-gray-400">Before:</span> {opt.before}</div>
          <div><span className="text-green-400">After:</span> {opt.after}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white/10 rounded-full h-2">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{width: `${opt.impactScore}%`}}></div>
        </div>
        <span className="text-xs font-bold">{opt.impactScore}</span>
      </div>
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
