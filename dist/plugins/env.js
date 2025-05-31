import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";
export const envPlugin = fp(async (fastify) => {
    const schema = {
        type: "object",
        required: [
            "intra_point",
            "encryption_key",
            "redirect_uri",
            "client_id",
            "port",
            "intra_secret",
            "intra_endpoint",
            "backend_endpoint",
        ],
        properties: {
            backend_endpoint: {
                type: "string",
                default: "https://ae83-197-230-30-146.ngrok-free.app",
            },
            port: {
                type: "number",
                default: 8080,
            },
            client_id: {
                type: "string",
                default: "u-s4t2ud-3d37be66e70cac7276a7ebbd562de8c431098f36cb4ffeb4c8096bfb5325253b",
            },
            redirect_uri: {
                type: "string",
                default: "com.thexd.hackatonnew://redirect",
            },
            intra_endpoint: {
                type: "string",
                default: "https://api.intra.42.fr/oauth/token",
            },
            intra_secret: {
                type: "string",
                default: "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",
            },
            intra_point: {
                type: "string",
                default: "https://api.intra.42.fr",
            },
            encryption_key: {
                type: "string",
                default: "7f472a49a80005a0493cc4c4fd0fc431ee072191595abe709026047ceb886d3c",
            },
        },
    };
    await fastify.register(fastifyEnv, {
        schema,
        data: process.env,
    });
});
