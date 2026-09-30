import { Router } from "express";
import agent from "../agents/code.agent.js";

const agentRouter = Router();

agentRouter.post("/invoke", async (req, res) => {
    try {
        const { message } = req.body;
        const response = await agent.invoke({
            message: [{
                role: "user",
                content: message
            }]
        });
        res.json({ response });
    } catch (error) {
        console.error("Error invoking agent:", {
            statusCode: error?.statusCode,
            message: error?.message,
            body: error?.body
        });

        if (error?.statusCode === 429) {
            return res.status(429).json({
                error: "Mistral API rate limit exceeded",
                message: "Please try again later."
            });
        }

        return res.status(500).json({
            error: "Failed to invoke agent"
        });
    }

});

export default agentRouter;