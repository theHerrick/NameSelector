const sql = require('mssql');

const connectionString = process.env.sqlConnection

module.exports = async function (context, req) {
    switch (req.method) {
        case 'GET':
            await handleGetRequest(context);
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
        await sql.connect(connectionString);

        // Query the database
        const result = await sql.query`SELECT id, teamName FROM teams`;

        // Close the database connection
        sql.close();

        // Extract the rows from the result
        const values = result.recordset.map((row) => ({
            id: row.id,
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
