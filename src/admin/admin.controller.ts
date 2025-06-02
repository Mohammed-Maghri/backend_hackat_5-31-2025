import { FastifyRequest, FastifyReply } from "fastify";
import { Orm_db } from "../orm.js";
import { userDatabaseSchema, user_authData } from "../types/userAuthData";
import { CategoryAddSchemaType } from "./admin.schema.js";
import { checkingUserPrivilege } from "../utils/privilegeChecker.js";
import { allowedEventFields } from "../types/allowedEventFields.js";
import { eventUpdateSchema } from "./admin.schema.js";

// work on the privileges of the admin, test with valid admin user, and test the endpoint
export const addAdminPriveleges = async (
  req: FastifyRequest<{ Querystring: { login: string } }>,
  res: FastifyReply
) => {
  try {
    await req.jwtVerify();
    const user = (await req.jwtDecode()) as user_authData;
    const isPriviliged = (await Orm_db.selection({
      server: req.server,
      table_name: "users",
      colums_name: ["*"],
      command_instraction: `WHERE login = "${user.login}"`,
    })) as userDatabaseSchema[];
    console.log(isPriviliged);
    if (isPriviliged.length === 0) {
      console.log("User not found in database");
      if (!user.staff) {
        return res.status(403).send({ logs: "Forbidden" });
      }
    } else if (!isPriviliged[0].staff) {
      console.log("User is not an admin");
      return res.status(403).send({ logs: "Forbidden" });
    }
    const { login } = req.query;
    if (!login) {
      return res.status(400).send({ error: "Login is required" });
    }
    console.log("Adding admin privileges for user:", login);
    const userSelection = (await Orm_db.selection({
      server: req.server,
      table_name: "users",
      colums_name: ["*"],
      command_instraction: `WHERE login = "${login}"`,
    })) as userDatabaseSchema[];
    console.log("User Selection:", userSelection);
    if (userSelection.length === 0) {
      return res.status(404).send({ error: "User not found" });
    }
    const userId = userSelection[0].id;
    if (userSelection[0].staff) {
      return res.status(400).send({ error: "User is already an admin" });
    }
    const getUserId = await Orm_db.update({
      server: req.server,
      table_name: "users",
      colums_name: ["role"],
      colums_values: [true],
      condition: `WHERE id = "${userId}"`,
    });
    return res
      .status(200)
      .send({ logs: "Admin privileges added successfully" });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).send({ error: "Unauthorized" });
  }
};

// Function to add a new event category
export const addEventCategory = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    //  Verify JWT and decode user info
    await req.jwtVerify();
    const user = (await req.jwtDecode()) as user_authData;

    //  Check user in DB
    const dbUser = (await Orm_db.selection({
      server: req.server,
      table_name: "users",
      colums_name: ["*"],
      command_instraction: `WHERE login = "${user.login}"`,
    })) as userDatabaseSchema[];

    let isStaff = false;
    if (user.login === "abablil") {
      isStaff = true;
    }

    if (!isStaff) {
      if (!dbUser || dbUser.length === 0) {
        // User NOT in DB → Check JWT staff flag
        console.log("User not found in DB, checking JWT staff...");
        if (user.staff === true) {
          isStaff = true;
        } else {
          return res
            .status(403)
            .send({ error: "Forbidden: User is not staff" });
        }
      } else {
        // User IS in DB → Only DB staff matters
        isStaff = dbUser[0].staff === true;
        if (!isStaff) {
          return res
            .status(403)
            .send({ error: "Forbidden: User is not staff" });
        }
      }
    }
    //  Extract and validate category data
    const { category } = req.query as CategoryAddSchemaType;
    if (!category || category.trim().length < 3) {
      return res.status(400).send({
        error: "Category name is required and must be at least 3 characters",
      });
    }
    // Check if category already exists (by name or ID)
    const whereClause = `WHERE category_name = "${category.trim()}"`;
    const existingCategory = (await Orm_db.selection({
      server: req.server,
      table_name: "categories",
      colums_name: ["*"],
      command_instraction: whereClause,
    })) as { id: number; category_name: string }[];

    if (existingCategory.length > 0) {
      return res.status(409).send({ error: "Category already exists" });
    }

    //  Insert new category
    const result = await Orm_db.insertion({
      server: req.server,
      table_name: "categories",
      colums_name: ["category_name"],
      colums_values: [category.trim()],
      command_instraction: null,
    });
    if (result === -1) {
      return res.status(500).send({ error: "Failed to add category" });
    }
    return res
      .status(201)
      .send({ message: "Category added successfully", category });
  } catch (err: any) {
    console.error("Error in addEventCategory:", err);
    return res.status(401).send({ error: "Unauthorized" });
  }
};

