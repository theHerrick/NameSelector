const sql = require('mssql');

const connectionString = process.env.sqlConnection

module.exports = async function (context, req) {
    switch (req.method) {
        case 'GET':
            if (req.query && req.query.teamName) {
                await handleGetRequest(context, connectionString, req.query.teamName);
            } else {
                context.res = {
                    status: 400,
                    body: "Please provide teamName."
                };
            }
            break;
        case 'POST':
            await handlePostRequest(context, req);
            break;
        case 'DELETE':
            await handleDeleteRequest(context, req);
            break;
        default:
            context.res = {
                status: 405, // Method Not Allowed
                body: 'Method not allowed.',
            };
    }
};

async function handleGetRequest(context, connectionString, teamName) {
    try {
        await sql.connect(connectionString);

        const result = 
            await sql.query`SELECT * FROM names WHERE teamName = ${teamName}`;

        sql.close();

        const values = result.recordset.map((row) => ({
            id: row.id,
            firstName: row.firstName,
            email: row.email,
            teamName: row.teamName,
        }));

        context.res = {
            status: 200,
            body: values
        };
    } catch (error) {
        context.log.error("Error", error);
        context.res = {
            status: 500,
            body: "An internal server error occured.",
        };
    }
}


async function handlePostRequest(context, req) {
    try {
        const requestBody = req.body; // Assuming the request body contains the data to be inserted

        // Connect to the database
        await sql.connect(connectionString);

        // Perform the insert operation
        await sql.query`INSERT INTO names (firstName, email, teamName) VALUES (${requestBody.firstName}, ${requestBody.email}, ${requestBody.teamName})`;

        // Close the database connection
        sql.close();

        context.res = {
            status: 200,
            body: 'Data successfully inserted.',
        };
    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            body: 'An internal server error occurred.',
        };
    }
}

async function handleDeleteRequest(context, req) {
    try {
        const id = req.query.id; // Assuming the id is passed as a query parameter

        // Connect to the database
        await sql.connect(connectionString);

        // Perform the delete operation
        await sql.query`DELETE FROM names WHERE id = ${id}`;

        // Close the database connection
        sql.close();

        context.res = {
            status: 200,
            body: `Record with id '${id}' successfully deleted.`,
        };
    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            body: 'An internal server error occurred.',
        };
    }
}
