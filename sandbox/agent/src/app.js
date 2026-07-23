import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";

const WORKSPACE_DIR = "/workspace";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello from sandbox agent!",
        status: "success",
    });
});

/**
 * @route GET /list-files
 * @description lists all files in the working directory and its subdirectories. returns a JSON object
 * with the file paths relative to the working directory. exclude directors like node_modules, .git,
 * dist, etc.
 * - eg.{
 *  "files":[
 *        "filel.txt",
 *        "src/file2.txt",
 *        "src/subdir/file3.txt"
 *       ]
 * }
 */

app.get("/list-files", async (req, res) => {

    const listFiles = async (dir, baseDir) => {

        const entries = await fs.promises.readdir(dir, {
            withFileTypes: true,
        });

        const files = [];

        const excludedDirs = [
            "node_modules",
            ".git",
            "dist",
            "build",
            ".next",
            ".cache",
        ];

        for (const entry of entries) {

            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(baseDir, fullPath);

            if (
                entry.isDirectory() &&
                excludedDirs.includes(entry.name)
            ) {
                continue;
            }

            if (entry.isDirectory()) {
                files.push(...await listFiles(fullPath, baseDir));
            } else {
                files.push(relativePath);
            }
        }

        return files;
    };

    try {

        const files = await listFiles(
            WORKSPACE_DIR,
            WORKSPACE_DIR
        );

        return res.status(200).json({
            message: "Files listed successfully",
            files,
            status: "success",
        });

    } catch (err) {

        return res.status(500).json({
            message: `Error listing files: ${err.message}`,
            status: "error",
        });

    }

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


/**
 * @route PATCH /update-files
 * @description updates the content of the files specified in the request body. the request body should containe a property 'updates' with a JSON Array of objects 
 * each object should have a 'file-property' specifting the file path (relative to the working directory) and a 'content' property 
 * specifiting the new content for the file.
 */

app.patch("/update-files", async (req, res) => {

    const { updates } = req.body || {};
    
    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({
            message: 'Invalid request body. Expected an "updates" array.',
            status: "error",
        });
    }

    const results = await Promise.all(
        updates.map(async (update) => {

            const { file, content } = update;

            if (!file || content === undefined) {
                return {
                    error: "Invalid update object",
                };
            }

            const filePath = path.join(WORKSPACE_DIR, file);

            try {

                await fs.promises.writeFile(filePath, content, "utf-8");

                return {
                    [file]: "File updated successfully",
                };

            } catch (err) {

                return {
                    [file]: `Error updating file: ${err.message}`,
                };

            }

        })
    );

    return res.status(200).json({
        message: "File update results",
        results,
        status: "success",
    });

});

/**
 * @route POST /create-files
 * @description creates new files with the content specified in the request body.
 * the request body should contain a property 'files' with a JSON Array of objects, each object should have a 'file'
 * property specifying the file path (relative to the working directory) and a 'content' property
 * specifying the content for the new file.
 */
app.post("/create-files", async (req, res) => {
    const files = req.body.files;

    if (!files || !Array.isArray(files)) {
        return res.status(400).json({
            message: 'Invalid request body. Expected a JSON object with a "files" property containing',
            status: 'error',
        })
    }
    const results = await Promise.all(files.map(async (fileObj) => {
        const { file, content } = fileObj;
        const filePath = path.join(WORKSPACE_DIR, file);
        try {
            await fs.promises.writeFile(filePath, content, 'utf-8');
            return {
                file,
                message: "File created successfully",
            };
        } catch (err) {
            return {
                [filePath]: `Error creating file: ${err.message}`,
            }
        }
    }));
    res.status(200).json({
        message: "Files created successfully",
        results,
        status: "success",
    });
})

export default app;