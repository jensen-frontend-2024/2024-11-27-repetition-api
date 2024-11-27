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

const getCustomerById = (req, res) => {
  const { id } = req.params;

  // parseInt will return NaN if the parsing doesn't work. NaN is always falsy.
  if (!parseInt(id)) {
    return res.status(400).json({ message: "Id must be a number" });
  }

  const query = `SELECT * FROM customers WHERE CustomerId = ?`;
  const stmt = db.prepare(query);
  const customer = stmt.get([id]);

  if (!customer) {
    return res
      .status(404)
      .json({ message: `Customer with id ${id} doesn't exist.` });
  }

  return res.json(customer);
};

const getCustomerByIdWithInvoices = (req, res) => {
  // ########## Get customer first ##########
  const { id } = req.params;

  if (!parseInt(id)) {
    return res.status(400).json({ message: "Id must be a number" });
  }

  const query = `SELECT CustomerId, FirstName, LastName FROM customers WHERE CustomerId = ?`;
  const stmt = db.prepare(query);
  const customer = stmt.get([id]);

  if (!customer) {
    return res
      .status(404)
      .json({ message: `Customer with id ${id} doesn't exist.` });
  }

  // ########## Get invoices on the customer ##########

  const invoiceQuery = `SELECT InvoiceId, Total FROM invoices WHERE CustomerId = ?`;
  const invoiceStmt = db.prepare(invoiceQuery);
  const invoices = invoiceStmt.all([id]);

  if (invoices.length === 0) {
    return res
      .status(404)
      .json({ message: `Customer with id ${id}, doesn't have any invoices` });
  }

  const customerWithInvoices = {
    ...customer, // Will copy all the key-value pairs from the customer object
    invoices, // invoices: invoices
  };

  return res.json(customerWithInvoices);

  // ########## Put them together and send a response ##########
};

const postCustomer = (req, res) => {
  const { body } = req;
  const { FirstName, LastName, Email } = body;

  // Ternary operator
  const bodyIsComplete = FirstName && LastName && Email ? true : false;

  if (bodyIsComplete === false) {
    return res
      .status(400)
      .json({ message: "Body is not complete or malformed" });
  }

  const query = `
    INSERT INTO customers (Firstname, LastName, Email)
    VALUES (?, ?, ?)
  `;

  const stmt = db.prepare(query);

  // lastInsertRowId is something the db returns to us after a successfull creation. We can use this to get the newly create customer.
  const { lastInsertRowid } = stmt.run([FirstName, LastName, Email]);

  const customerQuery = `SELECT * FROM customers WHERE CustomerId = ?`;
  const customerStmt = db.prepare(customerQuery);
  const customer = customerStmt.get([lastInsertRowid]);

  return res
    .status(201)
    .json({
      message: "Customer was successfully created",
      newCustomer: customer,
    });
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  getCustomerByIdWithInvoices,
  postCustomer,
};
