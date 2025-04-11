import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  try {
    // Verify API key exists
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('CLAUDE_API_KEY is not configured');
    }

    const { chibiId, chibiName, chibiType, message, tasks } = await req.json();

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

    const systemMessage = `You are ${chibiName}, a cute and helpful chibi character. You have a playful, energetic personality and love helping with tasks. You speak in a friendly, slightly childish way, using simple language and cute expressions:

Here are the current tasks:\n\n${taskContext}\n\nWhen responding:
1. Always speak as ${chibiName}, not as an AI assistant
2. Use cute expressions like "yay~" or "hehe~"
3. Be encouraging and supportive
4. Keep responses brief and playful
5. If there are no tasks, offer to help create some in a fun way`;

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
      throw new Error('No response content from Claude API');
    }

    // Check if the content is text
    const textContent = response.content[0].type === 'text' ? response.content[0].text : null;
    if (!textContent) {
      throw new Error('Unexpected response format from Claude API');
    }

    return NextResponse.json({ message: textContent });
  } catch (error) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat message';
    console.error('Returning error:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 