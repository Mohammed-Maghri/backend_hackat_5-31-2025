const update = async ({ server, table_name, colums_name, colums_values, condition, }) => {
    try {
        return await server.db.run(`update ${table_name} set ${colums_name
            .map((item) => item + "=?")
            .toString()} ${condition}`, colums_values);
    }
    catch (e) {
        return e;
    }
};
const deletion = async ({ server, condition, table_name }) => {
    try {
        return await server.db.run(`delete from ${table_name} ${condition}`);
    }
    catch (e) {
        return e;
    }
};
const insertion = async ({ server, table_name, colums_name, colums_values, command_instraction, }) => {
    try {
        if (command_instraction != null) {
            return await server.db.run(`insert into ? (${colums_name.toString()}) values (${colums_name
                .map(() => " ? ")
                .toString()}) ${command_instraction}`, [table_name, colums_values.toString()]);
        }
        else {
            return await server.db.run(`insert into ${table_name} (${colums_name.toString()}) values (${colums_name
                .map(() => " ? ")
                .toString()})`, [colums_values.toString()]);
        }
    }
    catch (e) {
        return e;
    }
};
const selection = async ({ server, table_name, colums_name, command_instraction, }) => {
    try {
        if (command_instraction != null) {
            return await server.db.all(`select ${colums_name.toString()} from ${table_name} ${command_instraction};`);
        }
        else {
            return await server.db.all(`select ${colums_name.toString()} from ${table_name};`);
        }
    }
    catch (e) {
        return e;
    }
};
const Orm_db = {
    insertion: insertion,
    selection: selection,
    update: update,
    deletion: deletion,
};
export { Orm_db };
