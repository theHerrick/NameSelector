const sql = require("mssql");

module.exports = async function (context, req) {
  switch (req.method) {
    case "GET":
      await handleGetRequest(context);
      break;
    default:
      context.res = {
        status: 405,
        body: "Method not allowed.",
      };
  }
};

async function handleGetRequest(context) {
  try {
    const pool = await sql.connect({
      server: "nameselectorukssql.database.windows.net",
      database: "nameselector",
      authentication: {
        type: "azure-active-directory-msi-app-service",
      },
      options: {
        encrypt: true,
        enableArithAbort: true,
      },
    });

    const result = await pool.request().query("SELECT id, teamName FROM teams");
    const values = result.recordset.map((row) => ({
      id: row.id,
      teamName: row.teamName,
    }));

    context.res = {
      status: 200,
      body: values,
    };
  } catch (error) {
    context.log.error(`Error: ${error.message}`, error);
    context.res = {
      status: 500,
      body: "An internal server error occurred.",
    };
  } finally {
    sql.close();
  }
}
