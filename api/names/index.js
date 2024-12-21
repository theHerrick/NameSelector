const sql = require("mssql");

const connectionConfig = {
  server: "nameselectorukssql.database.windows.net",
  database: "nameselector",
  authentication: {
    type: "azure-active-directory-msi-app-service",
  },
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

module.exports = async function (context, req) {
  switch (req.method) {
    case "GET":
      if (req.query && req.query.teamName) {
        await handleGetRequest(context, req.query.teamName);
      } else {
        context.res = {
          status: 400,
          body: "Please provide teamName.",
        };
      }
      break;
    case "POST":
      await handlePostRequest(context, req);
      break;
    case "DELETE":
      await handleDeleteRequest(context, req);
      break;
    default:
      context.res = {
        status: 405,
        body: "Method not allowed.",
      };
  }
};

async function handleGetRequest(context, teamName) {
  let pool;
  try {
    pool = await sql.connect(connectionConfig);

    const result = await pool
      .request()
      .input("teamName", sql.NVarChar, teamName)
      .query("SELECT * FROM names WHERE teamName = @teamName");

    const values = result.recordset.map((row) => ({
      id: row.id,
      firstName: row.firstName,
      email: row.email,
      teamName: row.teamName,
    }));

    context.res = {
      status: 200,
      body: values,
    };
  } catch (error) {
    context.log.error("Error", error);
    context.res = {
      status: 500,
      body: "An internal server error occurred.",
    };
  } finally {
    if (pool) await pool.close();
  }
}

async function handlePostRequest(context, req) {
  let pool;
  try {
    const requestBody = req.body;
    pool = await sql.connect(connectionConfig);

    await pool
      .request()
      .input("firstName", sql.NVarChar, requestBody.firstName)
      .input("email", sql.NVarChar, requestBody.email)
      .input("teamName", sql.NVarChar, requestBody.teamName)
      .query(
        "INSERT INTO names (firstName, email, teamName) VALUES (@firstName, @email, @teamName)"
      );

    context.res = {
      status: 200,
      body: "Data successfully inserted.",
    };
  } catch (error) {
    context.log.error("Error:", error);
    context.res = {
      status: 500,
      body: "An internal server error occurred.",
    };
  } finally {
    if (pool) await pool.close();
  }
}

async function handleDeleteRequest(context, req) {
  let pool;
  try {
    const id = req.query.id;
    pool = await sql.connect(connectionConfig);

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM names WHERE id = @id");

    if (result.rowsAffected[0] > 0) {
      context.res = {
        status: 200,
        body: `Record with id '${id}' successfully deleted.`,
      };
    } else {
      context.res = {
        status: 404,
        body: `Record with id '${id}' not found.`,
      };
    }
  } catch (error) {
    context.log.error("Error:", error);
    context.res = {
      status: 500,
      body: "An internal server error occurred.",
    };
  } finally {
    if (pool) await pool.close();
  }
}
