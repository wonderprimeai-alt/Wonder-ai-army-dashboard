import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { createClient } = await import('redis');
    
    const client = createClient({ 
      url: 'redis://default:tVOyGyCoaAqt3nF65KxLSAQlm8pze0EC@redis-19694.c323.us-east-1-2.ec2.cloud.redislabs.com:19694'
    });
    
    await client.connect();
    const data = await client.get('wonder:mission-control');
    await client.quit();
    
    if (!data) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'No data in Redis',
        timestamp: new Date().toISOString()
      });
    }
    
    const parsed = JSON.parse(data);
    
    return NextResponse.json({ 
      status: 'ok',
      timestamp: parsed.timestamp,
      agentCount: parsed.agentStatuses?.length || 0,
      message: 'Redis connection working!'
    });
    
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
