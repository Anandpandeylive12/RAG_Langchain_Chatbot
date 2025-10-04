import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";





export async function IndexTheDocuments(filepath){
   const Loader =  new PDFLoader(filepath,{splitPages:false});
   const docs = await  Loader.load()

   console.log(docs);
   
}