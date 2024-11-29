export const runtime = 'edge';

export async function POST(request: Request) {
  const { prompt, industry } = await request.json();
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Generate a cold email template based on this context:
          Goal: ${prompt}
          Industry: ${industry || 'Not specified'}
          
          Requirements:
          1. Follow these best practices:
             - No links in the email
             - Keep it concise (2-3 paragraphs)
             - Use a personal and conversational tone
             - Include a clear call-to-action
             - Avoid spam trigger words
          2. Use spintax format {option1|option2|option3} for variations
          3. Include placeholders like {{first_name}} and {{company_name}}
          4. Focus on starting a conversation, not selling`
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate email');
    }

    const data = await response.json();
    return Response.json({ content: data.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Failed to generate email' }, { status: 500 });
  }
}
