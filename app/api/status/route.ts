import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data matching expected dashboard structure
  const now = new Date().toISOString();
  
  const data = {
    timestamp: now,
    sessions: [
      { 
        name: 'PRIME', 
        emoji: '🦾',
        status: 'online', 
        messagesHandled: 156,
        tokensUsed: 45200,
        avgResponseTime: 1.2
      },
      { 
        name: 'CTO', 
        emoji: '🔧',
        status: 'monitoring', 
        messagesHandled: 43,
        tokensUsed: 12800,
        avgResponseTime: 0.9
      },
      { 
        name: 'CRO', 
        emoji: '💰',
        status: 'monitoring', 
        messagesHandled: 89,
        tokensUsed: 23400,
        avgResponseTime: 1.1
      },
      { 
        name: 'CMO', 
        emoji: '📢',
        status: 'scheduled', 
        messagesHandled: 34,
        tokensUsed: 8900,
        avgResponseTime: 1.3
      },
      { 
        name: 'COO', 
        emoji: '⚙️',
        status: 'monitoring', 
        messagesHandled: 67,
        tokensUsed: 18200,
        avgResponseTime: 1.0
      },
      { 
        name: 'CFO', 
        emoji: '💵',
        status: 'scheduled', 
        messagesHandled: 21,
        tokensUsed: 6700,
        avgResponseTime: 0.8
      }
    ],
    communications: [
      {
        from: 'CRO',
        to: 'PRIME',
        message: '📊 Lead Check: 0 new leads, 0 warm (60+), 0 need follow-up',
        priority: 'normal',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString()
      },
      {
        from: 'COO',
        to: 'PRIME',
        message: '📋 Asana: 50 active projects scanned, 11 overdue tasks identified',
        priority: 'high',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString()
      },
      {
        from: 'DEPLOYMENT',
        to: 'CTO',
        message: '🚀 Dashboard deployed to Vercel successfully',
        priority: 'normal',
        timestamp: new Date(Date.now() - 2 * 60000).toISOString()
      },
      {
        from: 'PRIME',
        to: 'ALL',
        message: '⚠️ WAR MODE ACTIVE: ₹10L target by March 15 (28 days)',
        priority: 'critical',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString()
      }
    ],
    metrics: {
      totalAgentsDeployed: 6,
      totalAgentsPlanned: 280,
      totalMessagesProcessed: 410,
      totalTokensUsed: 115200,
      avgResponseTime: 1.05,
      uptime: 99.8,
      cronJobsActive: 7,
      cronJobsScheduled: 7
    },
    hierarchy: {
      level0: ['PRIME'],
      level1: ['CTO', 'CRO', 'CMO', 'COO', 'CFO'],
      level2: [],
      level3: []
    }
  };
  
  return NextResponse.json(data);
}

export const dynamic = 'force-dynamic';
