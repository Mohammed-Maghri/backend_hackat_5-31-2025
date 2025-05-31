import { FastifyRequest, FastifyReply } from "fastify";
import { Envs } from "../types/Envs.js";
import { encrypte_token } from "../helpers/encryption.js";

interface Token_type {
  access_token: string;
  refresh_token: string;
}

interface code_extract {
  code: string;
}

interface user_authData {
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  images: string;
  staff: boolean;
}

const auth_intra = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const code = (JSON.parse(req.body as string) as code_extract).code;
    const Toke = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: req.server.getEnvs<Envs>().client_id,
      client_secret: req.server.getEnvs<Envs>().intra_secret,
      code: code,
      redirect_uri: req.server.getEnvs<Envs>().redirect_uri,
    });

    const access_token = await fetch(
      req.server.getEnvs<Envs>().intra_endpoint,
      {
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        body: Toke.toString(),
      }
    );
    if (!access_token || access_token.status >= 400)
      throw new Error("invalid !");
    const keys: Token_type = (await access_token.json()) as Token_type;
    const who_im = await fetch("https://api.intra.42.fr/v2/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${keys.access_token}`,
      },
    });
    if (!who_im.ok) throw new Error("Error !");
    const data = (await who_im.json()) as any;
    const userAuth: user_authData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      login: data.login,
      staff: data?.staff || false,
      images: data.image.versions.large,
    } as user_authData;
    const usedTok = await res.jwtSign({
      first_name: userAuth.first_name,
      last_name: userAuth.last_name,
      email: userAuth.email,
      login: userAuth.login,
      staff: userAuth?.staff || false,
      images: userAuth.images,
      access_token: encrypte_token({
        message: keys.access_token,
        key: req.server.getEnvs<Envs>().encryption_key,
      }),
      refresh_token: encrypte_token({
        message: keys.refresh_token,
        key: req.server.getEnvs<Envs>().encryption_key,
      }),
    });

    return res.status(200).send(JSON.stringify(usedTok));
  } catch (e) {
    return res.status(400).send({ error: "Unauthorized User !" });
  }
};

export type { user_authData };
export { auth_intra };
