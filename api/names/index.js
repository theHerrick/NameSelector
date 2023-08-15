const sql = require('mssql');

const config = {
    server: '',
    database: '',
    user: '',
    password: '',
    options: {
        encrypt: true,
        enableArithAbort: true,
    },
};

module.exports = async function (context, req) {
    switch (req.method) {
        case 'GET':
            await handleGetRequest(context);
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

async function handleGetRequest(context) {
    try {
        // Connect to the database
        await sql.connect(config);

        // Query the database
        const result = await sql.query`SELECT id, firstName, teamName FROM names`;

        // Close the database connection
        sql.close();

        // Extract the rows from the result
        const values = result.recordset.map((row) => ({
            id: row.id,
            firstName: row.firstName,
            teamName: row.teamName,
        }));

        // Return the values
        context.res = {
            status: 200,
            body: values,
        };
    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            body: 'An internal server error occurred.',
        };
    }
}

async function handlePostRequest(context, req) {
    try {
        const requestBody = req.body; // Assuming the request body contains the data to be inserted

        // Connect to the database
        await sql.connect(config);

        // Perform the insert operation
        await sql.query`INSERT INTO names (firstName, teamName) VALUES (${requestBody.firstName}, ${requestBody.teamName})`;

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
        await sql.connect(config);

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
