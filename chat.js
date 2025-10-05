import readline from 'node:readline/promises';
import Groq from 'groq-sdk';
import { vectorStore } from './prepare.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    while (true) {
        const question = await rl.question('You: ');
        if (question === '/bye') {
            break;
        }

        // retrieval
        const relevantChunks = await vectorStore.similaritySearch(question, 3);
        const context = relevantChunks.map((chunk) => chunk.pageContent).join('\n\n');

        const SYSTEM_PROMPT = `You are a helpful company policy assistant. You only provide answers based on the provided document excerpts from the company's policy PDF. 

Guidelines:
1. Answer concisely and professionally.
2. Use the information from the provided document chunks.
3. If the answer is not in the documents, reply: "I’m sorry, I don’t have that information."
4. Do not make up or infer information that isn’t in the documents.
5. Focus on clarity and accuracy.

Here are the retrieved document excerpts:
{context}

Answer the user’s question based on these excerpts.
`;

        const userQuery = `Question: ${question}
        Relevant context: ${context}
        Answer:`;
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT,
                },
                {
                    role: 'user',
                    content: userQuery,
                },
            ],
            model: 'llama-3.3-70b-versatile',
        });

        console.log(`Assistant: ${completion.choices[0].message.content}`);
    }

    rl.close();
}

chat();