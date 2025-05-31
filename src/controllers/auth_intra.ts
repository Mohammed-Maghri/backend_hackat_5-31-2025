import { FastifyRequest, FastifyReply } from "fastify";
import { Envs } from "../types/Envs.js";
import { encrypte_token } from "../helpers/encryption.js";
import {
  user_authData,
  staffUsers,
  Token_type,
  code_extract,
  idlogin,
} from "../types/userAuthData.js";
import { userAccountCreation } from "../utils/userCreation.js";
import { Orm_db } from "../orm.js";

const auth_intra = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const code = (req.body as code_extract).code;
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
    await userAccountCreation(req, userAuth);
    const user_id: idlogin[] = (await Orm_db.selection({
      server: req.server,
      table_name: "users",
      colums_name: ["id"],
      command_instraction: `where login = '${userAuth.login}'`,
    })) as idlogin[];
    const usedTok = await res.jwtSign({
      id: user_id[0].id,
      first_name: userAuth.first_name,
      last_name: userAuth.last_name,
      email: userAuth.email,
      login: userAuth.login,
      staff: staffUsers.includes(userAuth.login)
        ? true
        : userAuth?.staff || false,
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
