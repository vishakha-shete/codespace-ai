import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent } from "langchain";
import { ListFiles, readFiles, UpdateFiles } from "./tools.js"

console.log("Current directory:", process.cwd());
console.log("GOOGLE_GENAI_API_KEY:", process.env.GOOGLE_GENAI_API_KEY);

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

console.log(
    ListFiles.name,
    readFiles.name,
    UpdateFiles.name
);

const agent = createAgent({
    model,
    tools: [ListFiles, readFiles, UpdateFiles],
})

export default agent;