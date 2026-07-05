import express from "express";
import morgan from "morgan";
import fs from "fs";

const WORKSPACE_DIR = './workspace';

const app = express();

app.use(morgan("dev"));


app.get("/", (req, res) => {
    res.status(200).json({ 
        message: "Hello from sandbox agent!",
        status: "success"
    });
});


app.get("/list-files", (req, res) => {
    const elements = await fs.promises.readdir(WORKSPACE_DIR);
    res.status(200).json({
        message: "List of files in the workspace directory",
        files: elements,
        status: "success"
    });
});


export default app;