import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for Wonder AI Army Dashboard
  const data = {
    agents: [
      { id: 'prime', name: 'WONDER PRIME', status: 'active', performance: 98 },
      { id: 'cto', name: 'CTO', status: 'active', performance: 95 },
      { id: 'cro', name: 'CRO', status: 'active', performance: 92 },
      { id: 'cmo', name: 'CMO', status: 'active', performance: 88 },
      { id: 'coo', name: 'COO', status: 'active', performance: 94 },
      { id: 'cfo', name: 'CFO', status: 'active', performance: 91 }
    ],
    metrics: {
      totalAgents: 6,
      activeAgents: 6,
      tasksCompleted: 342,
      avgResponseTime: 1.2
    },
    recentActivity: [
      { time: '3:35 AM', agent: 'CRO', action: 'GHL Lead Check - 0 new leads' },
      { time: '3:06 AM', agent: 'CRO', action: 'GHL Lead Check - 0 new leads' },
      { time: '2:36 AM', agent: 'COO', action: 'Asana project scan - 50 active' },
      { time: '2:05 AM', agent: 'CRO', action: 'GHL Lead Check - 0 new leads' }
    ],
    revenue: {
      current: 300000,
      target: 1000000,
      daily: 25000
    }
  };
  
  return NextResponse.json(data);
}

export const dynamic = 'force-dynamic';
