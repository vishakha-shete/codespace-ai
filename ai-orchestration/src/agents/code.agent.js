import "dotenv/config";
import {chatMistralAI} from "@langchain/langgraph"
import { ListFiles, readFiles, UpdateFiles } from "./tools.js"
import { createAgent } from "langchain"

const model = new chatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRALAI_API_KEY
})

const agent = createAgent({
    model,
    tools: [ListFiles, readFiles, UpdateFiles], 
})

await agent.invoke({
    messages: [
        {
           role: "user",
           content: "update the theme of the project to light" 
        }
    ]
})