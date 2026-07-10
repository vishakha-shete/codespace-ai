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
    const elements = await fs.promises.readdir(WORKING_DIR);

    res.status(200).json({
        message: "Elements in the working directory",
        files: elements,
    });
});

export default app;