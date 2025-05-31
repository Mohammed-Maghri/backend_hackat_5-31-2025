const url = async (req, res) => {
    try {
        const code = req.query;
        console.log(' ------< ', code.code);
        const red = new URL("mrboha://auth?token=asdasdasd");
        const validateQuery = await fetch("  https://5a8d-197-230-30-146.ngrok-free.app/auth/intra", {
            method: "POST",
            body: JSON.stringify({ code: code.code })
        });
        if (!validateQuery.ok)
            throw new Error(validateQuery.statusText);
        return res.status(200).send({ tokens: await validateQuery.json() });
    }
    catch (e) {
        console.log(e);
        res.status(400).send({ error: "Error Bad Req !" });
    }
};
export { url };
