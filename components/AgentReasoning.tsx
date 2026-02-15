'use client';

import { Brain, GitBranch, Lightbulb, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface Thought {
  thought_id: string;
  agent_id: string;
  agent_name: string;
  thought_text: string;
  thought_type: string;
  timestamp: string;
  resulting_action?: string;
}

interface AgentReasoningProps {
  thoughts: Thought[];
}

export default function AgentReasoning({ thoughts }: AgentReasoningProps) {
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const agents = Array.from(new Set(thoughts.map(t => t.agent_id)));
  const types = ['reasoning', 'planning', 'analysis', 'reflection'];

  const filteredThoughts = thoughts.filter(t => {
    const agentMatch = selectedAgent === 'all' || t.agent_id === selectedAgent;
    const typeMatch = selectedType === 'all' || t.thought_type === selectedType;
    return agentMatch && typeMatch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reasoning': return <Brain className="w-4 h-4" />;
      case 'planning': return <GitBranch className="w-4 h-4" />;
      case 'analysis': return <Lightbulb className="w-4 h-4" />;
      case 'reflection': return <AlertTriangle className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reasoning': return 'bg-blue-500/20 border-blue-500 text-blue-400';
      case 'planning': return 'bg-purple-500/20 border-purple-500 text-purple-400';
      case 'analysis': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'reflection': return 'bg-green-500/20 border-green-500 text-green-400';
      default: return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-400" />
          Agent Reasoning Panel
        </h2>
        <div className="text-sm text-gray-400">
          {filteredThoughts.length} thoughts
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Agents</option>
          {agents.map(agent => (
            <option key={agent} value={agent}>{agent}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Types</option>
          {types.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Thoughts Timeline */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {filteredThoughts.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No thoughts available. Agents are thinking...
          </div>
        ) : (
          filteredThoughts.map((thought) => (
            <div
              key={thought.thought_id}
              className={`rounded-lg p-4 border-l-4 ${getTypeColor(thought.thought_type)}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(thought.thought_type)}
                  <span className="font-bold text-sm">{thought.agent_name || thought.agent_id}</span>
                  <span className="text-xs px-2 py-1 rounded bg-white/10 uppercase">
                    {thought.thought_type}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(thought.timestamp).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {/* Thought Content */}
              <div className="mb-3">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {thought.thought_text}
                </p>
              </div>

              {/* Resulting Action */}
              {thought.resulting_action && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-400">→ Action Taken:</span>
                    <span className="text-gray-300 font-mono bg-white/5 px-2 py-1 rounded">
                      {thought.resulting_action}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
