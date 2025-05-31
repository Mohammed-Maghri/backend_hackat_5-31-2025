import Fastify from "fastify";
import { registerRoutes } from "./registration.js";
import dotenv from "dotenv";
dotenv.config();
const fastify = Fastify({
    logger: true,
});
const PORT = parseInt(process.env.PORT || "8000", 10);
registerRoutes(fastify);
// try {
//   fastify.ready(async () => {
//     console.log(await fastify.db.all("select * from users ;"));
//   });
// } catch (e) {
//   console.log("Error !", e as Error);
// }
const serverFunction = () => {
    try {
        fastify.listen({ port: PORT, host: "0.0.0.0" }, () => {
            console.log(`server listening on port ${PORT}`);
        });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
serverFunction();
