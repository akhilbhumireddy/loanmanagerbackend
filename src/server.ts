import { openDb } from "./db";
import app from "./app";

const PORT =  2000;

(async () => {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL CHECK(role IN ('user', 'verifier', 'admin'))
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      fullName TEXT NOT NULL,
      loanAmount REAL NOT NULL,
      loanTenure INTEGER NOT NULL,
      employmentStatus TEXT NOT NULL,
      employmentAddress TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `);

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
