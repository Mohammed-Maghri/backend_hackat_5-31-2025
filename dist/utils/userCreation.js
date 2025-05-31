import { Orm_db } from "../orm.js";
// Function to create a user account based on the provided user data
export const userAccountCreation = async (request, userData) => {
    const userExists = (await Orm_db.selection({
        server: request.server,
        table_name: "users",
        colums_name: ["login"],
        command_instraction: `where login = '${userData.login}'`,
    }));
    console.log(userExists, "userExists");
    if (userExists.length > 0) {
        console.log("User already exists, skipping account creation.");
        return;
    }
    console.log("Creating user account...");
    const result = await Orm_db.insertion({
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
        ],
        colums_values: [
            userData.first_name,
            userData.last_name,
            userData.email,
            userData.login,
            userData.images,
            userData.staff,
            false,
        ],
        command_instraction: null,
    });
};
