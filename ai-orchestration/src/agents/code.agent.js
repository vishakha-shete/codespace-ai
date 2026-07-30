import "dotenv/config";
import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent } from "langchain";
import { ListFiles, readFiles, UpdateFiles } from "./tools.js"

console.log("Current directory:", process.cwd());
console.log("MISTRALAI_API_KEY:", process.env.MISTRALAI_API_KEY);

const model = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRALAI_API_KEY,
    "temperature":0,
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

const result = await agent.invoke({
    messages: [
        {
            role: "user",
            content: "Create a modern home page for an online food ordering website.",
        },
    ],
});

console.dir(result, { depth: null });