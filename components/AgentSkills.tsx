'use client';

import { Award, TrendingUp, Target, Zap } from 'lucide-react';

interface AgentSkill {
  agent_id: string;
  agent_name: string;
  model: string;
  llm_provider: string;
  actions_today: number;
  success_rate: number;
  avg_response_time: number;
  specializations: string[];
  llm_calls_today: number;
  tokens_used_today: number;
}

interface AgentSkillsProps {
  agents: AgentSkill[];
}

export default function AgentSkills({ agents }: AgentSkillsProps) {
  const getSkillLevel = (successRate: number, actions: number): string => {
    if (successRate >= 95 && actions >= 50) return 'Expert';
    if (successRate >= 85 && actions >= 20) return 'Advanced';
    if (successRate >= 70 && actions >= 10) return 'Intermediate';
    return 'Learning';
  };

  const getSkillColor = (level: string): string => {
    switch (level) {
      case 'Expert': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Advanced': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Intermediate': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-400" />
          Agent Skills & Capabilities
        </h2>
        <div className="text-sm text-gray-400">
          {agents.length} agents tracked
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            No agent skill data available yet.
          </div>
        ) : (
          agents.map((agent) => {
            const skillLevel = getSkillLevel(agent.success_rate, agent.actions_today);
            const skillColor = getSkillColor(skillLevel);

            return (
              <div
                key={agent.agent_id}
                className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{agent.agent_name || agent.agent_id}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {agent.model} • {agent.llm_provider}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${skillColor}`}>
                    {skillLevel}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="space-y-3 mb-4">
                  <StatRow
                    icon={<Zap className="w-4 h-4 text-blue-400" />}
                    label="Actions Today"
                    value={agent.actions_today}
                  />
                  <StatRow
                    icon={<Target className="w-4 h-4 text-green-400" />}
                    label="Success Rate"
                    value={`${agent.success_rate.toFixed(1)}%`}
                  />
                  <StatRow
                    icon={<TrendingUp className="w-4 h-4 text-purple-400" />}
                    label="LLM Calls"
                    value={agent.llm_calls_today}
                  />
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Performance</span>
                    <span>{agent.success_rate.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${skillColor}`}
                      style={{ width: `${agent.success_rate}%` }}
                    />
                  </div>
                </div>

                {/* Specializations */}
                {agent.specializations && agent.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {agent.specializations.map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}
