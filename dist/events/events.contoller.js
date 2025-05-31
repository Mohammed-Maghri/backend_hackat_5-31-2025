import { Orm_db } from "../orm.js";
const shouldSearch = (queryFilter) => {
    let search_ToAppend = "";
    if (queryFilter.title !== "") {
        if (search_ToAppend !== "")
            search_ToAppend += " and ";
        search_ToAppend += `title == "${queryFilter.title}"`;
    }
    if (queryFilter.category_id !== "") {
        if (search_ToAppend !== "")
            search_ToAppend += " and ";
        search_ToAppend += `date == "${queryFilter.category_id}"`;
    }
    if (queryFilter.start_date !== "") {
        if (search_ToAppend !== "")
            search_ToAppend += " and ";
        search_ToAppend += `created_at >= "${queryFilter.start_date}"`;
    }
    if (queryFilter.end_date !== "") {
        if (search_ToAppend !== "")
            search_ToAppend += " and ";
        search_ToAppend += `date <= "${queryFilter.end_date}"`;
    }
    if (queryFilter.page !== "") {
        if (search_ToAppend !== "")
            search_ToAppend += " and ";
        search_ToAppend += `page == "${queryFilter.page}"`;
    }
    if (search_ToAppend !== "") {
        return `where ${search_ToAppend}`;
    }
    else
        return null;
};
const eventEndPoint = async (req, res) => {
    try {
        const geterOject = req.query;
        const queryFilter = {
            title: geterOject.title || "",
            category_id: geterOject.category_id || "",
            start_date: geterOject.start_date || "",
            end_date: geterOject.end_date || "",
            page: geterOject.page || "",
        };
        // console.log(" ---> ", queryFilter);
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
export { eventEndPoint };
