import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// Let's initialize it as null initially, and we will assign the actual database instance later.
let db = null;

// Define the GET request handler function
export async function GET(req, res) {
  // Check if the database instance has been initialized
  if (!db) {
    // If the database instance is not initialized, open the database connection
    db = await open({
      filename: "./collection.db", // Specify the database file path
      driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
    });
  }

  // Perform a database query to retrieve all items from the "items" table
  // const columns = await db.all("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMN WHERE TABLE_NAME = N'pitsurvey'")
  const items = await db.all("SELECT * FROM pitsurvey");

  // Return the items as a JSON response with status 200
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}

export async function POST(req) {
      // Check if the database instance has been initialized
  if (!db) {
    // If the database instance is not initialized, open the database connection
    db = await open({
      filename: "./collection.db", // Specify the database file path
      driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
    });
    console.log("opened DB connection...")
  }

  const  body = await req.json()
  const {teamNumber, drivetrain, prefPos, vision, scoreHeight, pickup, climb, helpClimb, scoreClimb, investigate, name} = body
  const tempToInsert = [teamNumber, drivetrain, prefPos, vision, scoreHeight, pickup, climb, helpClimb, scoreClimb, investigate, name]
  const insertSql = `INSERT INTO pitsurvey(team_num, drivetrain, preferred_pos, vision, score_height, pickup_pos, can_climb, help_climb, score_and_climb, investigate, name) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // console.log(tempToInsert)

  db.run(insertSql, tempToInsert, function (err) {
    if (err) {
        console.error(err.message);
        return new Response(
          JSON.stringify({
            message: `${err.message}`,
          }),
          {
            headers: { 
              "Content-Type": "application/json",
            },
            status: 500
          }
        )
    }
    
    const id = this.lastID; // get the id of the last inserted row
    console.log(`Rows inserted, ID ${id}`);

  //   Close the database connection after all insertions are done
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Closed DB connection.");
  });
});

  return new Response(
    JSON.stringify({
      message: `Success!`,
    }),
    {
      headers: { 
        "Content-Type": "application/json",
      },
      status: 200
    }
  )
}