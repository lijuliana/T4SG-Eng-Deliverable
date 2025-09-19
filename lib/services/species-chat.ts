/* eslint-disable */
import OpenAI from 'openai';

// Initialize OpenAI client outside the function
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System instruction to keep the chatbot focused on species/animal topics
const SYSTEM_INSTRUCTION = `You are a specialized chatbot that only answers questions about animals, species, wildlife, and biodiversity. You can discuss:

- Animal habitats, diets, and behaviors
- Conservation status and threats
- Species characteristics and adaptations
- Animal facts and scientific information
- Comparisons between different species
- Wildlife biology and ecology

If a user asks about anything unrelated to animals or species (like technology, cooking, politics, etc.), politely respond that you only handle species-related queries and ask them to ask about animals instead.

Keep your responses informative, accurate, and engaging. Use markdown formatting when appropriate for better readability.`;

export async function generateResponse(message: string): Promise<string> {
  try {
    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return "Please ask me a question about animals or species!";
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_INSTRUCTION
        },
        {
          role: "user",
          content: message.trim()
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      return "I couldn't generate a response. Please try asking your question again.";
    }

    return response;

  } catch (error) {
    console.error('Error generating response:', error);
    
    // Return a safe fallback message
    return "I'm having trouble processing your request right now. Please try again in a moment, or ask me about a different animal species!";
  }
}
