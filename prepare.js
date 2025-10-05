import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import 'dotenv/config';
//adding the embedding model
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.OPENAI_API_KEY,
});



//adding the vector database pinecone 
const pinecone = new PineconeClient({apiKey:process.env.PINECONE_API_KEY});
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

// loading the Pdf and by splitpages :false -> makes it in one page 
export async function IndexTheDocuments(filepath){
   const Loader =  new PDFLoader(filepath,{splitPages:false});
   const docs = await  Loader.load()

   
   //spliting the pdf
   const textSplitter = new RecursiveCharacterTextSplitter({
   chunkSize: 500,
   chunkOverlap: 100,
});
const texts = await textSplitter.splitDocuments(docs);

const documents =  texts.map((chunk)=>{
   return {
      pageContent:  String(chunk.pageContent),
      metadata: chunk.metadata || {},
   }
})

await vectorStore.addDocuments(documents);
   // console.log(documents);
}