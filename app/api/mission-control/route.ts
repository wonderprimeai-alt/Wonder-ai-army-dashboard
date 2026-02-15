import { NextResponse } from 'next/server';

const REDIS_URL = 'redis://default:tVOyGyCoaAqt3nF65KxLSAQlm8pze0EC@redis-19694.c323.us-east-1-2.ec2.cloud.redislabs.com:19694';
const REDIS_KEY = 'wonder:mission-control';

export async function GET() {
  try {
    // Import Redis dynamically (server-side only)
    const { createClient } = await import('redis');
    
    // Create new client for this request
    const client = createClient({ url: REDIS_URL });
    await client.connect();
    
    // Get data
    const data = await client.get(REDIS_KEY);
    
    // Close connection
    await client.quit();
    
    if (!data) {
      throw new Error('No data in Redis');
    }
    
    const parsed = JSON.parse(data);
    parsed._isLive = true;
    parsed._source = 'redis-cloud';
    
    return NextResponse.json(parsed, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('Redis fetch failed:', error);
    
    // Simple fallback
    const now = new Date().toISOString();
    return NextResponse.json({
      timestamp: now,
      _isLive: false,
      _source: 'fallback',
      _error: error instanceof Error ? error.message : 'Unknown',
      agentStatuses: [
        { agent: 'PRIME', status: 'active', message: 'System operational', time: now },
        { agent: 'CRO', status: 'monitoring', message: '58 warm leads tracked', time: now },
        { agent: 'COO', status: 'monitoring', message: '59 overdue tasks flagged', time: now },
        { agent: 'CTO', status: 'scheduled', message: 'Next check at 9AM', time: now },
        { agent: 'CMO', status: 'scheduled', message: 'Content review at 10AM', time: now },
        { agent: 'CFO', status: 'scheduled', message: 'Revenue tracking at 5PM', time: now }
      ],
      discoveries: [],
      messages: [],
      stats: { unreadMessages: 0, actionableDiscoveries: 0 }
    });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
