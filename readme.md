Company Policy Chatbot

A company-internal chatbot that allows employees to interactively ask questions about company policies stored in PDF documents. The chatbot retrieves relevant information from the policy documents and provides accurate, context-aware responses using embeddings and a language model.

Features

Interactive command-line chat interface.

Retrieval-Augmented Generation (RAG) using Pinecone vector store.

Embedding documents using OpenAI text embeddings.

Handles PDF documents and splits content into chunks for efficient retrieval.

Ensures responses are strictly based on company policy content.

Responds professionally and concisely; replies "I’m sorry, I don’t have that information." when relevant information is unavailable.

Tech Stack

Node.js (ES Modules)

LangChain (@langchain/community, @langchain/pinecone, @langchain/openai, @langchain/textsplitters)

Pinecone for vector database

OpenAI Embeddings (text-embedding-3-small)

Groq SDK for querying the language model (llama-3.3-70b-versatile)

PDFLoader for reading PDF documents

dotenv for environment variables

Installation

Clone the repository:

git clone <repository-url>
cd company-chatbot


Install dependencies:

npm install


Create a .env file in the project root with the following keys:

OPENAI_API_KEY=<your_openai_api_key>
PINECONE_API_KEY=<your_pinecone_api_key>
PINECONE_INDEX_NAME=<your_pinecone_index_name>
GROQ_API_KEY=<your_groq_api_key>

Usage
1. Index Company Policy PDF

Run the script to load and embed your PDF documents into Pinecone:

node indexDocuments.js


Make sure to set the filepath in indexDocuments.js to the location of your PDF:

const filepath = "./Cars24.pdf";
IndexTheDocuments(filepath);

2. Start the Chatbot

Run the chatbot script:

node chat.js


Type your questions interactively.

Type /bye to exit the chat.

The chatbot retrieves relevant chunks from Pinecone and answers using the language model.

Project Structure
company-chatbot/
│
├─ chat.js              # Interactive chat interface
├─ prepare.js           # PDF loading, chunking, embeddings, and Pinecone setup
├─ indexDocuments.js    # Script to index a PDF file
├─ package.json         # Project dependencies
├─ .env                 # Environment variables (not committed)
└─ README.md            # This file

How It Works

Document Processing

Load PDF with PDFLoader.

Split into chunks with RecursiveCharacterTextSplitter.

Embed text using OpenAIEmbeddings.

Store embeddings in Pinecone vector database.

Interactive Chat

User enters a question in the terminal.

The chatbot retrieves the top 3 relevant chunks from Pinecone.

Feeds the chunks to the language model with a system prompt ensuring answers are based only on company policy.

System Prompt Example:

You are a helpful company policy assistant. You only provide answers based on the provided document excerpts from the company's policy PDF.

Guidelines:
1. Answer concisely and professionally.
2. Use the information from the provided document chunks.
3. If the answer is not in the documents, reply: "I’m sorry, I don’t have that information."
4. Do not make up or infer information that isn’t in the documents.
5. Focus on clarity and accuracy.

Notes

Ensure you have enough API quota for OpenAI and Groq models.

Keep your .env file secure and never commit it to version control.

For large PDFs, indexing may take a few minutes due to embedding and database operations.

License

This project is for internal company use only. Unauthorized distribution or use outside the company is prohibited.