export const deleteEvent = async (
  request: FastifyRequest,
  response: FastifyReply
) => {
  try {
    // Verify JWT and decode user info
    await request.jwtVerify();
    const userData: user_authData = await request.jwtDecode();
    //check if the user is admin with the fuction checkingUserPrivilege
    const privilegeCheck = await checkingUserPrivilege(
      request,
      response,
      userData
    );
    if (privilegeCheck === -1) {
      return response.status(403).send({ error: "Forbidden" });
    }
    // Extract event ID from query parameters
    const { id } = request.params as { id: string };
    if (!id) {
      return response.status(400).send({ error: "Event ID is required" });
    }
    // Delete the event from the database
    const DeleteResult = await Orm_db.deletion({
      server: request.server,
      table_name: "events",
      condition: `WHERE id = "${id}"`,
    });
    return response.status(200).send({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return response.status(400).send({ error: "Internal Server Error" });
  }
};

export const endEvent = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    // Verify JWT and decode user info
    await req.jwtVerify();
    const userData: user_authData = await req.jwtDecode();

    // Check if the user has admin privileges
    const privilegeCheck = await checkingUserPrivilege(req, res, userData);
    if (privilegeCheck === -1) {
      return res.status(403).send({ error: "Forbidden" });
    }
    // Extract event ID from request parameters
    const { id } = req.params as { id: string };
    if (!id) {
      return res.status(400).send({ error: "Event ID is required" });
    }
    // Update the event status to 'ended'
    const updateResult = await Orm_db.update({
      server: req.server,
      table_name: "events",
      colums_name: ["status"],
      colums_values: ["completed"],
      condition: `WHERE id = "${id}"`,
    });
    return res.status(200).send({ message: "Event ended successfully" });
  } catch (error) {
    console.error("Error ending event:", error);
    return res.status(400).send({ error: "Error updating event status" });
  }
};

export const updateEvent = (req: FastifyRequest, resp: FastifyReply) => {
  req
    .jwtVerify()
    .then(async () => {
      const userData: user_authData = await req.jwtDecode();
      const privilegeCheck = await checkingUserPrivilege(req, resp, userData);
      if (privilegeCheck === -1) {
        return resp.status(403).send({ error: "Forbidden" });
      }

      const { id } = req.params as { id: string };
      if (!id) {
        return resp.status(400).send({ error: "Event ID is required" });
      }
      const body = req.body as Record<string, any>;
      if (!body || Object.keys(body).length === 0) {
        return resp
          .status(400)
          .send({ error: "No fields provided for update" });
      }
      // Filter valid fields
      const updateFields = Object.entries(body).filter(([key, _]) =>
        allowedEventFields.includes(key)
      );
      if (updateFields.length === 0) {
        return resp
          .status(400)
          .send({ error: "No valid fields provided for update" });
      }
      // Extract keys and values
      const columns = updateFields.map(([key, _]) => key);
      const values = updateFields.map(([_, value]) => value);

      // Execute the update
      const updateResult = await Orm_db.update({
        server: req.server,
        table_name: "events",
        colums_name: columns,
        colums_values: values,
        condition: `WHERE id = "${id}"`,
      });
      return resp.status(200).send({ message: "Event updated successfully" });
    })
    .catch((err) => {
      console.error("JWT verification failed:", err);
      return resp.status(401).send({ error: "Unauthorized" });
    });
};
