import express from "express";
import morgan from "morgan";
import fs from "fs";

const WORKSPACE_DIR = "/workspace";

const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello from sandbox agent!",
        status: "success",
    });
});

app.get("/list-files", async (req, res) => {
    try {
        const elements = await fs.promises.readdir(WORKSPACE_DIR);

        res.status(200).json({
            message: "Elements in the workspace directory",
            files: elements,
            status: "success",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to read workspace directory",
            status: "error",
        });
    }
});

export default app;