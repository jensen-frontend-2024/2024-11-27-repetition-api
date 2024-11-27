const Database = require("better-sqlite3");
const db = new Database("chinook.db");

const getAllCustomers = (req, res) => {
  const query = `SELECT * FROM customers`;
  const stmt = db.prepare(query);
  const customers = stmt.all();

  if (customers.length === 0) {
    return res.status(404).json({ message: "No customers found" });
  }

  return res.json(customers);
};

module.exports = { getAllCustomers };
