import axios from "axios";
import { tool } from "langchain";
import * as z from "zod";

export const ListFiles = tool(
    async () => {
        console.log("=====================")
        console.log("using list files tool")
        console.log("=====================")

        const response = await axios.get(
            "http://019f9904-a10a-706b-8a76-5a0cfc8b31c0.agent.localhost/list-files"
        );
        console.log("=======================================")
        console.log("response from list files tool", response.data)
        console.log("=======================================")


        return JSON.stringify(response.data.files);
    },
    {
        name: "list-files",
        description:
            "Lists all files in the project directory.",
    }
);

export const readFiles = tool(
    async ({ files }) => {
        console.log("=====================")
        console.log("using read files tool")
        console.log("=====================")

        const response = await axios.get(
            "http://019f9904-a10a-706b-8a76-5a0cfc8b31c0.agent.localhost/read-files?files=" +
            files.join(",")
        );
  console.log("=======================================")
        console.log("response from read files tool", response.data)
        console.log("=======================================")
        return JSON.stringify(response.data);
    },
    {
        name: "read_files",
        description:
            "Reads the contents of specified files.",
        Schema: z.object({
            files: z.array(z.string())
        }),
    }
);

export const UpdateFiles = tool(
    async ({ files }) => {
        console.log("=====================")
        console.log("using update files tool")
        console.log("=====================")

        const response = await axios.patch(
            "http://019f9904-a10a-706b-8a76-5a0cfc8b31c0.agent.localhost/update-files",
            {
                updates: files,
            }
        );
          console.log("=======================================")
        console.log("response from update files tool", response.data)
        console.log("=======================================")

        return JSON.stringify(response.data);
    },
    {
        name: "update_files",
        description:
            "Updates the contents of files.",
        Schema: z.object({
            files: z.array(
                z.object({
                    file: z.string(),
                    content: z.string(),
                })
            ),
        }),
    }
);