import "dotenv/config";
import app from "./src/app";

app.listen(3000,()=>{
    console.log(`AI Orchestation server is running on port 3000`)
});