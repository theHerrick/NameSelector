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
        case 'PUT':
            await handlePutRequest(context, req);
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
        const result = await sql.query`SELECT teamName, createdBy FROM teams`;

        // Close the database connection
        sql.close();

        // Extract the rows from the result
        const values = result.recordset.map((row) => ({
            teamName: row.teamName,
            createdBy: row.createdBy,
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
        await sql.query`INSERT INTO teams (teamName, createdBy) VALUES (${requestBody.teamName}, ${requestBody.createdBy})`;

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

async function handlePutRequest(context, req) {
    try {
        const requestBody = req.body; // Assuming the request body contains the updated createdBy value
        const teamName = req.query.teamName; // Assuming the teamName is passed as a query parameter in the URL

        console.log('Received teamName:', teamName); // Add this line to log the received value

        // Connect to the database
        await sql.connect(config);

        // Perform the update operation
        await sql.query`UPDATE teams SET createdBy = ${requestBody.createdBy} WHERE teamName = ${teamName}`;

        // Close the database connection
        sql.close();

        context.res = {
            status: 200,
            body: `Team with teamName '${teamName}' successfully updated createdBy.`,
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
        const teamName = req.query.teamName; // Assuming the teamName is passed as a query parameter

        // Connect to the database
        await sql.connect(config);

        // Perform the delete operation
        await sql.query`DELETE FROM teams WHERE teamName = ${teamName}`;

        // Close the database connection
        sql.close();

        context.res = {
            status: 200,
            body: `Team with teamName '${teamName}' successfully deleted.`,
        };
    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            body: 'An internal server error occurred.',
        };
    }
}
