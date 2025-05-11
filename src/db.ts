import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Open the database connection
export const openDb = async () => {
  return open({
    filename: './loanmanager.db',
    driver: sqlite3.Database
  });
};
