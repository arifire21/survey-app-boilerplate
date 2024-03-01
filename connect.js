const sqlite3 = require("sqlite3").verbose();

// Connecting to or creating a new SQLite database file
const db = new sqlite3.Database(
  "./collection.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQlite database.");
  }
);

// Serialize method ensures that database queries are executed sequentially
db.serialize(() => {
  // Create the items table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS pitsurvey (
        id INTEGER PRIMARY KEY,
        team_num TEXT,
        drivetrain TEXT,
        preferred_pos TEXT,
        vision TEXT,
        score_height TEXT,
        pickup_pos TEXT,
        can_climb TEXT,
        help_climb TEXT,
        score_and_climb TEXT,
        investigate TEXT,
        name TEXT
      )`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Created pitsurvey table, or already existed.");
    }
  )

  // Clear the existing data in the products table
  // db.run(`DELETE FROM pitsurvey`, (err) => {
  //   if (err) {
  //     return console.error(err.message);
  //   }
  //   console.log("REMOVE AFTER TESTING All rows deleted from pitsurvey.");
  // });

    //   Close the database connection after all insertions are done
    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Closed the database connection.");
    });
});