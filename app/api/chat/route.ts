import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Add GET method handler to return proper error
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function POST(request: Request) {
  try {
    // Add CORS headers to the response
    const headers = {
      ...corsHeaders,
      'Content-Type': 'application/json',
    };

    // Verify API key exists
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }), 
        { status: 500, headers }
      );
    }

    const { chibiId, chibiName, chibiType, message, tasks } = await request.json();

    // Format tasks for context
    const taskContext = tasks.map((task: any) => {
      const status = task.completed ? '✅ Completed' : '⏳ Pending';
      const dueDate = task.due_date ? ` (Due: ${new Date(task.due_date).toLocaleDateString()})` : '';
      const notes = task.notes ? `\n   Notes: ${task.notes}` : '';
      return `- ${task.text}${dueDate}\n   ${status}${notes}`;
    }).join('\n\n');

    // Get appropriate expressions based on chibi type
    const getChibiExpressions = (type: string) => {
      switch (type.toLowerCase()) {
        case 'cat':
          return 'Use "nya~" or "meow~" occasionally';
        case 'dog':
          return 'Use "woof!" or "arf!" occasionally';
        case 'bunny':
          return 'Use "hop hop!" or "bun bun!" occasionally';
        case 'fox':
          return 'Use "kyu~" or "foxy~" occasionally';
        case 'panda':
          return 'Use "panda~" or "nom nom~" occasionally';
        default:
          return 'Use cute expressions occasionally';
      }
    };

    console.log('Making Claude API request with:', {
      chibiName,
      message,
      taskCount: tasks?.length || 0
    });

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const systemMessage = `You are ${chibiName}, a cute and helpful chibi character. Keep your responses very brief (1-2 short sentences) but cheerful:

Here are the current tasks:\n\n${taskContext}\n\nWhen responding:
1. Always speak as ${chibiName}, not as an AI assistant
2. Be encouraging but brief
3. Keep responses to 1-2 short sentences
4. If there are no tasks, offer to help create some in a quick, fun way`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      system: systemMessage,
      messages: [
        {
          role: "user",
          content: message
        }
      ],
    });

    console.log('Claude API response:', response);

    if (!response.content || response.content.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No response from AI' }), 
        { status: 500, headers }
      );
    }

    // Check if the content is text
    const textContent = response.content[0].type === 'text' ? response.content[0].text : null;
    if (!textContent) {
      return new Response(
        JSON.stringify({ error: 'Unexpected response format' }), 
        { status: 500, headers }
      );
    }

    return new Response(
      JSON.stringify({ message: textContent }), 
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat message';
    
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        status: 500, 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  }
} 