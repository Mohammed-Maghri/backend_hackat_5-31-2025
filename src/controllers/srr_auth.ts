import { FastifyReply, FastifyRequest } from "fastify";
import { Envs } from "../types/Envs.js";

interface query {
  code: string;
}

const url = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const code: query = req.query as query;
    // const red = new URL("mrboha://auth?token=asdasdasd");
    const validateQuery = await fetch(
      `${req.getEnvs<Envs>().backend_endpoint}/auth/intra`,
      {
        method: "POST",
        body: JSON.stringify({ code: code.code }),
      }
    );
    if (!validateQuery.ok) throw new Error(validateQuery.statusText);
    return res.status(200).send({ tokens: await validateQuery.json() });
  } catch (e) {
    console.log(" ---> Error ", e);
    res.status(400).send({ error: "Error Bad Req !" });
  }
};

export { url };
