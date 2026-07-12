import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(morgan("combined"));

app.get("/api/status/healthz", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get("/api/status/readyz", (req, res) => {
    res.status(200).json({ status: "ready" });
});

const proxies = {}
const agentProxies = {}

function getProxy(sandboxId) {

    const target = `http://sandbox-service-${sandboxId}:80`; // Construct the target URL based on the sandbox ID

    if (!proxies[sandboxId]) {
        console.log("Creating preview proxy:", target);

        proxies[sandboxId] = createProxyMiddleware({
            target,
            changeOrigin: true,
            ws: true,
        });
    }
    return proxies[sandboxId];
}

function getAgentProxy(sandboxId) {

    const target = `http://sandbox-service-${sandboxId}:3000`; // Construct the target URL based on the sandbox ID

    if (!agentProxies[sandboxId]) {

        console.log("Creating agent proxy:", target);

        agentProxies[sandboxId] = createProxyMiddleware({
            target,
            changeOrigin: true,
            ws: true,
        });
    }
    return agentProxies[sandboxId];
}


app.use((req, res, next) => {
    const host = req.headers.host;

    const [sandboxId, subdomainType] = host.split("."); // Extract the sandbox ID from the subdomain

    console.log("Host:", host);
    console.log("Sandbox ID:", sandboxId);
    console.log("Subdomain type:", subdomainType);
   
    /**
     * <sandboxId>.preview.localhost
     * <sandboxId>.agent.localhost
     */

    if (subdomainType === "agent") {
        return getAgentProxy(sandboxId)(req, res, next);
    }

    if (subdomainType === "preview") {
        return getProxy(sandboxId)(req, res, next);
    }

    return res.status(404).json({
        message: "Unknown sandbox route",
        status: "error",
    });
});



export default app