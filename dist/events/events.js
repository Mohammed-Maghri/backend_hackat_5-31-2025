import { Orm_db } from "../orm";
const eventEndPoint = async (req, res) => {
    try {
        const geterOject = req.query;
        const queryFilter = {
            search: geterOject.search || "",
            category: geterOject.category || "",
            start_date: geterOject.start_date || "",
            end_date: geterOject.end_date || "",
            page: geterOject.page || "",
        };
        console.log(" ===>? ", queryFilter);
        await Orm_db.selection({
            server: req.server,
            table_name: "events",
            colums_name: ["*"],
            command_instraction: `where id == ${req.id}`,
        });
        // console.log(" ---> ", queryFilter);
        return res.status(200).send({ staus: "Good !" });
    }
    catch (e) {
        return res.status(400).send({ status: "Error !" });
    }
};
export { eventEndPoint };
