const {
  getAllCustomers,
  getCustomerById,
  getCustomerByIdWithInvoices,
  postCustomer,
} = require("./customer.controller.js");

const express = require("express");
const app = express();

// Makes sure there is a body attribute on the req object
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("App is running!");
});

app.get("/customers", getAllCustomers);
app.get("/customers/:id", getCustomerById);
app.get("/customers/:id/with-invoices", getCustomerByIdWithInvoices);
app.post("/customers", postCustomer);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
