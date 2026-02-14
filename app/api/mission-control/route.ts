import { NextResponse } from 'next/server';

// This would connect to actual Mission Control DB in production
// For now, returning mock data structure

export async function GET() {
  const now = new Date().toISOString();
  
  const data = {
    timestamp: now,
    
    // Agent Status Feed
    agentStatuses: [
      { agent: 'PRIME', status: 'online', message: 'Orchestrating army operations', time: now },
      { agent: 'CRO', status: 'monitoring', message: 'Scanning GHL - 1 hot lead found', time: now },
      { agent: 'COO', status: 'monitoring', message: 'Asana health check complete', time: now },
      { agent: 'CTO', status: 'scheduled', message: 'Next deployment check in 2h', time: now },
      { agent: 'CMO', status: 'scheduled', message: 'Content pipeline review at 10AM', time: now },
      { agent: 'CFO', status: 'scheduled', message: 'Revenue tracking at 5PM', time: now }
    ],
    
    // Agent-to-Agent Messages
    agentMessages: [
      {
        from: 'CRO',
        to: 'CMO',
        message: 'Found hot lead in interior-design vertical (score: 95). Suggest targeted content.',
        priority: 'high',
        status: 'unread',
        time: new Date(Date.now() - 2 * 60000).toISOString()
      },
      {
        from: 'COO',
        to: 'CTO',
        message: '11 overdue tasks in Asana - 3 are blocking releases',
        priority: 'critical',
        status: 'read',
        time: new Date(Date.now() - 30 * 60000).toISOString()
      },
      {
        from: 'CMO',
        to: 'CRO',
        message: 'Healthcare content performing well. Should we target more clinics?',
        priority: 'normal',
        status: 'read',
        time: new Date(Date.now() - 45 * 60000).toISOString()
      }
    ],
    
    // Discoveries
    discoveries: [
      {
        agent: 'CRO',
        category: 'lead',
        title: 'Hot Lead: Bangalore Interior Designer',
        description: '95/100 match score - high budget, immediate need',
        actionable: true,
        time: new Date(Date.now() - 5 * 60000).toISOString()
      },
      {
        agent: 'CMO',
        category: 'trend',
        title: 'AI automation queries up 45% this week',
        description: 'Healthcare and real estate showing most interest',
        actionable: true,
        time: new Date(Date.now() - 2 * 3600000).toISOString()
      },
      {
        agent: 'CTO',
        category: 'bug',
        title: 'GHL API rate limit reached 3x yesterday',
        description: 'Need to implement caching or reduce polling frequency',
        actionable: true,
        time: new Date(Date.now() - 12 * 3600000).toISOString()
      }
    ],
    
    // Self-Optimizations
    optimizations: [
      {
        agent: 'CRO',
        type: 'workflow',
        description: 'Increase lead scan frequency to 15min during 9AM-6PM IST',
        before: 'Every 30min all day',
        after: 'Every 15min 9AM-6PM, every 60min night',
        impactScore: 85,
        status: 'proposed',
        time: new Date(Date.now() - 10 * 60000).toISOString()
      },
      {
        agent: 'CTO',
        type: 'code',
        description: 'Implement Redis caching for GHL pipeline data',
        before: 'Fetch on every check (60 calls/day)',
        after: 'Cache for 5min (12-15 calls/day)',
        impactScore: 75,
        status: 'approved',
        time: new Date(Date.now() - 3 * 3600000).toISOString()
      },
      {
        agent: 'CMO',
        type: 'automation',
        description: 'Auto-post top-performing content to LinkedIn',
        before: 'Manual review and posting',
        after: 'Auto-post if engagement score >80',
        impactScore: 65,
        status: 'implemented',
        time: new Date(Date.now() - 24 * 3600000).toISOString()
      }
    ],
    
    // Shared Tasks Queue
    tasks: [
      {
        createdBy: 'PRIME',
        assignedTo: 'CRO',
        description: 'Analyze last 4 days of Meta leads - conversion rate analysis',
        priority: 'high',
        status: 'in_progress'
      },
      {
        createdBy: 'CRO',
        assignedTo: 'CMO',
        description: 'Create case study for interior design vertical',
        priority: 'normal',
        status: 'pending'
      },
      {
        createdBy: 'COO',
        assignedTo: 'CTO',
        description: 'Fix overdue tasks blocking Zenova release',
        priority: 'critical',
        status: 'pending'
      }
    ],
    
    // Summary Stats
    stats: {
      unreadMessages: 1,
      actionableDiscoveries: 3,
      pendingOptimizations: 1,
      approvedOptimizations: 1,
      pendingTasks: 2,
      tasksInProgress: 1
    }
  };
  
  return NextResponse.json(data);
}

export const dynamic = 'force-dynamic';
