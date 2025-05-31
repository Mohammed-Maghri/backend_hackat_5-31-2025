import { FastifyInstance } from "fastify";
import { fpSqlitePlugin } from "fastify-sqlite-typed";
import { Auth_intra } from "./end_points/auth_intra.js";
import { redirect_url } from "./end_points/redirect_callback.js";
import { userRoutes } from "./user/user.route.js";
import { eventRoutes } from "./events/events.route.js";
import fastifyCors from "@fastify/cors";
import fastifySensible from "@fastify/sensible";
import { envPlugin } from "./plugins/env.js";
import jwtFromThere from "./plugins/jwt.js";
import { feedBackroutes } from "./feedback/feedback.route.js";
import { adminRoutes } from "./admin/admin.route.js";

const registerRoutes = (fastify: FastifyInstance) => {
  fastify.register(fpSqlitePlugin, {
    dbFilename: "src/database/database.db",
  });
  fastify.register(fastifyCors, { origin: "*" });
  fastify.register(jwtFromThere);
  fastify.register(fastifySensible); // easier error message f controller
  fastify.register(envPlugin);
  fastify.register(Auth_intra);
  fastify.register(redirect_url);
  fastify.register(userRoutes);
  fastify.register(eventRoutes);
  fastify.register(feedBackroutes);
  fastify.register(adminRoutes);
};

export { registerRoutes };
