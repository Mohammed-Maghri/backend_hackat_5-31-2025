import { Orm_db } from "../orm.js";
import { shouldSearch } from "../helpers/searchParser.js";
export const eventCreation = async (req, resp) => {
    const eventData = req.body;
    console.log("The event Data is -------->", eventData);
    try {
        await req.jwtVerify();
        const user = (await req.jwtDecode()); // get user data from JWT
        const existingEvent = (await Orm_db.selection({
            server: req.server,
            table_name: "events",
            colums_name: ["id"],
            command_instraction: `WHERE title = '${eventData.title}' AND date = '${eventData.date}'`,
        }));
        if (existingEvent.length > 0) {
            return resp.badRequest("Event with the same title and date already exists.");
        }
        const userId = (await Orm_db.selection({
            server: req.server,
            table_name: "users",
            colums_name: ["id"],
            command_instraction: `WHERE login = '${user.login}'`,
        }));
        if (userId.length === 0) {
            console.log("No existing user");
            return resp.badRequest("User not found");
        }
        console.log(userId, "userId of the user");
        const result = await Orm_db.insertion({
            server: req.server,
            table_name: "events",
            colums_name: [
                "title",
                "description",
                "location",
                "date",
                "image_url",
                "latitude",
                "longitude",
                "status",
                "category_id",
                "creator_id",
                "slots",
            ],
            colums_values: [
                eventData.title,
                eventData.description,
                eventData.location,
                eventData.date,
                eventData.image_url || "",
                eventData.latitude,
                eventData.longitude,
                eventData.status,
                eventData.category_id,
                userId,
                eventData.slots,
            ],
            command_instraction: null,
        });
        console.log("result of the insertion query", result);
        resp.status(200).send({ message: "/event endpoint hit" });
    }
    catch (e) {
        console.error("Error inserting event data:", e);
        resp.status(500).send({ error: "Failed to insert event data" });
        return;
    }
};
export const eventEndPoint = async (req, res) => {
    try {
        console.log("testing api call");
        const geterOject = req.query;
        const queryFilter = {
            title: geterOject.title || "",
            category_id: geterOject.category_id || "",
            start_date: geterOject.start_date || "",
            end_date: geterOject.end_date || "",
            page: geterOject.page || "",
        };
        return res.status(200).send({
            events: await Orm_db.selection({
                server: req.server,
                table_name: "events",
                colums_name: ["*"],
                command_instraction: shouldSearch(queryFilter),
            }),
        });
    }
    catch (e) {
        return res.status(400).send({ status: "Error !" });
    }
};
export const eventRegister = async (req, res) => {
    try {
        await req.jwtVerify();
        const user = (await req.jwtDecode()); // get user data from JWT
        console.log("------> This -<<<   ", user);
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).send({ error: "Unauthorized" });
    }
    res.status(200).send({ logs: "eventRegister endpoint hit !" });
};
