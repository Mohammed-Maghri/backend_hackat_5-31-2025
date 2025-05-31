export const eventCreation = async (req, resp) => {
    const eventData = req.body;
    console.log("The event Data is -------->", eventData);
    console.log("Creation of the route ");
    resp.status(200).send({ message: "/event endpoint hit" });
};
