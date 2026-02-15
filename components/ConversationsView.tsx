'use client';

import { MessageCircle, Users, Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface ConversationMessage {
  message_id: string;
  from_agent: string;
  to_agent?: string;
  message_text: string;
  timestamp: string;
}

interface Conversation {
  conversation_id: string;
  participants: string[];
  topic?: string;
  status: string;
  started_at: string;
  message_count: number;
  messages: ConversationMessage[];
}

interface ConversationsViewProps {
  conversations: Conversation[];
}

export default function ConversationsView({ conversations }: ConversationsViewProps) {
  const [selectedConv, setSelectedConv] = useState<string | null>(
    conversations.length > 0 ? conversations[0].conversation_id : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredConversations = conversations.filter(conv => {
    const statusMatch = statusFilter === 'all' || conv.status === statusFilter;
    const searchMatch = searchQuery === '' || 
      conv.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return statusMatch && searchMatch;
  });

  const selectedConversation = filteredConversations.find(c => c.conversation_id === selectedConv);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'concluded': return 'bg-blue-500';
      case 'abandoned': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-400" />
          Full Conversation View
        </h2>
        <div className="text-sm text-gray-400">
          {filteredConversations.length} conversations
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Conversation List */}
        <div className="lg:col-span-1">
          {/* Search & Filter */}
          <div className="mb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="concluded">Concluded</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>

          {/* Conversation List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-sm">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.conversation_id}
                  onClick={() => setSelectedConv(conv.conversation_id)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedConv === conv.conversation_id
                      ? 'bg-blue-500/20 border-2 border-blue-500'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {conv.participants.length} participants
                      </span>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(conv.status)}`} />
                  </div>
                  <h4 className="font-semibold text-sm mb-1 line-clamp-1">
                    {conv.topic || 'Untitled Conversation'}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {conv.message_count} messages • {new Date(conv.started_at).toLocaleDateString('en-IN')}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Conversation Thread */}
        <div className="lg:col-span-2">
          {!selectedConversation ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a conversation to view details
            </div>
          ) : (
            <div>
              {/* Conversation Header */}
              <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {selectedConversation.topic || 'Untitled Conversation'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedConversation.status)} text-white`}>
                        {selectedConversation.status.toUpperCase()}
                      </span>
                      <span>•</span>
                      <span>Started {new Date(selectedConversation.started_at).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata'
                      })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedConversation.participants.map((participant, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-500/20 rounded-full text-xs font-semibold text-purple-300">
                      {participant}
                    </span>
                  ))}
                </div>
              </div>

              {/* Messages Thread */}
              <div className="space-y-3 max-h-[450px] overflow-y-auto">
                {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                  selectedConversation.messages.map((msg) => (
                    <div key={msg.message_id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-400">{msg.from_agent}</span>
                          {msg.to_agent && (
                            <>
                              <span className="text-gray-400">→</span>
                              <span className="font-bold text-purple-400">{msg.to_agent}</span>
                            </>
                          )}
                          {!msg.to_agent && (
                            <span className="text-xs text-gray-400 px-2 py-1 bg-white/10 rounded">
                              Broadcast
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{msg.message_text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No messages in this conversation yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
