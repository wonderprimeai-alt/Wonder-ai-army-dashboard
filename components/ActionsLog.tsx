'use client';

import { Shield, AlertCircle, CheckCircle, XCircle, Clock, Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface ActionLog {
  action_id: string;
  agent_id: string;
  action_type: string;
  action_name: string;
  success: boolean;
  timestamp: string;
  duration_ms?: number;
  error_message?: string;
}

interface LLMCall {
  call_id: string;
  agent_id: string;
  provider: string;
  model: string;
  total_tokens?: number;
  cost_usd?: number;
  success: boolean;
  timestamp: string;
  duration_ms?: number;
}

interface AuditEntry {
  audit_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  actor: string;
  timestamp: string;
}

interface ActionsLogProps {
  actions: ActionLog[];
  llmCalls: LLMCall[];
  auditLog: AuditEntry[];
}

export default function ActionsLog({ actions, llmCalls, auditLog }: ActionsLogProps) {
  const [activeTab, setActiveTab] = useState<'actions' | 'llm' | 'audit'>('actions');
  const [searchQuery, setSearchQuery] = useState('');
  const [successFilter, setSuccessFilter] = useState<'all' | 'success' | 'failed'>('all');

  // Filter actions
  const filteredActions = actions.filter(action => {
    const searchMatch = searchQuery === '' ||
      action.agent_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.action_name.toLowerCase().includes(searchQuery.toLowerCase());
    const successMatch = successFilter === 'all' ||
      (successFilter === 'success' && action.success) ||
      (successFilter === 'failed' && !action.success);
    return searchMatch && successMatch;
  });

  // Filter LLM calls
  const filteredLLM = llmCalls.filter(call => {
    const searchMatch = searchQuery === '' ||
      call.agent_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.model.toLowerCase().includes(searchQuery.toLowerCase());
    const successMatch = successFilter === 'all' ||
      (successFilter === 'success' && call.success) ||
      (successFilter === 'failed' && !call.success);
    return searchMatch && successMatch;
  });

  // Filter audit log
  const filteredAudit = auditLog.filter(entry => {
    const searchMatch = searchQuery === '' ||
      entry.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase());
    return searchMatch;
  });

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-400" />
          Actions Log (Security Audit)
        </h2>
        <div className="text-sm text-gray-400">
          Real-time activity monitoring
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab('actions')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'actions'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Agent Actions ({filteredActions.length})
        </button>
        <button
          onClick={() => setActiveTab('llm')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'llm'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          LLM Calls ({filteredLLM.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'audit'
              ? 'text-red-400 border-b-2 border-red-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Audit Trail ({filteredAudit.length})
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        {activeTab !== 'audit' && (
          <select
            value={successFilter}
            onChange={(e) => setSuccessFilter(e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All</option>
            <option value="success">Success Only</option>
            <option value="failed">Failed Only</option>
          </select>
        )}
      </div>

      {/* Content */}
      <div className="max-h-[600px] overflow-y-auto space-y-3">
        {activeTab === 'actions' && (
          <>
            {filteredActions.length === 0 ? (
              <EmptyState message="No actions logged yet" />
            ) : (
              filteredActions.map((action) => (
                <ActionItem key={action.action_id} action={action} />
              ))
            )}
          </>
        )}

        {activeTab === 'llm' && (
          <>
            {filteredLLM.length === 0 ? (
              <EmptyState message="No LLM calls logged yet" />
            ) : (
              filteredLLM.map((call) => (
                <LLMCallItem key={call.call_id} call={call} />
              ))
            )}
          </>
        )}

        {activeTab === 'audit' && (
          <>
            {filteredAudit.length === 0 ? (
              <EmptyState message="No audit entries yet" />
            ) : (
              filteredAudit.map((entry) => (
                <AuditItem key={entry.audit_id} entry={entry} />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ActionItem({ action }: { action: ActionLog }) {
  return (
    <div className={`rounded-lg p-4 border-l-4 ${
      action.success
        ? 'bg-green-500/10 border-green-500'
        : 'bg-red-500/10 border-red-500'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {action.success ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400" />
          )}
          <span className="font-bold text-sm">{action.agent_id}</span>
          <span className="text-xs px-2 py-1 bg-white/10 rounded">{action.action_type}</span>
        </div>
        <div className="text-right text-xs text-gray-400">
          <div>{new Date(action.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
          {action.duration_ms && (
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {action.duration_ms}ms
            </div>
          )}
        </div>
      </div>
      <div className="text-sm">
        <span className="font-mono text-blue-300">{action.action_name}</span>
      </div>
      {action.error_message && (
        <div className="mt-2 text-xs text-red-300 bg-red-900/20 p-2 rounded">
          {action.error_message}
        </div>
      )}
    </div>
  );
}

function LLMCallItem({ call }: { call: LLMCall }) {
  return (
    <div className={`rounded-lg p-4 border-l-4 ${
      call.success
        ? 'bg-purple-500/10 border-purple-500'
        : 'bg-red-500/10 border-red-500'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {call.success ? (
            <CheckCircle className="w-4 h-4 text-purple-400" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400" />
          )}
          <span className="font-bold text-sm">{call.agent_id}</span>
          <span className="text-xs px-2 py-1 bg-purple-500/20 rounded">{call.provider}</span>
        </div>
        <div className="text-right text-xs text-gray-400">
          <div>{new Date(call.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
          {call.duration_ms && (
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {call.duration_ms}ms
            </div>
          )}
        </div>
      </div>
      <div className="text-sm mb-2">
        <span className="font-mono text-purple-300">{call.model}</span>
      </div>
      <div className="flex gap-4 text-xs text-gray-400">
        {call.total_tokens && <span>Tokens: {call.total_tokens.toLocaleString()}</span>}
        {call.cost_usd && <span>Cost: ${call.cost_usd.toFixed(4)}</span>}
      </div>
    </div>
  );
}

function AuditItem({ entry }: { entry: AuditEntry }) {
  return (
    <div className="rounded-lg p-4 border-l-4 bg-gray-500/10 border-gray-500">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-gray-400" />
          <span className="font-bold text-sm">{entry.actor}</span>
          <span className="text-xs px-2 py-1 bg-white/10 rounded">{entry.action}</span>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(entry.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </span>
      </div>
      <div className="text-sm text-gray-300">
        <span className="text-gray-400">{entry.entity_type}:</span> {entry.entity_id}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center text-gray-400 py-12">
      <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p>{message}</p>
    </div>
  );
}
