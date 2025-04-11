import Anthropic from '@anthropic-ai/sdk';

async function listModels() {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });

    const models = await anthropic.models.list({
      limit: 20,
    });

    console.log('Available Anthropic Models:');
    console.log('--------------------------');
    models.data.forEach((model) => {
      console.log(`- ${model.id}`);
    });
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels(); 