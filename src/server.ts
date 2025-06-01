import Fastify, { FastifyInstance } from "fastify";
import { registerRoutes } from "./registration.js";
import dotenv from "dotenv";

dotenv.config();

const fastify: FastifyInstance = Fastify({
  logger: false,
});

const PORT = parseInt(process.env.PORT || "8000", 10);

await fastify.register(import("@fastify/rate-limit"), {
  max: 60,
  timeWindow: "1 minute",
});
registerRoutes(fastify);

const serverFunction = () => {
  try {
    fastify.listen({ port: PORT, host: "0.0.0.0" }, () => {
      console.log(`server listening on port ${PORT}`);
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

serverFunction();
