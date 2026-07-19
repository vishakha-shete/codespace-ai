import express from "express";
import morgan from "morgan";
import fs from "fs";

const WORKSPACE_DIR = "/workspace";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello from sandbox agent!",
        status: "success",
    });
});

app.get("/list-files", async (req, res) => {
    const elements = await fs.promises.readdir(WORKSPACE_DIR);

    res.status(200).json({
        message: "Elements in the working directory",
        files: elements,
    });
});


/**
 * @route GET /read-files
 * @description  Reads the content of all files requested in the query parameter 'files' and return their content as a json object
 * - e.g /read-files?files=filel.txt,/src/file2.txt
 * 
 */
app.get("/read-files", async (req, res) => {

    const files = req.query.files;

    if (!files) {
        return res.status(400).json({
            message: "No files specified in query parameter",
            status: "error",
        });
    }

    const fileList = files.split(",");

    const results = await Promise.all(
        fileList.map(async (file) => {

            const filePath = `${WORKSPACE_DIR}/${file}`;

            try {

                const content = await fs.promises.readFile(filePath, "utf-8");

                return {
                    [file]: content,
                };

            } catch (err) {

                return {
                    [file]: `Error reading file: ${err.message}`,
                };

            }

        })
    );

    return res.status(200).json({
        message: "Files read successfully",
        files: Object.assign({}, ...results),
        status: "success",
    });

});

export default app;