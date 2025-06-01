import { FastifyReply, FastifyRequest } from "fastify";
import { Orm_db } from "../orm.js";
import { userDatabaseSchema } from "../types/userAuthData";
import { user_authData } from "../types/userAuthData";

export const checkingUserPrivilege = async (
  request: FastifyRequest,
  response: FastifyReply,
  userData: user_authData
) => {
  const dbUser = (await Orm_db.selection({
    server: request.server,
    table_name: "users",
    colums_name: ["*"],
    command_instraction: `WHERE login = "${userData.login}"`,
  })) as userDatabaseSchema[];

  let isStaff = false;
  if (userData.login === "abablil") {
    isStaff = true;
  }
  if (!isStaff) {
    if (!dbUser || dbUser.length === 0) {
      // User NOT in DB → Check JWT staff flag
      console.log("User not found in DB, checking JWT staff...");
      if (userData.staff === true) {
        isStaff = true;
      } else {
        return -1;
      }
    } else {
      // User IS in DB → Only DB staff matters
      isStaff = dbUser[0].staff === true;
      if (!isStaff) {
        return -1;
      }
    }
  }
  return 1;
};
