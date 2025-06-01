import { FastifyRequest } from "fastify";
import { user_authData } from "../types/userAuthData.js";
import { Orm_db } from "../orm.js";
import { userInfo } from "os";
// Function to create a user account based on the provided user data

export const userAccountCreation = async (
  request: FastifyRequest,
  userData: user_authData
) => {
  const userExists = (await Orm_db.selection({
    server: request.server,
    table_name: "users",
    colums_name: ["login"],
    command_instraction: `where login = '${userData.login}'`,
  })) as string[];
  console.log(userExists, "userExists");
  if (userExists.length > 0) {
    console.log("User already exists, skipping account creation.");
    return;
  }
  // needs to get the expoPushToken from the userData
  const expo_notification_token = request.body as string;
  console.log(expo_notification_token, "expo_notification_token");
  console.log("Creating user account...");
  const res = await Orm_db.insertion({
    server: request.server,
    table_name: "users",
    colums_name: [
      "first_name",
      "last_name",
      "email",
      "login",
      "images",
      "role",
      "club_staff",
      "expo_notification_token",
    ],
    colums_values: [
      userData.first_name,
      userData.last_name,
      userData.email,
      userData.login,
      userData.images,
      userData.staff,
      false,
      expo_notification_token ? expo_notification_token : "",
    ],
    command_instraction: null,
  });
  console.log(
    res,
    expo_notification_token,
    "this is the result of insertion of user query"
  );
};
