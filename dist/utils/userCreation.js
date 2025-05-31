import { Orm_db } from "../orm.js";
// Function to create a user account based on the provided user data
export const userAccountCreation = async (request, userData) => {
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
    console.log(result, "result of query");
};
